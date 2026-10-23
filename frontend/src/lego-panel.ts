import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type Hass = {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ): Promise<unknown>;
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
  resets_at: string;
}

interface Account {
  entry_id: string;
  name: string;
}

interface AccountList {
  accounts: Account[];
  selected: string | null;
}

interface Dashboard {
  entry_id: string;
  device_id: string | null;
  rows: string[];
  region: string;
  currency: string | null;
  quota: Quota;
  last_synced: string | null;
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
 * record, so omitting the target type-checks cleanly and fails at runtime, in the
 * browser, where nobody is watching. That shipped in four releases. Actions target
 * the account's Brickset device, so the target is its device_id.
 */
export function ownershipCall(
  deviceId: string,
  item: Pick<LegoSet, "set_number" | "owned">,
): Record<string, unknown> {
  return {
    device_id: deviceId,
    set_number: item.set_number,
    owned: !item.owned,
  };
}

/** The data a refresh_collection call needs, exported for the same reason. */
export function refreshCall(deviceId: string): Record<string, unknown> {
  return { device_id: deviceId };
}

/**
 * Address a websocket command at one account. Exported for the same reason as
 * ownershipCall: config_entry_id is optional on the Python side, so an empty
 * string would pass the schema and then fail to resolve to an entry. Omitting the
 * key is what makes the server fall back to the stored choice.
 */
export function accountCall(
  type: string,
  entryId: string,
): Record<string, unknown> {
  return entryId ? { type, config_entry_id: entryId } : { type };
}

/**
 * How long ago Brickset last answered a poll. Once the daily budget is spent the
 * panel keeps showing the last sync's data, so its age is what says how far to
 * trust it. Exported so a test can pin the wording.
 */
export function syncedAgo(lastSynced: string | null, now: Date): string {
  if (!lastSynced) return "Not synced yet";
  const minutes = Math.floor(
    (now.getTime() - new Date(lastSynced).getTime()) / 60_000,
  );
  if (minutes < 1) return "Updated just now";
  const ago = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (minutes < 60) return `Updated ${ago.format(-minutes, "minute")}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `Updated ${ago.format(-hours, "hour")}`;
  return `Updated ${ago.format(-Math.floor(hours / 24), "day")}`;
}

/** A LEGO.com RRP in the account's region, or "" when Brickset has none. */
export function formatPrice(
  value: number | null | undefined,
  currency: string | null,
  language?: string,
  wholeUnits = false,
): string {
  // == null, not === null: a payload that leaves the field out sends undefined,
  // and Intl turns that into "NaN" rather than failing.
  if (value == null || !currency) return "";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    ...(wholeUnits ? { maximumFractionDigits: 0 } : {}),
  }).format(value);
}

/**
 * The text of a rejected call. Home Assistant's websocket rejects with a plain
 * {code, message} object rather than an Error, which String() turns into
 * "[object Object]".
 */
export function errorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

/** "1 set", "12 sets". */
export function count(n: number, one: string, many: string): string {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

/** Within this many days of leaving sale, a set's exit date is flagged. */
const RETIRING_SOON_DAYS = 60;

/**
 * How a card's date reads at a glance, so released and upcoming sets differ without
 * longer wording: "due" not out yet, "retiring" leaving sale soon, "retired" gone.
 */
export function whenTone(
  item: Pick<LegoSet, "available_from" | "available_until">,
  now: Date,
): "due" | "retiring" | "retired" | "" {
  if (item.available_until) {
    const until = new Date(item.available_until).getTime();
    if (until < now.getTime()) return "retired";
    const days = (until - now.getTime()) / 86_400_000;
    return days <= RETIRING_SOON_DAYS ? "retiring" : "";
  }
  if (item.available_from && new Date(item.available_from) > now) return "due";
  return "";
}

/** What a card says about a set's dates, worded for whether they have passed. */
export function whenLabel(
  item: Pick<LegoSet, "available_from" | "available_until" | "name">,
  now: Date,
  format: (iso: string) => string,
): string {
  if (item.available_until) {
    const gone = new Date(item.available_until) < now;
    return `${gone ? "Retired" : "Retires"} ${format(item.available_until)}`;
  }
  if (item.available_from) {
    const coming = new Date(item.available_from) > now;
    return `${coming ? "Due" : "Out"} ${format(item.available_from)}`;
  }
  return isNamed(item) ? "Date unknown" : "Details tbd";
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
  @state() private _over = "";
  @state() private _pending = new Set<string>();
  @state() private _collectionError = "";
  @state() private _switching = "";
  @state() private _accounts: Account[] = [];
  @state() private _account = "";

  public override connectedCallback(): void {
    super.connectedCallback();
    void this._load();
  }

  private async _refreshCollection(): Promise<void> {
    this._refreshing = true;
    this._refreshError = "";
    try {
      await this.hass.callService(
        "lego",
        "refresh_collection",
        refreshCall(this._dash?.device_id ?? ""),
      );
      await this._load();
    } catch (err) {
      this._refreshError = errorText(err);
    } finally {
      this._refreshing = false;
    }
  }

  private async _selectAccount(entryId: string): Promise<void> {
    if (entryId === this._account) return;
    this._account = entryId;
    this._switching =
      this._accounts.find((item) => item.entry_id === entryId)?.name ??
      "account";
    this._collection = [];
    this._results = [];
    this._query = "";
    this._theme = "";
    try {
      await this._load();
      if (this._tab === "collection") await this._loadCollection();
    } finally {
      this._switching = "";
    }
    try {
      await this.hass.callWS({
        type: "lego/account/set",
        config_entry_id: entryId,
      });
    } catch {
      // The switch has already been applied; it just will not survive a reload.
    }
  }

  private async _load(): Promise<void> {
    try {
      if (!this._accounts.length) {
        const list = await this.hass.callWS<AccountList>({
          type: "lego/accounts",
        });
        this._accounts = list.accounts;
        this._account = list.selected ?? "";
      }
      const dash = await this.hass.callWS<Dashboard>(
        accountCall("lego/dashboard", this._account),
      );
      this._dash = dash;
      this._error = "";
      if (!this._theme || !(this._theme in dash.themes)) {
        this._theme = Object.keys(dash.themes)[0] ?? "";
      }
    } catch (err) {
      this._error = errorText(err);
    }
  }

  private async _loadCollection(): Promise<void> {
    if (this._collection.length) return;
    try {
      const res = await this.hass.callWS<{ sets: LegoSet[] }>({
        ...accountCall("lego/collection", this._account),
        filter: "owned",
      });
      this._collection = res.sets;
      this._collectionError = "";
    } catch (err) {
      // Kept apart from _error, which would blank the Home tab too.
      this._collectionError = errorText(err);
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
        ...accountCall("lego/search", this._account),
        query,
        limit: 24,
      });
      this._results = res.sets;
    } catch {
      this._results = [];
    }
  }

  private _setPending(number: string, pending: boolean): void {
    const next = new Set(this._pending);
    if (pending) next.add(number);
    else next.delete(number);
    this._pending = next;
  }

  private async _toggleOwned(item: LegoSet): Promise<void> {
    if (this._pending.has(item.set_number)) return;
    this._writeError = "";
    this._setPending(item.set_number, true);
    try {
      await this.hass.callService(
        "lego",
        "set_collection",
        ownershipCall(this._dash?.device_id ?? "", item),
      );
    } catch (err) {
      // A rejected write used to fail only in the console, which read as a
      // flaky button rather than a broken one.
      this._writeError = errorText(err);
      return;
    } finally {
      this._setPending(item.set_number, false);
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
    this._over = "";
    if (from < 0 || to < 0 || from === to) return;
    rows.splice(to, 0, ...rows.splice(from, 1));
    void this._saveRows(rows);
  }

  /** Arrow keys on a row's handle move it, since dragging needs a pointer. */
  private _onHandleKey(ev: KeyboardEvent, row: string): void {
    const step = ev.key === "ArrowUp" ? -1 : ev.key === "ArrowDown" ? 1 : 0;
    if (!step) return;
    ev.preventDefault();
    const rows = [...(this._dash?.rows ?? [])];
    const from = rows.indexOf(row);
    const to = from + step;
    if (from < 0 || to < 0 || to >= rows.length) return;
    rows.splice(to, 0, ...rows.splice(from, 1));
    void this._saveRows(rows);
    void this.updateComplete.then(() =>
      this.renderRoot
        .querySelector<HTMLButtonElement>(`.drag[data-row="${row}"]`)
        ?.focus(),
    );
  }

  protected override render(): TemplateResult {
    return html`
      <div class="app">
        <header class=${this.narrow ? "narrow" : ""}>
          <div class="title">
            ${this.narrow
              ? html`<ha-menu-button
                  .hass=${this.hass}
                  .narrow=${this.narrow}
                ></ha-menu-button>`
              : nothing}
            <h1>LEGO</h1>
          </div>
          ${this._renderAccounts()}
          <div class="tabs" role="tablist">
            <button
              class=${this._tab === "home" ? "tab on" : "tab"}
              role="tab"
              aria-selected=${this._tab === "home"}
              @click=${() => (this._tab = "home")}
            >
              Home
            </button>
            <button
              class=${this._tab === "collection" ? "tab on" : "tab"}
              role="tab"
              aria-selected=${this._tab === "collection"}
              @click=${() => {
                this._tab = "collection";
                void this._loadCollection();
              }}
            >
              Collection
            </button>
          </div>
        </header>
        ${this._switching
          ? html`<p class="muted switching" role="status">
              Loading ${this._switching}…
            </p>`
          : nothing}
        <div
          class=${this._switching ? "busy" : ""}
          aria-busy=${!!this._switching}
        >
          ${this._error
            ? this._renderError(this._error, () => void this._load())
            : this._tab === "home"
              ? this._renderHome()
              : this._renderCollection()}
        </div>
        ${this._writeError
          ? html`<div class="toast" role="alert">
              <span
                >Brickset would not save that change: ${this._writeError}</span
              >
              <button
                class="dismiss"
                aria-label="Dismiss"
                @click=${() => (this._writeError = "")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderError(message: string, retry: () => void): TemplateResult {
    return html`<div class="error" role="alert">
      <p>${message}</p>
      <button class="link" @click=${retry}>Try again</button>
    </div>`;
  }

  private _renderAccounts(): TemplateResult | typeof nothing {
    // One account needs no picker, and the sidebar panel is registered once for
    // all of them, so this is the only place to choose between them.
    if (this._accounts.length < 2) return nothing;
    return html`
      <select
        class="account"
        aria-label="Brickset account"
        @change=${(ev: Event) =>
          void this._selectAccount((ev.target as HTMLSelectElement).value)}
      >
        ${this._accounts.map(
          (item) => html`
            <option
              value=${item.entry_id}
              ?selected=${item.entry_id === this._account}
            >
              ${item.name}
            </option>
          `,
        )}
      </select>
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
        class=${this._dragging === row
          ? "row dragging"
          : this._dragging && this._over === row
            ? "row over"
            : "row"}
        @dragover=${(ev: DragEvent) => ev.preventDefault()}
        @dragenter=${() => (this._over = row)}
        @drop=${() => this._onDrop(row)}
      >
        <div class="rowhead">
          <h2>${ROW_TITLES[row]}</h2>
          <button
            class="drag"
            data-row=${row}
            draggable="true"
            title="Drag, or use the arrow keys, to reorder"
            aria-label=${`Move ${ROW_TITLES[row]} up or down`}
            @dragstart=${() => (this._dragging = row)}
            @dragend=${() => {
              this._dragging = "";
              this._over = "";
            }}
            @keydown=${(ev: KeyboardEvent) => this._onHandleKey(ev, row)}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
        </div>
        ${body}
      </section>
    `;
  }

  private _renderThemes(): TemplateResult {
    const themes = Object.keys(this._dash?.themes ?? {});
    if (!themes.length) {
      return html`<p class="muted">
        No themes followed yet. Add one in the integration options to see new
        releases here.
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
          <ha-icon
            icon=${this._refreshing ? "mdi:sync" : "mdi:cloud-sync"}
          ></ha-icon>
          ${this._refreshing ? "Updating…" : "Update now"}
        </button>
        <span
          class="quota ${short || tight ? "warn" : ""}"
          title=${this._dash?.last_synced
            ? new Date(this._dash.last_synced).toLocaleString()
            : nothing}
        >
          ${syncedAgo(this._dash?.last_synced ?? null, new Date())}.
          ${short
            ? html`Daily budget spent, ${quota.calls_today} of ${quota.budget}
              used, so this is the last sync's data. Updates resume
              ${this._resumes(quota.resets_at)}.`
            : html`Costs ${cost} of ${quota.remaining} calls left today.`}
        </span>
      </div>
      ${this._refreshError
        ? html`<p class="caveat bad">${this._refreshError}</p>`
        : nothing}
    `;
  }

  /** When the budget resets, in local time, saying "tomorrow" when it is. */
  private _resumes(iso: string): string {
    const at = new Date(iso);
    const time = at.toLocaleTimeString(this.hass?.locale?.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return at.toDateString() === new Date().toDateString()
      ? `at ${time}`
      : `tomorrow at ${time}`;
  }

  private _renderStats(): TemplateResult {
    const stats = this._dash?.stats;
    if (!stats) return html``;
    const cells: [string, string][] = [
      [this._num(stats.sets_owned), "Sets owned"],
      [this._num(stats.sets_distinct), "Distinct sets"],
      [this._num(stats.pieces_owned), "Pieces"],
      [this._num(stats.minifigs_owned), "Minifigures"],
      [
        formatPrice(
          stats.value,
          this._dash?.currency ?? null,
          this.hass?.locale?.language,
          true,
        ) || this._num(Math.round(stats.value)),
        "Value at RRP",
      ],
    ];
    return html`
      <div class="stats">
        ${cells.map(
          ([n, label]) => html`
            <div class="stat">
              <span class="n">${n}</span><span class="l">${label}</span>
            </div>
          `,
        )}
      </div>
      ${this._renderRefresh()}
      ${stats.sets_missing_price
        ? html`<p class="caveat">
            ${stats.sets_missing_price === 1
              ? "1 set has no published price and is not counted in the value."
              : `${this._num(stats.sets_missing_price)} sets have no published
                price and are not counted in the value.`}
          </p>`
        : nothing}
      <button
        class="link"
        @click=${() => {
          this._tab = "collection";
          void this._loadCollection();
        }}
      >
        Browse all sets ›
      </button>
    `;
  }

  private _renderCollection(): TemplateResult {
    const showing =
      this._query.trim().length >= 2 ? this._results : this._collection;
    return html`
      <div class="rows">
        <section class="row">
          <div class="searchbox">
            <input
              class="search"
              type="search"
              .value=${this._query}
              placeholder="Search your sets and the full catalogue…"
              aria-label="Search sets"
              @input=${(ev: Event) =>
                void this._search((ev.target as HTMLInputElement).value)}
            />
            ${this._query
              ? html`<button
                  class="clear"
                  aria-label="Clear search"
                  @click=${() => void this._search("")}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`
              : nothing}
          </div>
          ${this._collectionError && this._query.trim().length < 2
            ? this._renderError(this._collectionError, () => {
                this._collectionError = "";
                void this._loadCollection();
              })
            : html`<p class="muted count">
                  ${this._query.trim().length >= 2
                    ? count(showing.length, "matching set", "matching sets")
                    : count(showing.length, "set owned", "sets owned")}
                </p>
                <div class="grid">
                  ${showing.map((item) => this._card(item))}
                </div>`}
        </section>
      </div>
    `;
  }

  private _carousel(sets: LegoSet[], empty: string): TemplateResult {
    if (!sets.length) return html`<p class="muted">${empty}</p>`;
    return html`<div class="carousel">
      ${sets.map((item) => this._card(item))}
    </div>`;
  }

  /**
   * Open the set's Brickset page in a new tab. The image and the name both link,
   * and only the name takes a tab stop, so a keyboard reaches each set once.
   */
  private _linked(
    item: LegoSet,
    content: TemplateResult,
    decorative = false,
  ): TemplateResult {
    if (!item.url) return content;
    return html`<a
      class="open"
      href=${item.url}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${decorative ? "-1" : nothing}
      aria-hidden=${decorative ? "true" : nothing}
      >${content}</a
    >`;
  }

  private _card(item: LegoSet): TemplateResult {
    return html`
      <article class="card">
        ${this._linked(
          item,
          item.image
            ? html`<img src=${item.image} alt="" loading="lazy" />`
            : html`<img
                class="noart"
                src=${FALLBACK_ART}
                alt=""
                loading="lazy"
              />`,
          true,
        )}
        <div class="meta">
          ${this._linked(
            item,
            html`<span
              class=${isNamed(item) ? "name" : "name unnamed"}
              title=${isNamed(item)
                ? item.name
                : "Brickset has not published a name yet"}
              >${displayName(item)}</span
            >`,
          )}
          <span class="num"
            >${[
              item.set_number,
              formatPrice(
                item.retail_price,
                this._dash?.currency ?? null,
                this.hass?.locale?.language,
              ),
            ]
              .filter(Boolean)
              .join(" · ")}</span
          >
          <span class="when ${whenTone(item, new Date())}"
            >${whenLabel(item, new Date(), (iso) => this._date(iso))}</span
          >
          <div class="foot">
            <span
              class=${item.owned
                ? "state own"
                : item.wanted
                  ? "state want"
                  : "state"}
            >
              ${item.owned
                ? item.qty_owned > 1
                  ? `Owned ×${item.qty_owned}`
                  : "Owned"
                : item.wanted
                  ? "Wanted"
                  : ""}
            </span>
            <button
              class=${[
                "act",
                item.owned ? "on" : "",
                this._pending.has(item.set_number) ? "pending" : "",
              ].join(" ")}
              ?disabled=${this._pending.has(item.set_number)}
              title=${item.owned
                ? "Remove from your collection"
                : "Add to your collection"}
              aria-label=${item.owned
                ? "Remove from your collection"
                : "Add to your collection"}
              @click=${() => void this._toggleOwned(item)}
            >
              <ha-icon icon=${item.owned ? "mdi:check" : "mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `;
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

  static override styles = css`
    /*
     * Every colour, size, space and radius below comes from a Home Assistant
     * theme variable or an --ha- token; each --ha- token carries the value the
     * frontend lists for it, for an older frontend that lacks the token.
     */
    :host {
      --lego-text: var(--primary-text-color, #141414);
      --lego-text-2: var(--secondary-text-color, #5e5e5e);
      --lego-surface: var(--card-background-color, #fff);
      --lego-ground: var(--primary-background-color);
      --lego-outline: var(--divider-color);
      --lego-primary: var(--primary-color);
      --lego-on-primary: var(--text-primary-color, #fff);
      --lego-focus: var(--ha-color-focus, var(--primary-color));
      /* Status text sits on the card surface, so it takes the on-* tokens. */
      --lego-own: var(--ha-color-on-success-normal, #036730);
      --lego-want: var(--ha-color-on-warning-normal, #9d3800);
      --lego-bad: var(--ha-color-on-danger-normal, #b30532);
      --lego-own-fill: var(--ha-color-fill-success-loud-resting, #00883c);
      --lego-on-own-fill: var(--ha-color-on-success-loud, #fff);
      --lego-radius: var(
        --ha-card-border-radius,
        var(--ha-border-radius-lg, 12px)
      );
      --lego-line: var(--ha-border-width-sm, 1px);
      display: block;
      background: var(--lego-ground);
      color: var(--lego-text);
      min-height: 100vh;
    }
    .app {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 0 var(--ha-space-8, 32px);
    }
    /* One toolbar row at Home Assistant's own header height; on a phone the tabs
       take a row of their own below it. */
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
    header .account {
      margin-left: auto;
      order: 3;
    }
    header.narrow .tabs {
      flex-basis: 100%;
      order: 4;
    }
    .title {
      align-items: center;
      display: flex;
      gap: var(--ha-space-1, 4px);
      min-width: 0;
    }
    /* The page title reads like Home Assistant's own toolbar titles: regular
       weight, so the bold section headings below it are the ones that stand out. */
    h1 {
      font-size: var(--ha-font-size-xl, 20px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-normal, 400);
      margin: 0;
    }
    .account {
      background: var(--lego-ground);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-md, 8px);
      color: inherit;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      max-width: 50%;
      min-height: 48px;
      padding: 0 var(--ha-space-3, 12px);
    }
    .tabs {
      align-self: stretch;
      display: flex;
      gap: var(--ha-space-1, 4px);
      order: 2;
    }
    .tab {
      appearance: none;
      background: none;
      border: 0;
      border-bottom: var(--ha-border-width-md, 2px) solid transparent;
      color: var(--lego-text-2);
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      min-height: var(--header-height, 56px);
      padding: 0 var(--ha-space-4, 16px);
      cursor: pointer;
    }
    header.narrow .tab {
      min-height: 48px;
    }
    .tab.on {
      color: var(--lego-primary);
      border-bottom-color: var(--lego-primary);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-6, 24px);
      padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px) 0;
    }
    .row {
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      padding: var(--ha-space-4, 16px);
    }
    .row.dragging {
      opacity: 0.5;
    }
    /* Where a dragged row will land. */
    .row.over {
      box-shadow: inset 0 var(--ha-border-width-md, 2px) 0 var(--lego-primary);
    }
    .rowhead {
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      margin-bottom: var(--ha-space-3, 12px);
    }
    /* Section headers outrank body text: xl at the heading weight. */
    h2 {
      font-size: var(--ha-font-size-xl, 20px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-bold, 700);
      margin: 0;
    }
    .drag {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: grab;
      display: grid;
      place-items: center;
      min-width: 48px;
      min-height: 48px;
      /* Trailing, so the title lines up with the cards below it. */
      margin: calc(-1 * var(--ha-space-3, 12px))
        calc(-1 * var(--ha-space-3, 12px)) calc(-1 * var(--ha-space-3, 12px))
        auto;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ha-space-2, 8px);
      margin-bottom: var(--ha-space-3, 12px);
    }
    .chip {
      appearance: none;
      background: none;
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-pill, 9999px);
      color: var(--lego-text-2);
      cursor: pointer;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      min-height: 40px;
      padding: 0 var(--ha-space-4, 16px);
    }
    .chip.on {
      background: var(--lego-primary);
      border-color: var(--lego-primary);
      color: var(--lego-on-primary);
    }
    .carousel {
      display: flex;
      gap: var(--ha-space-3, 12px);
      overflow-x: auto;
      padding-bottom: var(--ha-space-1, 4px);
      scroll-snap-type: x proximity;
    }
    .carousel .card {
      flex: 0 0 156px;
      scroll-snap-align: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
      gap: var(--ha-space-3, 12px);
    }
    .card {
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    /* Set photos come on white; inset and rounded they read as photos rather
       than as gaps in a dark card. */
    .card img {
      background: var(--lego-ground);
      border-radius: var(--ha-border-radius-md, 8px);
      box-sizing: border-box;
      height: 104px;
      margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0;
      object-fit: contain;
      width: calc(100% - 2 * var(--ha-space-2, 8px));
    }
    /* Stand-in art, so it must read as absent rather than as the set. */
    .card img.noart {
      padding: var(--ha-space-6, 24px);
      opacity: 0.35;
      box-sizing: border-box;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-1, 4px);
      padding: var(--ha-space-3, 12px);
    }
    .name {
      display: block;
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-bold, 700);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* An unannounced set has no name worth reading, so the number leads. */
    .name.unnamed {
      color: var(--lego-text-2);
      font-style: italic;
      font-weight: var(--ha-font-weight-normal, 400);
    }
    .num {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
      font-variant-numeric: tabular-nums;
    }
    .name.unnamed + .num {
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-bold, 700);
      color: var(--lego-text);
    }
    .when {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
    }
    /* Not out yet: a dot in the primary colour, so the text keeps its contrast. */
    .when.due::before {
      background: var(--lego-primary);
      border-radius: var(--ha-border-radius-circle, 50%);
      content: "";
      display: inline-block;
      height: 8px;
      margin-right: var(--ha-space-1, 4px);
      vertical-align: middle;
      width: 8px;
    }
    .when.retiring {
      color: var(--lego-want);
      font-weight: var(--ha-font-weight-medium, 500);
    }
    .foot {
      align-items: center;
      display: flex;
      gap: var(--ha-space-2, 8px);
      margin-top: var(--ha-space-2, 8px);
    }
    .state {
      font-size: var(--ha-font-size-s, 12px);
      font-weight: var(--ha-font-weight-medium, 500);
      flex: 1;
      color: var(--lego-text-2);
    }
    .state.own {
      color: var(--lego-own);
    }
    .state.want {
      color: var(--lego-want);
    }
    /* A 48px target drawing a 32px circle, so the card does not look crowded. */
    .act {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: pointer;
      display: grid;
      place-items: center;
      position: relative;
      width: 48px;
      height: 48px;
      padding: 0;
      margin: calc(-1 * var(--ha-space-2, 8px));
      --mdc-icon-size: 18px;
    }
    .act::before {
      content: "";
      position: absolute;
      inset: var(--ha-space-2, 8px);
      border: var(--lego-line) solid var(--lego-text-2);
      border-radius: var(--ha-border-radius-circle, 50%);
    }
    .act ha-icon {
      position: relative;
    }
    .act.on {
      color: var(--lego-on-own-fill);
    }
    .act.on::before {
      background: var(--lego-own-fill);
      border-color: var(--lego-own-fill);
    }
    .act.pending {
      cursor: progress;
      opacity: 0.5;
    }
    .act:focus-visible {
      outline-offset: calc(-1 * var(--ha-space-1, 4px));
    }
    /* Lines drawn per cell, so an odd last cell leaves no grey gap. */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0;
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--lego-radius);
      overflow: hidden;
    }
    .stat {
      background: var(--lego-surface);
      box-shadow: 0 0 0 var(--lego-line) var(--lego-outline);
      display: flex;
      flex-direction: column;
      gap: var(--ha-space-1, 4px);
      padding: var(--ha-space-4, 16px);
    }
    .stat .n {
      font-size: var(--ha-font-size-2xl, 24px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-variant-numeric: tabular-nums;
    }
    .stat .l {
      font-size: var(--ha-font-size-s, 12px);
      color: var(--lego-text-2);
    }
    .caveat {
      font-size: var(--ha-font-size-s, 12px);
      line-height: var(--ha-line-height-normal, 1.6);
      color: var(--lego-text-2);
      margin: var(--ha-space-2, 8px) 0 0;
    }
    .caveat.bad {
      color: var(--lego-bad);
    }
    .refresh {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      margin: var(--ha-space-3, 12px) 0 0;
    }
    .refreshbtn {
      appearance: none;
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      min-height: 48px;
      padding: 0 var(--ha-space-5, 20px);
      border: 0;
      border-radius: var(--ha-border-radius-pill, 9999px);
      background: var(--lego-primary);
      color: var(--lego-on-primary);
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      font-weight: var(--ha-font-weight-medium, 500);
      cursor: pointer;
    }
    .refreshbtn ha-icon {
      --mdc-icon-size: 20px;
    }
    .refreshbtn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .quota {
      font-size: var(--ha-font-size-s, 12px);
      line-height: var(--ha-line-height-normal, 1.6);
      color: var(--lego-text-2);
    }
    .quota.warn {
      color: var(--lego-want);
    }
    .quota.bad {
      color: var(--lego-bad);
    }
    .link {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-primary);
      cursor: pointer;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      margin-top: var(--ha-space-2, 8px);
      min-height: 48px;
      padding: 0;
    }
    .searchbox {
      position: relative;
    }
    .search::-webkit-search-cancel-button {
      appearance: none;
    }
    .clear {
      appearance: none;
      background: none;
      border: 0;
      color: var(--lego-text-2);
      cursor: pointer;
      display: grid;
      height: 48px;
      place-items: center;
      position: absolute;
      right: 0;
      top: 0;
      width: 48px;
    }
    .busy {
      opacity: 0.5;
      pointer-events: none;
      transition: opacity 150ms;
    }
    .switching {
      padding: 0 var(--ha-space-4, 16px);
    }
    .search {
      background: var(--lego-ground);
      border: var(--lego-line) solid var(--lego-outline);
      border-radius: var(--ha-border-radius-md, 8px);
      color: inherit;
      font: inherit;
      font-size: var(--ha-font-size-m, 14px);
      min-height: 48px;
      /* Room on the right for the clear button. */
      padding: 0 48px 0 var(--ha-space-3, 12px);
      width: 100%;
      box-sizing: border-box;
    }
    .muted {
      color: var(--lego-text-2);
      font-size: var(--ha-font-size-m, 14px);
      margin: var(--ha-space-3, 12px) 0 0;
    }
    .error {
      color: var(--lego-bad);
      padding: var(--ha-space-5, 20px) var(--ha-space-4, 16px);
    }
    .error p {
      margin: 0;
    }
    .count {
      margin-bottom: var(--ha-space-3, 12px);
    }
    /* A failed write is shown where it cannot be scrolled out of view. */
    .toast {
      align-items: center;
      background: var(--lego-surface);
      border: var(--lego-line) solid var(--lego-bad);
      border-radius: var(--ha-border-radius-md, 8px);
      bottom: var(--ha-space-4, 16px);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
      color: var(--lego-bad);
      display: flex;
      gap: var(--ha-space-2, 8px);
      left: 50%;
      max-width: min(560px, calc(100% - 2 * var(--ha-space-4, 16px)));
      padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px)
        var(--ha-space-2, 8px) var(--ha-space-4, 16px);
      position: fixed;
      transform: translateX(-50%);
      width: max-content;
      z-index: 3;
    }
    .dismiss {
      appearance: none;
      background: none;
      border: 0;
      color: inherit;
      cursor: pointer;
      display: grid;
      flex: none;
      min-height: 48px;
      min-width: 48px;
      place-items: center;
    }
    a.open {
      display: block;
      min-width: 0;
      overflow: hidden;
      color: inherit;
      text-decoration: none;
    }
    a.open:hover .name {
      text-decoration: underline;
    }
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: var(--ha-border-width-md, 2px) solid var(--lego-focus);
      outline-offset: var(--ha-border-width-md, 2px);
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
