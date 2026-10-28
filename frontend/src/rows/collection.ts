import {
  css,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { state } from "lit/decorators.js";

import { CHANGED, LegoRow, define } from "../base";
import {
  accountCall,
  count,
  errorText,
  refreshCall,
  syncedAgo,
} from "../format";
import { isSearch } from "../state";
import type { LegoSet } from "../types";

/** Stats, the update button, and every owned set behind a fold of their own. */
export class LegoCollectionRow extends LegoRow {
  protected readonly row = "collection";

  @state() private refreshing = false;
  @state() private refreshError = "";
  @state() private setsOpen = false;
  @state() private owned?: LegoSet[];
  @state() private ownedError = "";
  @state() private query = "";
  @state() private results: LegoSet[] = [];
  /** A tick not yet back from the server; the dashboard's copy wins once it is. */
  @state() private pricesPick?: boolean;

  private ownedFor?: object;

  static override styles = [
    LegoRow.styles,
    css`
      /* Lines drawn per cell, so an odd last cell leaves no grey gap. */
      .stats {
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--lego-radius);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        overflow: hidden;
      }
      .stat {
        box-shadow: 0 0 0 var(--lego-line) var(--lego-outline);
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-1, 4px);
        padding: var(--ha-space-4, 16px);
      }
      .stat .n {
        font-size: var(--ha-font-size-2xl, 24px);
        font-variant-numeric: tabular-nums;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: var(--ha-line-height-condensed, 1.2);
      }
      .stat .l {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
      }
      .searchbox {
        position: relative;
      }
      .search {
        background: var(--lego-ground);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-sizing: border-box;
        color: inherit;
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
        min-height: 48px;
        padding: 0 48px 0 var(--ha-space-3, 12px);
        width: 100%;
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
      .count {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: var(--ha-space-2, 8px) var(--ha-space-4, 16px);
        justify-content: space-between;
        margin-bottom: var(--ha-space-3, 12px);
      }
      .count p {
        margin: 0;
      }
      .prices {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        min-height: 48px;
      }
      .prices input {
        accent-color: var(--primary-color);
        height: 18px;
        margin: 0;
        width: 18px;
      }
    `,
  ];

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("dash")) this.pricesPick = undefined;
    // A write or an account switch replaces the dashboard; the grid follows it.
    if (changed.has("dash") && this.dash !== this.ownedFor) {
      this.owned = undefined;
      // An open search re-asks, so a set just marked owned shows its tick and the
      // record Brickset now holds for it.
      if (isSearch(this.query)) void this.search(this.query);
    }
  }

  protected override updated(): void {
    if (this.setsOpen && !this.collapsed && this.owned === undefined) {
      void this.loadOwned();
    }
  }

  private async loadOwned(): Promise<void> {
    const dash = this.dash;
    if (!dash || this.ownedFor === dash) return;
    this.ownedFor = dash;
    try {
      const res = await this.hass.callWS<{ sets: LegoSet[] }>({
        ...accountCall("lego/collection", dash.entry_id),
        filter: "owned",
      });
      if (this.ownedFor === dash) {
        this.owned = res.sets;
        this.ownedError = "";
      }
    } catch (err) {
      if (this.ownedFor === dash) this.ownedError = errorText(err);
    }
  }

  private async search(query: string): Promise<void> {
    this.query = query;
    if (!isSearch(query)) {
      this.results = [];
      return;
    }
    try {
      const res = await this.hass.callWS<{ sets: LegoSet[] }>({
        ...accountCall("lego/search", this.dash?.entry_id ?? ""),
        query,
        limit: 24,
      });
      if (this.query === query) this.results = res.sets;
    } catch {
      this.results = [];
    }
  }

  private showPrices(): boolean {
    return this.pricesPick ?? this.dash?.collection_prices ?? true;
  }

  private setPrices(show: boolean): void {
    this.pricesPick = show;
    this.hass
      .callWS({ type: "lego/panel_config/set", collection_prices: show })
      .catch(() => {
        // Applied already; it just will not survive a reload.
      });
  }

  private async refresh(): Promise<void> {
    this.refreshing = true;
    this.refreshError = "";
    try {
      await this.hass.callService(
        "lego",
        "refresh_collection",
        refreshCall(this.dash?.device_id ?? ""),
      );
      this.dispatchEvent(
        new CustomEvent(CHANGED, { bubbles: true, composed: true }),
      );
    } catch (err) {
      this.refreshError = errorText(err);
    } finally {
      this.refreshing = false;
    }
  }

  protected subtitle(): string {
    return syncedAgo(this.dash?.last_synced ?? null, new Date());
  }

  private short(): boolean {
    const quota = this.dash?.quota;
    return !!quota && quota.remaining < quota.refresh_cost;
  }

  protected override actions(): TemplateResult | typeof nothing {
    const quota = this.dash?.quota;
    if (!quota) return nothing;
    const cost = count(quota.refresh_cost, "call", "calls");
    return html`<button
      class="update"
      ?disabled=${this.refreshing || this.short()}
      title=${
        this.short()
          ? "Today's Brickset budget is spent"
          : `Fetch your collection from Brickset now, using ${cost} of the ${quota.remaining} left today`
      }
      @click=${() => void this.refresh()}
    >
      <ha-icon
        icon=${this.refreshing ? "mdi:sync" : "mdi:cloud-sync"}
      ></ha-icon>
      ${this.refreshing ? "Updating…" : "Update"}
      <span class="sep" aria-hidden="true"></span>
      <span class="cost">${cost}</span>
    </button>`;
  }

  /** When the budget resets, in local time, saying "tomorrow" when it is. */
  private resumes(iso: string): string {
    const at = new Date(iso);
    const time = at.toLocaleTimeString(this.hass?.locale?.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return at.toDateString() === new Date().toDateString()
      ? `at ${time}`
      : `tomorrow at ${time}`;
  }

  protected body(): TemplateResult {
    const stats = this.dash?.stats;
    const quota = this.dash?.quota;
    if (!stats) return html`<p class="muted">Loading your collection…</p>`;
    const cells: [number, string][] = [
      [stats.sets_owned, "Sets owned"],
      [stats.sets_distinct, "Distinct sets"],
      [stats.pieces_owned, "Pieces"],
      [stats.minifigs_owned, "Minifigures"],
    ];
    return html`
      <div class="stats">
        ${cells.map(
          ([n, label]) =>
            html`<div class="stat">
              <span class="n">${this.num(n)}</span
              ><span class="l">${label}</span>
            </div>`,
        )}
      </div>
      ${
        this.short() && quota
          ? html`<p class="caveat">
              Daily budget spent, ${quota.calls_today} of ${quota.budget} used,
              so this is the last sync's data. Updates resume
              ${this.resumes(quota.resets_at)}.
            </p>`
          : nothing
      }
      ${
        this.refreshError
          ? html`<p class="caveat bad">${this.refreshError}</p>`
          : nothing
      }
      <div class="subsection">
        <button
          class="fold"
          aria-expanded=${this.setsOpen}
          @click=${() => (this.setsOpen = !this.setsOpen)}
        >
          <ha-icon
            class=${this.setsOpen ? "chev open" : "chev"}
            icon="mdi:chevron-right"
          ></ha-icon>
          <h3>Sets</h3>
          <span class="sub">${this.num(stats.sets_distinct)}</span>
        </button>
        ${this.setsOpen ? this.sets() : nothing}
      </div>
    `;
  }

  private sets(): TemplateResult {
    const searching = isSearch(this.query);
    const showing = searching ? this.results : (this.owned ?? []);
    return html`
      <div class="searchbox">
        <input
          class="search"
          type="search"
          .value=${this.query}
          placeholder="Search your sets and the full catalogue…"
          aria-label="Search sets"
          @input=${(ev: Event) =>
            void this.search((ev.target as HTMLInputElement).value)}
        />
        ${
          this.query
            ? html`<button
                class="clear"
                aria-label="Clear search"
                @click=${() => void this.search("")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`
            : nothing
        }
      </div>
      ${
        this.ownedError && !searching
          ? html`<p class="caveat bad">${this.ownedError}</p>`
          : this.owned === undefined && !searching
            ? html`<p class="muted">Loading your sets…</p>`
            : html`<div class="count">
                  <p class="muted">
                    ${
                      searching
                        ? count(showing.length, "matching set", "matching sets")
                        : `${count(showing.length, "set owned", "sets owned")}, by theme then name`
                    }
                  </p>
                  <label class="prices">
                    <input
                      type="checkbox"
                      .checked=${this.showPrices()}
                      @change=${(ev: Event) =>
                        this.setPrices((ev.target as HTMLInputElement).checked)}
                    />
                    Show prices
                  </label>
                </div>
                <div class="grid">
                  ${showing.map((item) =>
                    this.card(
                      item,
                      "retirement",
                      this.themeColour(item.theme),
                      this.showPrices(),
                    ),
                  )}
                </div>`
      }
    `;
  }
}

define("lego-collection-row", LegoCollectionRow);
