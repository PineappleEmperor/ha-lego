import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type Hass = {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data: Record<string, unknown>): Promise<unknown>;
  formatEntityState?: unknown;
  locale?: { language: string };
};

interface LegoSet {
  set_number: string;
  name: string;
  year: number | null;
  theme: string;
  pieces: number | null;
  minifigs: number | null;
  image: string | null;
  url: string | null;
  owned: boolean;
  wanted: boolean;
  qty_owned: number;
  retail_price: number | null;
  released: boolean;
  available_from: string | null;
  available_until: string | null;
}

interface Stats {
  sets_owned: number;
  sets_distinct: number;
  pieces_owned: number;
  minifigs_owned: number;
  sets_wanted: number;
  value: number;
  sets_missing_price: number;
}

interface Quota {
  calls_today: number;
  budget: number;
  remaining: number;
  refresh_cost: number;
}

interface Dashboard {
  entry_id: string;
  rows: string[];
  region: string;
  quota: Quota;
  stats: Stats;
  wishlist: LegoSet[];
  themes: Record<string, LegoSet[]>;
}

// Brickset publishes a set before its name is announced and fills the name with
// this placeholder. It is real data, not a fault, but it means nothing on a card.
const UNNAMED = "{?}";

/**
 * The data a set_collection call needs. Exported because the required fields are
 * declared in Python and nothing here can check them: callService takes a plain
 * record, so omitting config_entry_id type-checks cleanly and fails at runtime,
 * in the browser, where nobody is watching. That shipped in four releases.
 */
export function ownershipCall(
  entryId: string,
  item: Pick<LegoSet, "set_number" | "owned">,
): Record<string, unknown> {
  return {
    config_entry_id: entryId,
    set_number: item.set_number,
    owned: !item.owned,
  };
}

export function isNamed(item: Pick<LegoSet, "name">): boolean {
  const name = (item.name ?? "").trim();
  return name !== "" && name !== UNNAMED;
}

export function displayName(item: Pick<LegoSet, "name">): string {
  return isNamed(item) ? item.name : "Name tbd";
}

// The integration's own icon, served from custom_components/lego/brand/.
const FALLBACK_ART = "/lego_panel/icon.png";

const ROW_TITLES: Record<string, string> = {
  themes: "New in my themes",
  wishlist: "Your wishlist",
  collection: "Your collection",
};

