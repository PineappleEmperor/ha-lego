import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import { invalidate } from "./api";
import { ROW_META, define, type LegoRow } from "./base";
import "./cards";
import {
  ROW_SPANS,
  SPAN_LABELS,
  accountCall,
  budgetTitle,
  errorText,
  moveRow,
  releaseFilter,
  rowsForMode,
  toggleTheme,
} from "./format";
import { LOGO } from "./generated/brand";
import { SERIES_COLOURS } from "./palette";
import "./rows/collection";
import "./rows/releases";
import "./rows/value";
import "./rows/wishlist";
import { CONTROLS, ROW, TOKENS } from "./styles";
import { drawSvg } from "./svg";
import type {
  Account,
  AccountList,
  Dashboard,
  Hass,
  PanelSettings,
  ReleaseFilter,
  ReleaseRow,
  Span,
} from "./types";

const RELEASE_ROWS: string[] = ["releases", "recent", "upcoming", "themes"];

export class LegoPanel extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Boolean, reflect: true }) public dark = false;

  @state() private dash?: Dashboard;
  @state() private error = "";
  @state() private accounts: Account[] = [];
  @state() private account = "";
  /** The account this user's panel opens on, which only the brick changes. */
  @state() private defaultAccount = "";
  @state() private switching = "";
  @state() private picking = false;
  @state() private customising = false;
  @state() private folded: Record<string, boolean> = {};
  @state() private dragging = "";
  @state() private over = "";

  private foldedFor = "";

  public override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("click", this.onOutside);
    void this.load();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("click", this.onOutside);
  }

  protected override willUpdate(): void {
    this.dark = !!this.hass?.themes?.darkMode;
  }

  private async load(): Promise<void> {
    try {
      if (!this.accounts.length) {
        const list = await this.hass.callWS<AccountList>({
          type: "lego/accounts",
        });
        this.accounts = list.accounts;
        this.account = list.selected ?? "";
        this.defaultAccount = this.account;
      }
      const dash = await this.hass.callWS<Dashboard>(
        accountCall("lego/dashboard", this.account),
      );
      // Each account opens with the user's chosen rows folded; within a visit the
      // headers fold and unfold freely.
      if (dash.entry_id !== this.foldedFor) {
        this.foldedFor = dash.entry_id;
        this.folded = Object.fromEntries(
          dash.collapsed.map((row) => [row, true]),
        );
      }
      this.dash = dash;
      this.error = "";
    } catch (err) {
      this.error = errorText(err);
    }
  }

  private async selectAccount(entryId: string): Promise<void> {
    if (entryId === this.account) return;
    this.account = entryId;
    this.switching =
      this.accounts.find((item) => item.entry_id === entryId)?.name ??
      "account";
    try {
      await this.load();
    } finally {
      this.switching = "";
    }
  }

  /** Open an account by default from now on; switching alone does not. */
  private async makeDefault(entryId: string): Promise<void> {
    try {
      await this.hass.callWS({
        type: "lego/account/set",
        config_entry_id: entryId,
      });
      this.defaultAccount = entryId;
    } catch (err) {
      this.error = errorText(err);
    }
  }

  /** Apply settings at once, then store them; the reply is what was kept. */
  private async save(patch: Partial<PanelSettings>): Promise<void> {
    if (!this.dash) return;
    this.dash = { ...this.dash, ...patch };
    try {
      const saved = await this.hass.callWS<PanelSettings>({
        type: "lego/panel_config/set",
        ...patch,
      });
      if (this.dash) this.dash = { ...this.dash, ...saved };
    } catch {
      // Applied locally already; it just will not survive a reload.
    }
  }

  private visible(): string[] {
    const dash = this.dash;
    if (!dash) return [];
    return rowsForMode(dash.rows, dash.release_mode).filter(
      (row) => !dash.hidden.includes(row),
    );
  }

  private onToggle = (ev: Event): void => {
    const { row, collapsed } = (
      ev as CustomEvent<{ row: string; collapsed: boolean }>
    ).detail;
    this.folded = { ...this.folded, [row]: collapsed };
  };

  private onMove = (ev: Event): void => {
    const { row, step } = (ev as CustomEvent<{ row: string; step: number }>)
      .detail;
    this.move(row, step, this.visible());
  };

  private move(row: string, step: number, shown: string[]): void {
    if (!this.dash) return;
    const rows = moveRow(this.dash.rows, shown, row, step);
    if (rows === this.dash.rows) return;
    void this.save({ rows });
    void this.updateComplete.then(() =>
      this.renderRoot
        .querySelector<LegoRow>(`[data-row="${row}"] > *`)
        ?.focusHandle?.(),
    );
  }

  private onChanged = (): void => {
    invalidate();
    void this.load();
  };

  private onDrop(target: string, shown: string[]): void {
    const from = this.dragging;
    this.dragging = "";
    this.over = "";
    if (!this.dash || !from || from === target) return;
    const rows = this.dash.rows.filter((r) => r !== from);
    const at = rows.indexOf(target);
    const down = shown.indexOf(from) < shown.indexOf(target);
    rows.splice(at + (down ? 1 : 0), 0, from);
    void this.save({ rows });
  }

  protected override render(): TemplateResult {
    return html`
      <div class="app">
        ${this.renderHeader()}
        ${
          this.switching
            ? html`<p class="muted switching" role="status">
                Loading ${this.switching}…
              </p>`
            : nothing
        }
        <div
          class=${this.switching ? "busy" : ""}
          aria-busy=${!!this.switching}
        >
          ${
            this.error
              ? html`<div class="error" role="alert">
                  <p>${this.error}</p>
                  <button class="link" @click=${() => void this.load()}>
                    Try again
                  </button>
                </div>`
              : this.renderHome()
          }
        </div>
      </div>
    `;
  }

  private renderHeader(): TemplateResult {
    const quota = this.dash?.quota;
    const share = quota
      ? Math.min(quota.calls_today / (quota.budget || 1), 1)
      : 0;
    const tight = !!quota && quota.remaining < quota.refresh_cost * 3;
    return html`<header class=${this.narrow ? "narrow" : ""}>
      <div class="title">
        ${
          this.narrow
            ? html`<ha-menu-button
                .hass=${this.hass}
                .narrow=${this.narrow}
              ></ha-menu-button>`
            : nothing
        }
        <span class="logo">${drawSvg(LOGO)}</span>
        <h1>LEGO</h1>
      </div>
      ${
        quota
          ? html`<div
              class=${tight ? "meter tight" : "meter"}
              title=${budgetTitle(
                quota.calls_today,
                quota.budget,
                new Date(quota.resets_at).toLocaleTimeString(
                  this.hass?.locale?.language,
                  { hour: "2-digit", minute: "2-digit" },
                ),
              )}
            >
              <span class="meter-label">Brickset calls</span>
              <span
                class="meter-bar"
                role="meter"
                aria-label="Brickset calls used today"
                aria-valuemin="0"
                aria-valuemax=${quota.budget}
                aria-valuenow=${quota.calls_today}
                ><span style="width:${share * 100}%"></span
              ></span>
              <span>${quota.calls_today} of ${quota.budget} today</span>
            </div>`
          : nothing
      }
      ${this.accounts.length > 1 ? this.accountPicker() : nothing}
    </header>`;
  }

  /**
   * The account picker: a menu, not a select, so each account carries the brick
   * that makes it the one this user's panel opens on.
   */
  private accountPicker(): TemplateResult {
    const current = this.accounts.find(
      (item) => item.entry_id === this.account,
    );
    return html`<div class="accountpick" @keydown=${this.onPickerKey}>
      <div class="accountbar">
        <button
          class="account"
          aria-haspopup="true"
          aria-expanded=${this.picking}
          aria-label=${`Brickset account: ${current?.name ?? ""}`}
          @click=${() => (this.picking = !this.picking)}
        >
          <span class="names" aria-hidden="true">
            ${this.accounts.map(
              (item) =>
                html`<span
                  class=${item.entry_id === current?.entry_id ? "name" : "name ghost"}
                  >${item.name}</span
                >`,
            )}
          </span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${current ? this.brickButton(current) : nothing}
      </div>
      ${
        this.picking
          ? html`<ul class="menu">
              ${this.accounts.map(
                (item) =>
                  html`<li>
                    <button
                      class="pick"
                      aria-current=${item.entry_id === this.account}
                      @click=${() => {
                        this.picking = false;
                        void this.selectAccount(item.entry_id);
                      }}
                    >
                      ${item.name}
                    </button>
                    ${this.brickButton(item)}
                  </li>`,
              )}
            </ul>`
          : nothing
      }
    </div>`;
  }

  /** Filled on the default account; an outline anywhere else, pressed to make it so. */
  private brickButton(item: Account): TemplateResult {
    const isDefault = item.entry_id === this.defaultAccount;
    const label = isDefault
      ? `${item.name} opens by default`
      : `Open ${item.name} by default`;
    return html`<button
      class="brick"
      title=${label}
      aria-label=${label}
      aria-pressed=${isDefault}
      @click=${() => void (isDefault ? undefined : this.makeDefault(item.entry_id))}
    >
      <ha-icon
        icon=${isDefault ? "mdi:toy-brick" : "mdi:toy-brick-outline"}
      ></ha-icon>
    </button>`;
  }

  private onPickerKey = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape" && this.picking) {
      this.picking = false;
      this.renderRoot.querySelector<HTMLButtonElement>(".account")?.focus();
    }
  };

  /** A click anywhere outside the open menu closes it. */
  private onOutside = (ev: MouseEvent): void => {
    const picker = this.renderRoot.querySelector(".accountpick");
    if (this.picking && picker && !ev.composedPath().includes(picker)) {
      this.picking = false;
    }
  };

  private renderHome(): TemplateResult {
    const dash = this.dash;
    if (!dash) return html`<p class="muted pad">Loading your collection…</p>`;
    const visible = this.visible();
    const anyOpen = visible.some((row) => !this.folded[row]);
    return html`<div
      class="rows"
      @lego-toggle=${this.onToggle}
      @lego-move=${this.onMove}
      @lego-changed=${this.onChanged}
    >
      <div class="homebar">
        <button
          class="link"
          @click=${() =>
            (this.folded = Object.fromEntries(
              visible.map((row) => [row, anyOpen]),
            ))}
        >
          ${anyOpen ? "Collapse all" : "Expand all"}
        </button>
        <button
          class="link"
          aria-expanded=${this.customising}
          @click=${() => (this.customising = !this.customising)}
        >
          ${this.customising ? "Done" : "Customise"}
        </button>
      </div>
      ${this.customising ? this.renderCustomise(dash) : nothing}
      ${
        visible.length
          ? visible.map((row) => this.renderRow(row, visible))
          : html`<p class="muted">
              Every row is hidden. Choose Customise to bring some back.
            </p>`
      }
    </div>`;
  }

  private renderRow(row: string, shown: string[]): TemplateResult {
    const props = {
      hass: this.hass,
      dash: this.dash,
      entryId: this.dash?.entry_id ?? "",
      collapsed: !!this.folded[row],
    };
    let element: TemplateResult;
    if (RELEASE_ROWS.includes(row)) {
      element = html`<lego-releases-row
        .kind=${row as ReleaseRow}
        .hass=${props.hass}
        .dash=${props.dash}
        .entryId=${props.entryId}
        .collapsed=${props.collapsed}
        handle
      ></lego-releases-row>`;
    } else if (row === "value" || row === "pieces") {
      element = html`<lego-value-row
        .kind=${row}
        .hass=${props.hass}
        .dash=${props.dash}
        .entryId=${props.entryId}
        .collapsed=${props.collapsed}
        handle
      ></lego-value-row>`;
    } else if (row === "wishlist") {
      element = html`<lego-wishlist-row
        .hass=${props.hass}
        .dash=${props.dash}
        .entryId=${props.entryId}
        .collapsed=${props.collapsed}
        handle
      ></lego-wishlist-row>`;
    } else {
      element = html`<lego-collection-row
        .hass=${props.hass}
        .dash=${props.dash}
        .entryId=${props.entryId}
        .collapsed=${props.collapsed}
        handle
      ></lego-collection-row>`;
    }
    return html`<div
      class=${[
        "slot",
        this.dragging === row ? "dragging" : "",
        this.dragging && this.over === row ? "over" : "",
      ].join(" ")}
      data-row=${row}
      @dragstart=${() => (this.dragging = row)}
      @dragend=${() => {
        this.dragging = "";
        this.over = "";
      }}
      @dragover=${(ev: DragEvent) => ev.preventDefault()}
      @dragenter=${() => (this.over = row)}
      @drop=${() => this.onDrop(row, shown)}
    >
      ${element}
    </div>`;
  }

  private renderCustomise(dash: Dashboard): TemplateResult {
    const rows = rowsForMode(dash.rows, dash.release_mode);
    const allOn = dash.release_status.all !== null;
    return html`<section class="row customise" aria-label="Customise this page">
      <h2>Customise this page</h2>
      <p class="muted">
        Saved to your Home Assistant user, so it follows you to every device.
      </p>
      <div class="setting">
        <span>Release rows</span>
        <div class="pills" role="group" aria-label="Release rows">
          ${(["combined", "separate"] as const).map(
            (mode) =>
              html`<button
                class=${dash.release_mode === mode ? "pill on" : "pill"}
                aria-pressed=${dash.release_mode === mode}
                @click=${() => void this.save({ release_mode: mode })}
              >
                ${mode === "combined" ? "Combined" : "Separate"}
              </button>`,
          )}
        </div>
      </div>
      <div class="crow heading" aria-hidden="true">
        <span></span><span>Show</span><span>Row</span><span>Starts</span>
      </div>
      <ul>
        ${rows.map((row) => this.renderCustomiseRow(dash, row, rows))}
      </ul>
      ${
        allOn
          ? nothing
          : html`<p class="muted">
              For Everything, Out recently and Coming soon, turn on Follow
              releases across all themes in the integration's options.
            </p>`
      }
    </section>`;
  }

  private renderCustomiseRow(
    dash: Dashboard,
    row: string,
    rows: string[],
  ): TemplateResult {
    const title = ROW_META[row].title;
    const shown = !dash.hidden.includes(row);
    const starts = dash.collapsed.includes(row) ? "collapsed" : "open";
    const setStart = (collapsed: boolean) => {
      const next = dash.collapsed.filter((r) => r !== row);
      if (collapsed) next.push(row);
      this.folded = { ...this.folded, [row]: collapsed };
      void this.save({ collapsed: next });
    };
    return html`<li>
      <div class="crow">
        <button
          class="drag"
          data-custom=${row}
          aria-label=${`Move ${title} up or down`}
          title="Use the arrow keys to reorder"
          @keydown=${(ev: KeyboardEvent) => {
            const step =
              ev.key === "ArrowUp" ? -1 : ev.key === "ArrowDown" ? 1 : 0;
            if (!step) return;
            ev.preventDefault();
            this.move(row, step, rows);
            void this.updateComplete.then(() =>
              this.renderRoot
                .querySelector<HTMLButtonElement>(`[data-custom="${row}"]`)
                ?.focus(),
            );
          }}
        >
          <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
        </button>
        <input
          type="checkbox"
          .checked=${shown}
          aria-label=${`Show ${title}`}
          @change=${(ev: Event) => {
            const show = (ev.target as HTMLInputElement).checked;
            const hidden = dash.hidden.filter((r) => r !== row);
            if (!show) hidden.push(row);
            void this.save({ hidden });
          }}
        />
        <span class="rowname"
          ><ha-icon icon=${ROW_META[row].icon}></ha-icon>${title}</span
        >
        <div class="pills" role="group" aria-label=${`${title} starts`}>
          <button
            class=${starts === "open" ? "pill on" : "pill"}
            aria-pressed=${starts === "open"}
            @click=${() => setStart(false)}
          >
            Open
          </button>
          <button
            class=${starts === "collapsed" ? "pill on" : "pill"}
            aria-pressed=${starts === "collapsed"}
            @click=${() => setStart(true)}
          >
            Collapsed
          </button>
        </div>
      </div>
      ${
        RELEASE_ROWS.includes(row)
          ? this.renderStartsOn(dash, row as ReleaseRow)
          : nothing
      }
    </li>`;
  }

  /** The filter a release row opens on: themes, if it has them, and a span. */
  private renderStartsOn(dash: Dashboard, row: ReleaseRow): TemplateResult {
    const filter = releaseFilter(row, dash);
    const saveFilter = (change: ReleaseFilter) => {
      const current = dash.release_filters[row] ?? {};
      void this.save({
        release_filters: {
          ...dash.release_filters,
          [row]: { ...current, ...change },
        },
      });
    };
    const chip = (label: string, on: boolean, pick: () => void) =>
      html`<button
        class=${on ? "chip small on" : "chip small"}
        aria-pressed=${on}
        @click=${pick}
      >
        ${label}
      </button>`;
    const themed = row === "releases" || row === "themes";
    return html`<div class="startson">
      <span class="muted-label">Starts on</span>
      ${
        themed && row === "releases" && dash.release_status.all !== null
          ? chip("Everything", filter.scope === "all", () =>
              saveFilter({ scope: "all", themes: [] }),
            )
          : nothing
      }
      ${
        themed && dash.followed.length
          ? chip(
              row === "themes" ? "All my themes" : "My themes",
              filter.scope === "mine" && !filter.themes.length,
              () => saveFilter({ scope: "mine", themes: [] }),
            )
          : nothing
      }
      ${
        themed
          ? dash.followed.map((theme) =>
              chip(
                theme,
                filter.scope === "mine" && filter.themes.includes(theme),
                () =>
                  saveFilter({
                    scope: "mine",
                    themes: toggleTheme(
                      filter.scope === "mine" ? filter.themes : [],
                      theme,
                      dash.followed,
                    ),
                  }),
              ),
            )
          : nothing
      }
      <label class="spanpick"
        >Span
        <select
          @change=${(ev: Event) =>
            saveFilter({
              span: (ev.target as HTMLSelectElement).value as Span,
            })}
        >
          ${ROW_SPANS[row].map(
            (span) =>
              html`<option value=${span} ?selected=${span === filter.span}>
                ${SPAN_LABELS[span]}
              </option>`,
          )}
        </select></label
      >
    </div>`;
  }

  static override styles = [
    TOKENS,
    SERIES_COLOURS,
    ROW,
    CONTROLS,
    css`
      :host {
        background: var(--lego-ground);
        display: block;
        min-height: 100vh;
      }
      .app {
        margin: 0 auto;
        max-width: 1400px;
        padding: 0 0 var(--ha-space-8, 32px);
      }
      /* One toolbar row at Home Assistant's own header height; on a phone the
         meter takes a row of its own below it. */
      header {
        align-items: center;
        background: var(--lego-surface);
        border-bottom: var(--lego-line) solid var(--lego-outline);
        column-gap: var(--ha-space-4, 16px);
        display: flex;
        flex-wrap: wrap;
        min-height: var(--header-height, 56px);
        padding: 0 var(--ha-space-4, 16px);
        position: sticky;
        top: 0;
        z-index: 2;
      }
      .title {
        align-items: center;
        display: flex;
        gap: var(--ha-space-2, 8px);
        min-width: 0;
      }
      /* The integration's own brick, in the theme's primary colour. */
      .logo {
        display: block;
        flex: none;
        height: 48px;
        width: 48px;
      }
      .logo svg {
        display: block;
        height: 100%;
        width: 100%;
      }
      /* The page title reads like Home Assistant's own toolbar titles: regular
         weight, so the bold section headings below it are the ones that stand out. */
      h1 {
        font-size: var(--ha-font-size-xl, 20px);
        font-weight: var(--ha-font-weight-normal, 400);
        line-height: var(--ha-line-height-condensed, 1.2);
        margin: 0;
      }
      .meter {
        align-items: center;
        color: var(--lego-text-2);
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        margin-left: auto;
        min-height: 48px;
      }
      .meter-label {
        color: var(--lego-text);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .meter-bar {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-pill, 9999px);
        display: block;
        height: 8px;
        overflow: hidden;
        width: 120px;
      }
      .meter-bar span {
        background: var(--lego-primary);
        display: block;
        height: 100%;
      }
      .meter.tight .meter-bar span {
        background: var(--lego-want);
      }
      header.narrow .meter-label {
        display: none;
      }
      header.narrow .meter-bar {
        width: 64px;
      }
      .accountpick {
        max-width: 50%;
        position: relative;
      }
      /* The menu button and the brick read as one control, split by a hairline. */
      .accountbar {
        align-items: stretch;
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        display: flex;
        max-width: 100%;
      }
      .accountbar .brick {
        border-inline-start: var(--lego-line) solid var(--lego-outline);
        border-radius: 0;
        height: auto;
      }
      .account {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: var(--ha-border-radius-md, 8px);
        color: inherit;
        min-width: 0;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        gap: var(--ha-space-2, 8px);
        max-width: 100%;
        min-height: 48px;
        padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-3, 12px);
        --mdc-icon-size: 20px;
      }
      /* Every name shares one cell, so the picker is as wide as the longest and
         keeps its width whichever account shows. */
      .account .names {
        display: inline-grid;
        justify-items: start;
        min-width: 0;
      }
      .account .name {
        grid-area: 1 / 1;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .account .name.ghost {
        visibility: hidden;
      }
      .menu {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        list-style: none;
        margin: var(--ha-space-1, 4px) 0 0;
        min-width: 240px;
        padding: var(--ha-space-1, 4px) 0;
        position: absolute;
        right: 0;
        top: 100%;
        z-index: 4;
      }
      .menu li {
        align-items: center;
        display: flex;
      }
      .pick {
        appearance: none;
        background: none;
        border: 0;
        color: var(--lego-text);
        cursor: pointer;
        flex: 1;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 48px;
        padding: 0 var(--ha-space-4, 16px);
        text-align: start;
      }
      .pick[aria-current="true"] {
        color: var(--lego-primary);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .brick {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: 50%;
        color: var(--lego-text-2);
        cursor: pointer;
        display: inline-flex;
        height: 48px;
        justify-content: center;
        width: 48px;
      }
      .brick[aria-pressed="true"] {
        color: var(--lego-primary);
        cursor: default;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-4, 16px);
        padding: var(--ha-space-2, 8px) var(--ha-space-4, 16px) 0;
      }
      .homebar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: calc(-1 * var(--ha-space-2, 8px));
      }
      .slot.dragging {
        opacity: 0.5;
      }
      /* Where a dragged row will land. */
      .slot.over {
        box-shadow: 0 -10px 0 -8px var(--lego-primary);
      }
      .customise {
        padding: var(--ha-space-4, 16px);
      }
      .customise > .muted:first-of-type {
        margin: var(--ha-space-1, 4px) 0 var(--ha-space-3, 12px);
      }
      .setting {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        font-size: var(--ha-font-size-m, 14px);
        font-weight: var(--ha-font-weight-medium, 500);
        gap: var(--ha-space-3, 12px);
        margin-bottom: var(--ha-space-2, 8px);
      }
      .customise ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .customise li {
        border-top: var(--lego-line) solid var(--lego-outline);
      }
      .crow {
        align-items: center;
        display: grid;
        gap: var(--ha-space-3, 12px);
        grid-template-columns: 48px 28px minmax(0, 1fr) auto;
        min-height: 48px;
      }
      .crow.heading {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        font-weight: var(--ha-font-weight-medium, 500);
        min-height: 32px;
      }
      .crow input {
        accent-color: var(--lego-primary);
        height: 20px;
        margin: 0;
        width: 20px;
      }
      .rowname {
        align-items: center;
        display: flex;
        font-size: var(--ha-font-size-m, 14px);
        gap: var(--ha-space-2, 8px);
        --mdc-icon-size: 20px;
      }
      .rowname ha-icon {
        color: var(--lego-primary);
      }
      .startson {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px);
        padding: 0 0 var(--ha-space-3, 12px) 88px;
      }
      .muted-label {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        min-width: 64px;
      }
      .chip.small {
        font-size: var(--ha-font-size-s, 12px);
        min-height: 32px;
        padding: 0 var(--ha-space-3, 12px);
      }
      .spanpick {
        align-items: center;
        color: var(--lego-text-2);
        display: inline-flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        margin-left: var(--ha-space-2, 8px);
      }
      .spanpick select {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        color: var(--lego-text);
        font: inherit;
        min-height: 32px;
        padding: 0 var(--ha-space-2, 8px);
      }
      .busy {
        opacity: 0.5;
        pointer-events: none;
        transition: opacity var(--ha-animation-duration-fast, 150ms);
      }
      .switching,
      .pad {
        padding: 0 var(--ha-space-4, 16px);
      }
      .error {
        color: var(--lego-bad);
        padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px);
      }
      .error p {
        margin: 0;
      }
      @media (max-width: 640px) {
        .startson {
          padding-left: 0;
        }
      }
    `,
  ];
}

define("lego-panel", LegoPanel);

declare global {
  interface HTMLElementTagNameMap {
    "lego-panel": LegoPanel;
  }
}
