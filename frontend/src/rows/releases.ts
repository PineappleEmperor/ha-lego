import {
  css,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import { loadReleases } from "../api";
import { CHANGED, FILTER, LegoRow, define } from "../base";
import {
  ROW_SPANS,
  accountCall,
  SPAN_HINTS,
  TIMELINE_MONTHS,
  count,
  displayName,
  errorText,
  monthsFrom,
  releaseFilter,
  spanLabel,
  stackOffsets,
  stackTimeline,
  timelineView,
  toggleTheme,
  type ResolvedFilter,
  type Stack,
} from "../format";
import { slotColour, themeSlots } from "../palette";
import { chipLayout, chipPress, pressMyThemes } from "../state";
import type {
  FollowResult,
  ReleaseRow,
  Releases,
  Span,
  ThemeList,
} from "../types";

/** Rows with a theme filter and the timeline; the fixed rows have neither. */
const FILTERED: ReleaseRow[] = ["releases", "themes"];
/** Sets a timeline stack's card names before it counts the rest. */
const TIP_SETS = 6;
/** How long a press on a theme chip lasts before the chips start to wiggle. */
const HOLD_MS = 500;

/**
 * A row of new sets. "releases" is the combined row, filtered by scope, themes and
 * span; "recent", "upcoming" and "themes" are the same sets split into fixed rows.
 * The filters open on what the user picked last, which Customise can also set.
 */
export class LegoReleasesRow extends LegoRow {
  @property() public kind: ReleaseRow = "releases";

  @state() private filter?: ResolvedFilter;
  @state() private data?: Releases;
  @state() private error = "";
  /** The follow editor: open, the themes on offer, and what is typed. */
  @state() private adding = false;
  @state() private themeList?: ThemeList;
  @state() private draft = "";
  @state() private following = false;
  @state() private followNote = "";
  /** Whether the followed themes' own chips show under My themes. */
  @state() private themesOpen = false;
  /** Holding a theme chip sets the chips wiggling, each with a × to unfollow it. */
  @state() private wiggling = false;
  private holdTimer?: number;
  private held = false;

  private holdStart = (): void => {
    if (!this.dash?.can_change || this.wiggling) return;
    window.clearTimeout(this.holdTimer);
    this.holdTimer = window.setTimeout(() => {
      this.held = true;
      this.wiggling = true;
    }, HOLD_MS);
  };

  private holdEnd = (): void => {
    window.clearTimeout(this.holdTimer);
  };

  private onKey = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape" && this.wiggling) this.wiggling = false;
  };
  /** A phone-width row: the timeline shows only the span, and scrolls. */
  @state() private compact = false;
  /** On a phone, the stack whose sets are listed below the timeline. */
  @state() private openStack?: Stack;

  private sizer?: ResizeObserver;
  private scrolledFor = "";

  public override connectedCallback(): void {
    super.connectedCallback();
    this.sizer = new ResizeObserver(([entry]) => {
      this.compact = entry.contentRect.width < 720;
    });
    this.sizer.observe(this);
    this.addEventListener("keydown", this.onKey);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sizer?.disconnect();
    this.removeEventListener("keydown", this.onKey);
    window.clearTimeout(this.holdTimer);
  }

  private filterFor = "";
  private requested = "";
  private requestedWith?: object;

  protected get row(): string {
    return this.kind;
  }

  static override styles = [
    LegoRow.styles,
    css`
      /* A theme chip and, while the chips wiggle, its × in the corner. */
      .chipwrap {
        display: inline-flex;
        position: relative;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .chipwrap .remove {
        align-items: center;
        appearance: none;
        background: var(--lego-text);
        border: 2px solid var(--lego-surface);
        border-radius: 50%;
        color: var(--lego-surface);
        cursor: pointer;
        display: flex;
        height: 24px;
        justify-content: center;
        padding: 0;
        position: absolute;
        right: -8px;
        top: -8px;
        width: 24px;
        --mdc-icon-size: 14px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .chipwrap.wiggle .chip {
          animation: wiggle 0.3s ease-in-out infinite alternate;
        }
        .chipwrap.wiggle:nth-child(odd) .chip {
          animation-delay: -0.15s;
        }
      }
      @keyframes wiggle {
        from {
          transform: rotate(-1.5deg);
        }
        to {
          transform: rotate(1.5deg);
        }
      }
      .follow {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px);
        margin: 0 0 var(--ha-space-3, 12px);
      }
      .follow input {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-sizing: border-box;
        color: inherit;
        flex: 1 1 220px;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 40px;
        padding: 0 var(--ha-space-3, 12px);
      }
      .chip .drop {
        --mdc-icon-size: 18px;
        margin-inline-end: calc(-1 * var(--ha-space-2, 8px));
      }
      .timeline {
        height: 64px;
        margin: var(--ha-space-2, 8px) 0 var(--ha-space-3, 12px);
        position: relative;
      }
      .timeline .line {
        background: var(--lego-outline);
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
        top: 20px;
      }
      .timeline .window {
        background: var(--lego-pick);
        border-radius: var(--ha-border-radius-sm, 4px);
        height: 34px;
        position: absolute;
        top: 4px;
      }
      .timeline .stack {
        appearance: none;
        background: none;
        border: 0;
        border-radius: 50%;
        cursor: default;
        height: 24px;
        padding: 0;
        position: absolute;
        top: 21px;
        transform: translate(-50%, -50%);
        width: 24px;
      }
      .timeline .stack:hover,
      .timeline .stack:focus-visible {
        z-index: 30;
      }
      .timeline .stack.out {
        opacity: 0.35;
      }
      .timeline .disc {
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--lego-surface);
        height: 10px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, calc(-50% + var(--rest, 0px)));
        transition: transform var(--ha-animation-duration-normal, 250ms)
          ease-out;
        width: 10px;
      }
      /* The overlapping discs spread apart, so each can be told from the next. */
      .timeline .stack:hover .disc,
      .timeline .stack:focus-visible .disc {
        transform: translate(-50%, calc(-50% + var(--fan, 0px)));
      }
      .timeline .extra {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        color: var(--lego-text);
        font-size: 10px;
        font-weight: var(--ha-font-weight-bold, 700);
        left: calc(50% + 9px);
        line-height: 14px;
        padding: 0 4px;
        position: absolute;
        top: 5px;
      }
      .timeline .tip {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        color: var(--lego-text);
        display: grid;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-1, 4px);
        left: 50%;
        max-width: 280px;
        min-width: 200px;
        opacity: 0;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
        pointer-events: none;
        position: absolute;
        text-align: start;
        top: calc(100% + 32px);
        transform: translateX(-50%);
        transition: opacity var(--ha-animation-duration-fast, 150ms);
        visibility: hidden;
        width: max-content;
      }
      .timeline .tip.start {
        left: 0;
        transform: none;
      }
      .timeline .tip.end {
        left: auto;
        right: 0;
        transform: none;
      }
      .timeline .stack:hover .tip,
      .timeline .stack:focus-visible .tip {
        opacity: 1;
        visibility: visible;
      }
      .timeline .tipline {
        align-items: center;
        display: grid;
        gap: var(--ha-space-2, 8px);
        grid-template-columns: 10px minmax(0, 1fr) auto;
      }
      .timeline .tipname {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .timeline .tipdate,
      .timeline .tipmore {
        color: var(--lego-text-2);
        font-variant-numeric: tabular-nums;
      }
      .timeline .today {
        --mdc-icon-size: 20px;
        color: var(--lego-primary);
        position: absolute;
        top: 6px;
        transform: translateX(-50%);
      }
      .timeline .month {
        color: var(--lego-text-2);
        font-size: 11px;
        position: absolute;
        text-align: center;
        top: 46px;
      }
      /* On a phone the timeline is drawn wider than the row and scrolls, so the
         hover card, which would be clipped, gives way to the list below it. */
      .timescroll.compact {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: thin;
      }
      .timescroll.compact .tip {
        display: none;
      }
      .picked {
        background: var(--lego-ground);
        border-radius: var(--ha-border-radius-md, 8px);
        display: grid;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-1, 4px);
        margin: 0 0 var(--ha-space-3, 12px);
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      }
      .picked .tipline {
        align-items: center;
        display: grid;
        gap: var(--ha-space-2, 8px);
        grid-template-columns: 10px minmax(0, 1fr) auto;
      }
      .picked .tipname {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .picked .tipdate {
        color: var(--lego-text-2);
        font-variant-numeric: tabular-nums;
      }
    `,
  ];

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const key = `${this.dash?.entry_id}:${this.kind}`;
    // A new account or row kind opens on its defaults; a reload of the same
    // account keeps whatever was picked this visit.
    if (this.dash && key !== this.filterFor) {
      this.filterFor = key;
      this.filter = releaseFilter(this.kind, this.dash);
      this.data = undefined;
    }
  }

  protected override updated(): void {
    if (!this.collapsed && this.filter && this.dash && this.hass) {
      void this.fetch();
    }
    this.scrollToToday();
  }

  /** On a phone, open a scrolling timeline on today, once for each span picked. */
  private scrollToToday(): void {
    const scroller = this.renderRoot.querySelector<HTMLElement>(
      ".timescroll.compact",
    );
    const today = scroller?.querySelector<HTMLElement>(".today");
    const key = `${this.filter?.span}:${this.data?.span.from}`;
    if (!scroller || !today || key === this.scrolledFor) return;
    this.scrolledFor = key;
    scroller.scrollLeft = today.offsetLeft - scroller.clientWidth / 2;
  }

  private async fetch(): Promise<void> {
    const filter = this.filter;
    const dash = this.dash;
    if (!filter || !dash || dash.release_status[filter.scope] === null) return;
    const key = JSON.stringify([dash.entry_id, filter]);
    // The dashboard object changes after a write, and the cards' owned flags with it.
    if (key === this.requested && this.requestedWith === dash) return;
    this.requested = key;
    this.requestedWith = dash;
    try {
      const data = await loadReleases(this.hass, dash.entry_id, filter);
      if (this.requested === key) {
        this.data = data;
        this.error = "";
      }
    } catch (err) {
      if (this.requested === key) this.error = errorText(err);
    }
  }

  /** Apply a pick at once, and keep it as this row's default for the next visit. */
  private pick(change: Partial<ResolvedFilter>): void {
    if (!this.filter) return;
    this.filter = { ...this.filter, ...change };
    this.openStack = undefined;
    const { scope, themes, span } = this.filter;
    const saved = { scope, themes, span };
    this.hass
      .callWS({
        type: "lego/panel_config/set",
        release_filters: { [this.kind]: saved },
      })
      .catch(() => {
        // The pick has already been applied; it just will not survive a reload.
      });
    // So the panel's own copy, which Customise saves from, does not undo it.
    this.dispatchEvent(
      new CustomEvent(FILTER, {
        detail: { row: this.kind, filter: saved },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private status() {
    return this.filter
      ? this.dash?.release_status[this.filter.scope]
      : undefined;
  }

  protected subtitle(): string {
    const status = this.status();
    if (status === null || status === undefined) return "";
    if (status === "fetching") return "Fetching releases…";
    if (status === "failed") return "Couldn't fetch releases";
    if (!this.data) return "Loading…";
    return count(this.data.sets.length, "set", "sets");
  }

  protected override actions(): TemplateResult | typeof nothing {
    // A row with one span has nothing to pick.
    if (
      !this.filter ||
      this.status() === null ||
      ROW_SPANS[this.kind].length < 2
    ) {
      return nothing;
    }
    return html`<div class="pills" role="group" aria-label="Time span">
      ${ROW_SPANS[this.kind].map(
        (span: Span) =>
          html`<button
            class=${span === this.filter?.span ? "pill on" : "pill"}
            aria-pressed=${span === this.filter?.span}
            title=${SPAN_HINTS[span] ?? nothing}
            @click=${() => this.pick({ span })}
          >
            ${spanLabel(span)}
          </button>`,
      )}
    </div>`;
  }

  protected body(): TemplateResult {
    const filter = this.filter;
    const dash = this.dash;
    if (!filter || !dash) return html`<p class="muted">Loading…</p>`;
    const status = this.status();
    if (status === null) {
      return html`<p class="muted">${this.unavailable()}</p>
        ${this.kind === "recent" || this.kind === "upcoming" ? nothing : this.followControls()}`;
    }
    if (status === "fetching") {
      return html`<p class="muted">Fetching this year's releases…</p>`;
    }
    if (status === "failed") {
      return html`<p class="muted">
        Couldn't fetch this year's releases. They're tried again every few hours
        until they arrive.
      </p>`;
    }
    return html`
      ${FILTERED.includes(this.kind) ? this.chips(filter) : nothing}
      ${
        FILTERED.includes(this.kind) && this.data
          ? this.timeline(this.data)
          : nothing
      }
      ${this.error ? html`<p class="caveat bad">${this.error}</p>` : nothing}
      ${this.cards()}
    `;
  }

  private unavailable(): string {
    if (this.kind === "recent" || this.kind === "upcoming") {
      return "Turn on Follow releases across all themes in the integration's options for this row.";
    }
    if (this.kind === "themes") {
      return this.dash?.can_change
        ? "No themes followed yet. Follow one to see its new sets here."
        : "No themes followed yet.";
    }
    return this.dash?.can_change
      ? "Follow a theme, or turn on Follow releases across all themes in the integration's options, to see new sets here."
      : "No themes followed yet.";
  }

  private chips(filter: ResolvedFilter): TemplateResult {
    const dash = this.dash!;
    const slots = themeSlots(dash.followed);
    const mine = filter.scope === "mine";
    const allOn = dash.release_status.all !== null;
    // Everything shows even while it is off, so the way to every theme is found.
    const everything = html`<button
      class=${filter.scope === "all" ? "chip on" : allOn ? "chip" : "chip off"}
      aria-pressed=${filter.scope === "all"}
      aria-disabled=${!allOn}
      @click=${() => {
        if (!allOn) {
          this.followNote =
            "Everything needs Follow releases across all themes, in the integration's options. It reads every set of the year once a day, about 3 Brickset calls, where your own themes alone take fewer.";
          return;
        }
        this.pick({ scope: "all", themes: [] });
      }}
    >
      Everything
    </button>`;
    // My themes picks the followed themes, then folds their chips away or back.
    const picked = mine ? filter.themes.length : 0;
    const myThemes = html`<button
      class=${mine ? "chip on" : "chip"}
      aria-pressed=${mine}
      aria-expanded=${mine && this.themesOpen}
      @click=${() => {
        this.wiggling = false;
        const press = pressMyThemes(mine, this.themesOpen);
        this.themesOpen = press.open;
        if (press.pick) this.pick({ scope: "mine", themes: [] });
      }}
    >
      ${this.kind === "themes" ? "All my themes" : "My themes"}
      ${picked && !this.themesOpen ? html`<span>· ${picked}</span>` : nothing}
      <ha-icon
        class="drop"
        icon=${mine && this.themesOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
      ></ha-icon>
    </button>`;
    const layout = chipLayout({
      mine,
      open: this.themesOpen,
      wiggling: this.wiggling,
      followed: dash.followed.length,
    });
    const showThemes = layout.themes;
    return html`<div class="chips">
        ${this.kind === "releases" ? everything : nothing}
        ${dash.followed.length ? myThemes : nothing}
        ${
          showThemes && this.kind === "releases"
            ? html`<span class="divider" aria-hidden="true"></span>`
            : nothing
        }
        ${(showThemes ? dash.followed : []).map((theme) => {
          const on = filter.scope === "mine" && filter.themes.includes(theme);
          return html`<span
            class=${this.wiggling ? "chipwrap wiggle" : "chipwrap"}
          >
            <button
              class=${on ? "chip on" : "chip"}
              aria-pressed=${on}
              @pointerdown=${this.holdStart}
              @pointerup=${this.holdEnd}
              @pointerleave=${this.holdEnd}
              @pointercancel=${this.holdEnd}
              @contextmenu=${(ev: Event) => ev.preventDefault()}
              @click=${() => {
                const press = chipPress(this.held, this.wiggling);
                this.held = false;
                if (press !== "pick") return;
                this.pick({
                  scope: "mine",
                  themes: toggleTheme(
                    filter.scope === "mine" ? filter.themes : [],
                    theme,
                    dash.followed,
                  ),
                });
              }}
            >
              <span
                class="key"
                style="background:${slotColour(slots.get(theme))}"
              ></span>
              ${theme}
            </button>
            ${
              this.wiggling
                ? html`<button
                    class="remove"
                    aria-label=${`Stop following ${theme}`}
                    ?disabled=${this.following}
                    @click=${() => void this.follow(theme, false)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`
                : nothing
            }
          </span>`;
        })}
        ${
          layout.trailing === "done"
            ? html`<button
                class="chip on"
                @click=${() => (this.wiggling = false)}
              >
                Done
              </button>`
            : layout.trailing === "edit"
              ? this.followChip()
              : nothing
        }
      </div>
      ${this.adding ? this.editor() : nothing}
      ${
        this.followNote && !this.adding
          ? html`<p class="caveat" role="status">${this.followNote}</p>`
          : nothing
      }`;
  }

  private followControls(): TemplateResult | typeof nothing {
    if (!this.dash?.can_change) return nothing;
    return html`<div class="chips">${this.followChip()}</div>
      ${this.adding ? this.editor() : nothing}`;
  }

  /** Opens the editor that adds a theme and removes one; shown however the chips fold. */
  private followChip(): TemplateResult | typeof nothing {
    if (!this.dash?.can_change || this.adding) return nothing;
    const any = this.dash.followed.length > 0;
    return html`<button class="chip" @click=${() => void this.openEditor()}>
      <ha-icon icon=${any ? "mdi:pencil" : "mdi:plus"}></ha-icon>
      ${any ? "Edit themes" : "Follow a theme"}
    </button>`;
  }

  private async openEditor(): Promise<void> {
    this.adding = true;
    this.followNote = "";
    await this.loadThemes();
  }

  private async loadThemes(): Promise<void> {
    try {
      this.themeList = await this.hass.callWS<ThemeList>(
        accountCall("lego/themes", this.entryId || this.dash?.entry_id || ""),
      );
    } catch (err) {
      this.followNote = errorText(err);
    }
  }

  /** The editor that opens below the chips: a theme to add, and the ones to drop. */
  private editor(): TemplateResult {
    const list = this.themeList;
    const followed = list?.followed ?? this.dash?.followed ?? [];
    const taken = new Set(followed.map((theme) => theme.toLowerCase()));
    const cost = list
      ? list.follow_cost
        ? count(list.follow_cost, "call", "calls")
        : "free"
      : "…";
    const id = `lego-themes-${this.kind}`;
    return html`<div class="follow">
        <input
          list=${id}
          .value=${this.draft}
          placeholder="Theme name, such as Technic"
          aria-label="Theme to follow"
          @input=${(ev: Event) => {
            this.draft = (ev.target as HTMLInputElement).value;
          }}
          @keydown=${(ev: KeyboardEvent) => {
            if (ev.key === "Enter") void this.follow(this.draft, true);
          }}
        />
        <datalist id=${id}>
          ${(list?.themes ?? [])
            .filter((theme) => !taken.has(theme.toLowerCase()))
            .map((theme) => html`<option value=${theme}></option>`)}
        </datalist>
        <button
          class="update"
          ?disabled=${!this.draft.trim() || this.following}
          title=${`Follow this theme, using ${cost} of today's Brickset budget`}
          @click=${() => void this.follow(this.draft, true)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this.following ? "Following…" : "Follow"}
          <span class="sep" aria-hidden="true"></span>
          <span class="cost">${cost}</span>
        </button>
        <button class="link" @click=${() => (this.adding = false)}>Done</button>
      </div>
      ${
        followed.length
          ? html`<div class="chips" role="group" aria-label="Themes you follow">
              ${followed.map(
                (theme) =>
                  html`<button
                    class="chip"
                    aria-label=${`Stop following ${theme}`}
                    ?disabled=${this.following}
                    @click=${() => void this.follow(theme, false)}
                  >
                    ${theme}
                    <ha-icon class="drop" icon="mdi:close"></ha-icon>
                  </button>`,
              )}
            </div>`
          : nothing
      }
      ${this.followNote ? html`<p class="caveat" role="status">${this.followNote}</p>` : nothing}`;
  }

  private async follow(theme: string, follow: boolean): Promise<void> {
    const name = theme.trim();
    if (!name || this.following) return;
    this.following = true;
    this.followNote = "";
    try {
      const result = await this.hass.callWS<FollowResult>({
        ...accountCall(
          "lego/themes/follow",
          this.entryId || this.dash?.entry_id || "",
        ),
        theme: name,
        follow,
      });
      if (follow) this.draft = "";
      if (!result.complete) {
        this.followNote = `Following ${name}. Its sets arrive with the next check, as today's budget is spent.`;
      }
      await this.loadThemes();
    } catch (err) {
      this.followNote = errorText(err);
      return;
    } finally {
      this.following = false;
    }
    this.dispatchEvent(
      new CustomEvent(CHANGED, { bubbles: true, composed: true }),
    );
  }

  /**
   * One stack of dots: hovered or focused, the dots spread apart and a card
   * names the sets they stand for.
   */
  private stack(
    stack: Stack,
    pos: (months: number) => number,
    from: number,
    to: number,
  ): TemplateResult {
    const pct = (months: number) => `${pos(months) * 100}%`;
    const live = stack.at >= from - 0.01 && stack.at <= to + 0.01;
    const rest = stackOffsets(stack.themes.length);
    const fan = stackOffsets(stack.themes.length, 14);
    const language = this.hass?.locale?.language;
    const day = (iso: string) =>
      new Date(iso).toLocaleDateString(language, {
        day: "numeric",
        month: "short",
      });
    const shown = stack.points.slice(0, TIP_SETS);
    // Near either end the card hangs inward, so it is never cut off.
    const edge =
      pos(stack.at) < 0.25
        ? "tip start"
        : pos(stack.at) > 0.75
          ? "tip end"
          : "tip";
    return html`<button
      class=${live ? "stack" : "stack out"}
      style="left:${pct(stack.at)}"
      aria-label=${stack.points
        .map((point) => `${displayName(point)}, ${day(point.date)}`)
        .join("; ")}
      aria-pressed=${this.compact ? this.openStack?.at === stack.at : nothing}
      @click=${() => {
        // A phone has no hover, so a tap lists the stack's sets below instead.
        if (this.compact) {
          this.openStack = this.openStack?.at === stack.at ? undefined : stack;
        }
      }}
    >
      ${stack.themes.map(
        (theme, i) =>
          html`<span
            class="disc"
            style="--rest:${rest[i]}px;--fan:${fan[i]}px;background:${this.themeColour(
              theme,
            )};z-index:${10 - i}"
          ></span>`,
      )}
      ${stack.extra ? html`<span class="extra">+${stack.extra}</span>` : nothing}
      <span class=${edge} aria-hidden="true">
        ${shown.map(
          (point) =>
            html`<span class="tipline">
              <span
                class="key"
                style="background:${this.themeColour(point.theme)}"
              ></span>
              <span class="tipname">${displayName(point)}</span>
              <span class="tipdate">${day(point.date)}</span>
            </span>`,
        )}
        ${
          stack.points.length > shown.length
            ? html`<span class="tipmore"
                >+${stack.points.length - shown.length} more</span
              >`
            : nothing
        }
      </span>
    </button>`;
  }

  private timeline(data: Releases): TemplateResult {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const from = Math.max(monthsFrom(start, data.span.from), 0);
    const to = data.span.to
      ? Math.min(monthsFrom(start, data.span.to), TIMELINE_MONTHS)
      : TIMELINE_MONTHS;
    const view = timelineView(from, to, this.compact);
    const pos = (months: number) =>
      (months - view.from) / (view.to - view.from);
    const pct = (months: number) => `${pos(months) * 100}%`;
    const shown = (months: number) =>
      months >= view.from - 0.05 && months <= view.to + 0.05;
    const stacks = stackTimeline(data.timeline, start).filter((stack) =>
      shown(stack.at),
    );
    const language = this.hass?.locale?.language;
    const inSpan = data.timeline.filter((p) => {
      const at = monthsFrom(start, p.date);
      return at >= from && at <= to;
    }).length;
    const today = monthsFrom(start, now);
    return html`<div
        class=${this.compact ? "timescroll compact" : "timescroll"}
      >
        <div
          class="timeline"
          role="group"
          style="width:${view.width * 100}%"
          aria-label=${`${count(data.timeline.length, "set", "sets")} from January to next March, ${inSpan} in the chosen span`}
        >
          <div class="line"></div>
          <div
            class="window"
            style="left:${pct(from)};width:${pct(view.from + Math.max(to - from, 0))}"
          ></div>
          ${stacks.map((stack) => this.stack(stack, pos, from, to))}
          ${
            shown(today)
              ? html`<ha-icon
                  class="today"
                  icon="mdi:chevron-down"
                  style="left:${pct(today)}"
                ></ha-icon>`
              : nothing
          }
          ${Array.from({ length: TIMELINE_MONTHS }, (_, i) => i)
            .filter((i) => i + 1 > view.from && i < view.to)
            .map((i) => {
              const label = new Date(
                start.getFullYear(),
                i,
                1,
              ).toLocaleDateString(language, { month: "short" });
              return html`<span
                class=${i % 3 === 0 ? "month quarter" : "month"}
                style="left:${pct(i)};width:${pct(view.from + 1)}"
                aria-hidden="true"
                >${label}</span
              >`;
            })}
        </div>
      </div>
      ${this.compact && this.openStack ? this.picked(this.openStack) : nothing}`;
  }

  /** On a phone, the sets of the stack last tapped, listed under the timeline. */
  private picked(stack: Stack): TemplateResult {
    const language = this.hass?.locale?.language;
    return html`<div class="picked" role="status">
      ${stack.points.map(
        (point) =>
          html`<span class="tipline">
            <span
              class="key"
              style="background:${this.themeColour(point.theme)}"
            ></span>
            <span class="tipname">${displayName(point)}</span>
            <span class="tipdate"
              >${new Date(point.date).toLocaleDateString(language, {
                day: "numeric",
                month: "short",
              })}</span
            >
          </span>`,
      )}
    </div>`;
  }

  private cards(): TemplateResult {
    const sets = this.data?.sets;
    if (!sets) return html`<p class="muted">Loading…</p>`;
    if (!sets.length) {
      const ahead = this.filter && this.filter.span === "coming";
      return this.filler(
        ahead
          ? "Nothing due in this span yet."
          : "Nothing new in this span. Try a longer one.",
      );
    }
    return html`<div class="carousel">
      ${sets.map((item) =>
        this.card(item, "release", this.themeColour(item.theme)),
      )}
      ${this.tail()}
    </div>`;
  }
}

define("lego-releases-row", LegoReleasesRow);
