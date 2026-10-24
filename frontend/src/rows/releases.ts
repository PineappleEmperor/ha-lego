import {
  css,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import { loadReleases } from "../api";
import { LegoRow, define } from "../base";
import {
  ROW_SPANS,
  SPAN_LABELS,
  TIMELINE_MONTHS,
  count,
  errorText,
  monthsFrom,
  releaseFilter,
  stackOffsets,
  stackTimeline,
  toggleTheme,
  type ResolvedFilter,
} from "../format";
import { slotColour, themeSlots } from "../palette";
import type { ReleaseRow, Releases, Scope, Span } from "../types";

/** Rows with a theme filter and the timeline; the fixed rows have neither. */
const FILTERED: ReleaseRow[] = ["releases", "themes"];

/**
 * A row of new sets. "releases" is the combined row, filtered by scope, themes and
 * span; "recent", "upcoming" and "themes" are the same sets split into fixed rows.
 * The filters open on the user's saved defaults and change only for this visit.
 */
export class LegoReleasesRow extends LegoRow {
  @property() public kind: ReleaseRow = "releases";

  @state() private filter?: ResolvedFilter;
  @state() private data?: Releases;
  @state() private error = "";

  private filterFor = "";
  private requested = "";
  private requestedWith?: object;

  protected get row(): string {
    return this.kind;
  }

  static override styles = [
    LegoRow.styles,
    css`
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
      .timeline .disc {
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--lego-surface);
        height: 10px;
        position: absolute;
        transform: translate(-50%, -50%);
        width: 10px;
      }
      .timeline .disc.out {
        opacity: 0.35;
      }
      .timeline .extra {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        font-size: 10px;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: 14px;
        padding: 0 4px;
        position: absolute;
        top: 14px;
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
      /* Too narrow for every month: the quarters alone. */
      @container (max-width: 720px) {
        .timeline .month:not(.quarter) {
          visibility: hidden;
        }
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

  private pick(change: Partial<ResolvedFilter>): void {
    if (this.filter) this.filter = { ...this.filter, ...change };
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
    if (!this.filter || this.status() === null) return nothing;
    return html`<div class="pills" role="group" aria-label="Time span">
      ${ROW_SPANS[this.kind].map(
        (span: Span) =>
          html`<button
            class=${span === this.filter?.span ? "pill on" : "pill"}
            aria-pressed=${span === this.filter?.span}
            @click=${() => this.pick({ span })}
          >
            ${SPAN_LABELS[span]}
          </button>`,
      )}
    </div>`;
  }

  protected body(): TemplateResult {
    const filter = this.filter;
    const dash = this.dash;
    if (!filter || !dash) return html`<p class="muted">Loading…</p>`;
    const status = this.status();
    if (status === null)
      return html`<p class="muted">${this.unavailable()}</p>`;
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
      return "No themes followed yet. Add one in the integration's options to see new sets here.";
    }
    return "Follow themes, or turn on Follow releases across all themes, in the integration's options to see new sets here.";
  }

  private chips(filter: ResolvedFilter): TemplateResult {
    const dash = this.dash!;
    const slots = themeSlots(dash.followed);
    const scopeChip = (scope: Scope, label: string) => {
      const on =
        filter.scope === scope && (scope === "all" || !filter.themes.length);
      return html`<button
        class=${on ? "chip on" : "chip"}
        aria-pressed=${on}
        @click=${() => this.pick({ scope, themes: [] })}
      >
        ${label}
      </button>`;
    };
    return html`<div class="chips">
      ${
        this.kind === "releases" && dash.release_status.all !== null
          ? scopeChip("all", "Everything")
          : nothing
      }
      ${
        dash.followed.length
          ? scopeChip(
              "mine",
              this.kind === "themes" ? "All my themes" : "My themes",
            )
          : nothing
      }
      ${
        dash.followed.length && this.kind === "releases"
          ? html`<span class="divider" aria-hidden="true"></span>`
          : nothing
      }
      ${dash.followed.map((theme) => {
        const on = filter.scope === "mine" && filter.themes.includes(theme);
        return html`<button
          class=${on ? "chip on" : "chip"}
          aria-pressed=${on}
          @click=${() =>
            this.pick({
              scope: "mine",
              themes: toggleTheme(
                filter.scope === "mine" ? filter.themes : [],
                theme,
                dash.followed,
              ),
            })}
        >
          <span
            class="key"
            style="background:${slotColour(slots.get(theme))}"
          ></span>
          ${theme}
        </button>`;
      })}
    </div>`;
  }

  /** The colour a set's theme wears: its slot if followed, else "Other"'s grey. */
  private colourOf(theme: string): string {
    const dash = this.dash!;
    const slots = themeSlots(dash.followed);
    const followed = dash.followed.find(
      (t) => t.toLowerCase() === theme.toLowerCase(),
    );
    return slotColour(followed ? slots.get(followed) : "other");
  }

  private timeline(data: Releases): TemplateResult {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const pct = (months: number) => `${(months / TIMELINE_MONTHS) * 100}%`;
    const from = Math.max(monthsFrom(start, data.span.from), 0);
    const to = data.span.to
      ? Math.min(monthsFrom(start, data.span.to), TIMELINE_MONTHS)
      : TIMELINE_MONTHS;
    const stacks = stackTimeline(data.timeline, start);
    const language = this.hass?.locale?.language;
    const inSpan = data.timeline.filter((p) => {
      const at = monthsFrom(start, p.date);
      return at >= from && at <= to;
    }).length;
    return html`<div
      class="timeline"
      role="img"
      aria-label=${`${count(data.timeline.length, "set", "sets")} from January to next March, ${inSpan} in the chosen span`}
    >
      <div class="line"></div>
      <div
        class="window"
        style="left:${pct(from)};width:${pct(Math.max(to - from, 0))}"
      ></div>
      ${stacks.map((stack) => {
        const live = stack.at >= from - 0.01 && stack.at <= to + 0.01;
        const offsets = stackOffsets(stack.themes.length);
        return html`${stack.themes.map(
          (theme, i) =>
            html`<span
              class=${live ? "disc" : "disc out"}
              style="left:${pct(stack.at)};top:${
                21 + offsets[i]
              }px;background:${this.colourOf(theme)};z-index:${10 - i}"
            ></span>`,
        )}${
          stack.extra
            ? html`<span class="extra" style="left:calc(${pct(stack.at)} + 9px)"
                >+${stack.extra}</span
              >`
            : nothing
        }`;
      })}
      <ha-icon
        class="today"
        icon="mdi:chevron-down"
        style="left:${pct(monthsFrom(start, now))}"
      ></ha-icon>
      ${Array.from({ length: TIMELINE_MONTHS }, (_, i) => {
        const label = new Date(start.getFullYear(), i, 1).toLocaleDateString(
          language,
          { month: "short" },
        );
        return html`<span
          class=${i % 3 === 0 ? "month quarter" : "month"}
          style="left:${pct(i)};width:${pct(1)}"
          aria-hidden="true"
          >${label}</span
        >`;
      })}
    </div>`;
  }

  private cards(): TemplateResult {
    const sets = this.data?.sets;
    if (!sets) return html`<p class="muted">Loading…</p>`;
    if (!sets.length) {
      const ahead =
        this.filter && ["next1", "next3", "coming"].includes(this.filter.span);
      return this.filler(
        ahead
          ? "Nothing due in this span yet."
          : "Nothing new in this span. Try a longer one.",
      );
    }
    return html`<div class="carousel">
      ${sets.map((item) =>
        this.card(item, "release", this.colourOf(item.theme)),
      )}
    </div>`;
  }
}

define("lego-releases-row", LegoReleasesRow);