@customElement("lego-panel")
export class LegoPanel extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @property({ type: Boolean }) public narrow = false;

  @state() private _tab: "home" | "collection" = "home";
  @state() private _dash?: Dashboard;
  @state() private _refreshing = false;
  @state() private _refreshError = "";
  @state() private _writeError = "";
  @state() private _theme = "";
  @state() private _error = "";
  @state() private _collection: LegoSet[] = [];
  @state() private _query = "";
  @state() private _results: LegoSet[] = [];
  @state() private _dragging = "";

  public connectedCallback(): void {
    super.connectedCallback();
    void this._load();
  }

  private async _refreshCollection(): Promise<void> {
    this._refreshing = true;
    this._refreshError = "";
    try {
      await this.hass.callService("lego", "refresh_collection", {
        config_entry_id: this._dash?.entry_id ?? "",
      });
      await this._load();
    } catch (err) {
      this._refreshError = err instanceof Error ? err.message : String(err);
    } finally {
      this._refreshing = false;
    }
  }

  private async _load(): Promise<void> {
    try {
      const dash = await this.hass.callWS<Dashboard>({ type: "lego/dashboard" });
      this._dash = dash;
      this._error = "";
      if (!this._theme || !(this._theme in dash.themes)) {
        this._theme = Object.keys(dash.themes)[0] ?? "";
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  private async _loadCollection(): Promise<void> {
    if (this._collection.length) return;
    try {
      const res = await this.hass.callWS<{ sets: LegoSet[] }>({
        type: "lego/collection",
        filter: "owned",
      });
      this._collection = res.sets;
    } catch (err) {
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  private async _search(query: string): Promise<void> {
    this._query = query;
    if (query.trim().length < 2) {
      this._results = [];
      return;
    }
    try {
      const res = await this.hass.callWS<{ sets: LegoSet[] }>({
        type: "lego/search",
        query,
        limit: 24,
      });
      this._results = res.sets;
    } catch {
      this._results = [];
    }
  }

  private async _toggleOwned(item: LegoSet): Promise<void> {
    this._writeError = "";
    try {
      await this.hass.callService(
        "lego",
        "set_collection",
        ownershipCall(this._dash?.entry_id ?? "", item),
      );
    } catch (err) {
      // A rejected write used to fail only in the console, which read as a
      // flaky button rather than a broken one.
      this._writeError = err instanceof Error ? err.message : String(err);
      return;
    }
    this._collection = [];
    await this._load();
    if (this._tab === "collection") await this._loadCollection();
  }

  private async _saveRows(rows: string[]): Promise<void> {
    if (!this._dash) return;
    this._dash = { ...this._dash, rows };
    try {
      await this.hass.callWS({ type: "lego/panel_config/set", rows });
    } catch {
      // A failed save is not worth interrupting the page for; the order is
      // already applied locally and will simply not survive a reload.
    }
  }

  private _onDrop(target: string): void {
    const rows = [...(this._dash?.rows ?? [])];
    const from = rows.indexOf(this._dragging);
    const to = rows.indexOf(target);
    this._dragging = "";
    if (from < 0 || to < 0 || from === to) return;
    rows.splice(to, 0, ...rows.splice(from, 1));
    void this._saveRows(rows);
  }

  protected render(): TemplateResult {
    return html`
      <div class="app">
        <header>
          <h1>LEGO</h1>
          <div class="tabs">
            <button
              class=${this._tab === "home" ? "tab on" : "tab"}
              @click=${() => (this._tab = "home")}
            >
              Home
            </button>
            <button
              class=${this._tab === "collection" ? "tab on" : "tab"}
              @click=${() => {
                this._tab = "collection";
                void this._loadCollection();
              }}
            >
              Collection
            </button>
          </div>
        </header>
        ${this._writeError
          ? html`<p class="error" role="alert">
              Brickset would not save that change: ${this._writeError}
            </p>`
          : nothing}
        ${this._error
          ? html`<p class="error" role="alert">${this._error}</p>`
          : this._tab === "home"
            ? this._renderHome()
            : this._renderCollection()}
      </div>
    `;
  }

  private _renderHome(): TemplateResult {
    if (!this._dash) return html`<p class="muted">Loading your collection…</p>`;
    return html`
      <div class="rows">
        ${this._dash.rows.map((row) => this._renderRow(row))}
      </div>
    `;
  }

  private _renderRow(row: string): TemplateResult {
    const body =
      row === "themes"
        ? this._renderThemes()
        : row === "wishlist"
          ? this._renderWishlist()
          : this._renderStats();
    return html`
      <section
        class=${this._dragging === row ? "row dragging" : "row"}
        @dragover=${(ev: DragEvent) => ev.preventDefault()}
        @drop=${() => this._onDrop(row)}
      >
        <div class="rowhead">
          <button
            class="drag"
            draggable="true"
            title="Drag to reorder"
            aria-label=${`Reorder ${ROW_TITLES[row]}`}
            @dragstart=${() => (this._dragging = row)}
            @dragend=${() => (this._dragging = "")}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <h2>${ROW_TITLES[row]}</h2>
        </div>
        ${body}
      </section>
    `;
  }

  private _renderThemes(): TemplateResult {
    const themes = Object.keys(this._dash?.themes ?? {});
    if (!themes.length) {
      return html`<p class="muted">
        No themes followed yet. Add one in the integration options to see new releases here.
      </p>`;
    }
    const sets = this._dash?.themes[this._theme] ?? [];
    return html`
      <div class="chips">
        ${themes.map(
          (theme) => html`
            <button
              class=${theme === this._theme ? "chip on" : "chip"}
              @click=${() => (this._theme = theme)}
            >
              ${theme}
            </button>
          `,
        )}
      </div>
      ${this._carousel(sets, "No new sets in this theme.")}
    `;
  }

  private _renderWishlist(): TemplateResult {
    return this._carousel(
      this._dash?.wishlist ?? [],
      "Nothing on your wishlist. Mark a set as wanted to see it here.",
    );
  }

  private _renderRefresh(): TemplateResult {
    const quota = this._dash?.quota;
    if (!quota) return html``;
    const cost = quota.refresh_cost;
    const short = quota.remaining < cost;
    const tight = !short && quota.remaining <= cost * 3;
    return html`
      <div class="refresh">
        <button
          class="refreshbtn"
          ?disabled=${this._refreshing || short}
          @click=${() => void this._refreshCollection()}
        >
          <ha-icon icon=${this._refreshing ? "mdi:sync" : "mdi:cloud-sync"}></ha-icon>
          ${this._refreshing ? "Updating…" : "Update now"}
        </button>
        <span class="quota ${short ? "bad" : tight ? "warn" : ""}">
          ${short
            ? html`Daily budget spent, ${quota.calls_today} of ${quota.budget} used.
              Resets at midnight UTC.`
            : html`Costs ${cost} of ${quota.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError
        ? html`<p class="caveat bad">${this._refreshError}</p>`
        : nothing}
    `;
  }

  private _renderStats(): TemplateResult {
    const stats = this._dash?.stats;
    if (!stats) return html``;
    const cells: [string, string][] = [
      [this._num(stats.sets_owned), "Sets owned"],
      [this._num(stats.sets_distinct), "Distinct sets"],
      [this._num(stats.pieces_owned), "Pieces"],
      [this._num(stats.minifigs_owned), "Minifigures"],
      [this._num(Math.round(stats.value)), "Value at RRP"],
    ];
    return html`
      <div class="stats">
        ${cells.map(
          ([n, label]) => html`
            <div class="stat"><span class="n">${n}</span><span class="l">${label}</span></div>
          `,
        )}
      </div>
      ${this._renderRefresh()}
      ${stats.sets_missing_price
        ? html`<p class="caveat">
            ${this._num(stats.sets_missing_price)} sets have no published price and are not
            counted in the value.
          </p>`
        : nothing}
      <button class="link" @click=${() => {
        this._tab = "collection";
        void this._loadCollection();
      }}>
        Browse all sets ›
      </button>
    `;
  }

  private _renderCollection(): TemplateResult {
    const showing = this._query.trim().length >= 2 ? this._results : this._collection;
    return html`
      <div class="rows">
        <section class="row">
          <input
            class="search"
            type="search"
            .value=${this._query}
            placeholder="Search your sets and the full catalogue…"
            aria-label="Search sets"
            @input=${(ev: Event) => void this._search((ev.target as HTMLInputElement).value)}
          />
          ${this._query.trim().length >= 2
            ? html`<p class="muted">${showing.length} matching sets</p>`
            : html`<p class="muted">${showing.length} sets owned</p>`}
          <div class="grid">${showing.map((item) => this._card(item))}</div>
        </section>
      </div>
    `;
  }

  private _carousel(sets: LegoSet[], empty: string): TemplateResult {
    if (!sets.length) return html`<p class="muted">${empty}</p>`;
    return html`<div class="carousel">${sets.map((item) => this._card(item))}</div>`;
  }

  private _card(item: LegoSet): TemplateResult {
    return html`
      <article class="card">
        ${item.image
          ? html`<img src=${item.image} alt="" loading="lazy" />`
          : html`<img class="noart" src=${FALLBACK_ART} alt="" loading="lazy" />`}
        <div class="meta">
          <span
            class=${isNamed(item) ? "name" : "name unnamed"}
            title=${isNamed(item) ? item.name : "Brickset has not published a name yet"}
            >${displayName(item)}</span
          >
          <span class="num">${item.set_number}</span>
          <span class="when">${this._when(item)}</span>
          <div class="foot">
            <span class=${item.owned ? "state own" : item.wanted ? "state want" : "state"}>
              ${item.owned
                ? item.qty_owned > 1
                  ? `Owned ×${item.qty_owned}`
                  : "Owned"
                : item.wanted
                  ? "Wanted"
                  : item.year || ""}
            </span>
            <button
              class=${item.owned ? "act on" : "act"}
              title=${item.owned ? "Remove from your collection" : "Add to your collection"}
              aria-label=${item.owned ? "Remove from your collection" : "Add to your collection"}
              @click=${() => void this._toggleOwned(item)}
            >
              <ha-icon icon=${item.owned ? "mdi:check" : "mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  private _when(item: LegoSet): string {
    if (item.available_until) return `Retires ${this._date(item.available_until)}`;
    if (item.available_from) return `Out ${this._date(item.available_from)}`;
    return isNamed(item) ? "Date unknown" : "Details tbd";
  }

  private _date(iso: string): string {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return parsed.toLocaleDateString(this.hass?.locale?.language ?? undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  private _num(value: number): string {
    return value.toLocaleString(this.hass?.locale?.language ?? undefined);
  }

  static styles = css`
    :host {
      --pu-text: var(--primary-text-color, #15181b);
      --pu-text-2: var(--secondary-text-color, #5b636c);
      --pu-surface: var(--card-background-color, #fff);
      --pu-ground: var(--primary-background-color, #f4f6f8);
      --pu-line: var(--divider-color, #d8dee4);
      --pu-accent: var(--primary-color, #0288d1);
      --pu-own: var(--success-color, #2e7d32);
      --pu-want: var(--warning-color, #b26a00);
      --pu-bad: var(--error-color, #b3261e);
      --pu-radius: var(--ha-card-border-radius, 12px);
      display: block;
      background: var(--pu-ground);
      color: var(--pu-text);
      min-height: 100vh;
    }
    .app {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 0 32px;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--pu-surface);
      border-bottom: 1px solid var(--pu-line);
      padding: 0 16px;
    }
    h1 {
      font-size: 20px;
      line-height: 64px;
      font-weight: 500;
      margin: 0;
    }
    .tabs {
      display: flex;
      gap: 2px;
    }
    .tab {
      appearance: none;
      background: none;
      border: 0;
      border-bottom: 2px solid transparent;
      color: var(--pu-text-2);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      min-height: 48px;
      padding: 0 18px;
      cursor: pointer;
    }
    .tab.on {
      color: var(--pu-accent);
      border-bottom-color: var(--pu-accent);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 20px 16px 0;
    }
    .row {
      background: var(--pu-surface);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      padding: 16px;
    }
    .row.dragging {
      opacity: 0.5;
    }
    .rowhead {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    /* Material 3 title-large: section headers must outrank body text. */
    h2 {
      font-size: 22px;
      line-height: 28px;
      font-weight: 400;
      margin: 0;
    }
    .drag {
      appearance: none;
      background: none;
      border: 0;
      color: var(--pu-text-2);
      cursor: grab;
      display: grid;
      place-items: center;
      min-width: 48px;
      min-height: 48px;
      margin-left: -12px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .chip {
      appearance: none;
      background: none;
      border: 1px solid var(--pu-line);
      border-radius: 8px;
      color: var(--pu-text-2);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      min-height: 40px;
      padding: 0 14px;
    }
    .chip.on {
      background: var(--pu-accent);
      border-color: var(--pu-accent);
      color: var(--text-primary-color, #fff);
    }
    .carousel {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
      scroll-snap-type: x proximity;
    }
    .carousel .card {
      flex: 0 0 156px;
      scroll-snap-align: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
      gap: 12px;
    }
    .card {
      background: var(--pu-surface);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card img {
      width: 100%;
      height: 104px;
      object-fit: contain;
      background: var(--pu-ground);
    }
    /* Stand-in art, so it must read as absent rather than as the set. */
    .card img.noart {
      padding: 26px;
      opacity: 0.35;
      box-sizing: border-box;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px;
    }
    .name {
      font-size: 14px;
      line-height: 19px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* An unannounced set has no name worth reading, so the number leads. */
    .name.unnamed {
      color: var(--pu-text-2);
      font-style: italic;
      font-weight: 400;
    }
    .num {
      font-size: 11px;
      color: var(--pu-text-2);
      font-variant-numeric: tabular-nums;
    }
    .name.unnamed + .num {
      font-size: 14px;
      font-weight: 500;
      color: var(--pu-text);
    }
    .when {
      font-size: 11px;
      color: var(--pu-text-2);
    }
    .foot {
      align-items: center;
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }
    .state {
      font-size: 11px;
      font-weight: 600;
      flex: 1;
      color: var(--pu-text-2);
    }
    .state.own {
      color: var(--pu-own);
    }
    .state.want {
      color: var(--pu-want);
    }
    .act {
      appearance: none;
      background: none;
      border: 1px solid var(--pu-line);
      border-radius: 50%;
      color: var(--pu-text-2);
      cursor: pointer;
      display: grid;
      place-items: center;
      /* 32px of ink, 48px of target — the padding does the work. */
      width: 32px;
      height: 32px;
      padding: 8px;
      box-sizing: content-box;
      margin: -8px;
      --mdc-icon-size: 18px;
    }
    .act.on {
      background: var(--pu-own);
      border-color: var(--pu-own);
      color: var(--text-primary-color, #fff);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1px;
      background: var(--pu-line);
      border: 1px solid var(--pu-line);
      border-radius: var(--pu-radius);
      overflow: hidden;
    }
    .stat {
      background: var(--pu-surface);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 14px;
    }
    .stat .n {
      font-size: 26px;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .stat .l {
      font-size: 12px;
      color: var(--pu-text-2);
    }
    .caveat {
      font-size: 12px;
      color: var(--pu-text-2);
      margin: 8px 0 0;
    }
    .caveat.bad {
      color: var(--pu-bad);
    }
    .refresh {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      margin: 12px 0 0;
    }
    .refreshbtn {
      appearance: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 20px;
      border: 0;
      border-radius: var(--pu-radius);
      background: var(--pu-accent);
      color: var(--text-primary-color, #fff);
      /* Material 3 label large */
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      cursor: pointer;
    }
    .refreshbtn ha-icon {
      --mdc-icon-size: 20px;
    }
    .refreshbtn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .refreshbtn:focus-visible {
      outline: 2px solid var(--pu-accent);
      outline-offset: 2px;
    }
    .quota {
      /* Material 3 label medium */
      font-size: 12px;
      line-height: 16px;
      color: var(--pu-text-2);
    }
    .quota.warn {
      color: var(--pu-want);
    }
    .quota.bad {
      color: var(--pu-bad);
    }
    .link {
      appearance: none;
      background: none;
      border: 0;
      color: var(--pu-accent);
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
      min-height: 48px;
      padding: 0;
    }
    .search {
      background: var(--pu-ground);
      border: 1px solid var(--pu-line);
      border-radius: 10px;
      color: inherit;
      font: inherit;
      font-size: 14px;
      min-height: 48px;
      padding: 0 14px;
      width: 100%;
      box-sizing: border-box;
    }
    .muted {
      color: var(--pu-text-2);
      font-size: 14px;
      margin: 12px 0 0;
    }
    .error {
      color: var(--error-color, #c62828);
      padding: 20px 16px;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--pu-accent);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "lego-panel": LegoPanel;
  }
}
