import {
  LitElement,
  html,
  nothing,
  type CSSResultGroup,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import "./bricks";
import {
  displayName,
  errorText,
  formatPrice,
  isNamed,
  ownershipCall,
  webUrl,
  whenLabel,
  whenTone,
  type DateFocus,
} from "./format";
import { SERIES_COLOURS } from "./palette";
import { CARDS, CONTROLS, ROW, TOKENS } from "./styles";
import type { Dashboard, Hass, LegoSet } from "./types";

// The integration's own icon, served from custom_components/lego/brand/: the
// picture on a card Brickset has no art for.
export const BRAND_ICON = "/lego_panel/icon.png";

/** Register an element once: the bundle may arrive as the panel and as cards. */
export function define(name: string, element: CustomElementConstructor): void {
  if (!customElements.get(name)) customElements.define(name, element);
}

/** Fired when a write changed the account's data, so whoever holds it reloads. */
export const CHANGED = "lego-changed";
/** Fired when a row's header folds or unfolds it. */
export const TOGGLE = "lego-toggle";
/** Fired when a row's handle is moved with the keyboard. */
export const MOVE = "lego-move";
/** Fired when a release row saves the filter it was just set to. */
export const FILTER = "lego-filter";

export interface RowMeta {
  title: string;
  icon: string;
}

export const ROW_META: Record<string, RowMeta> = {
  collection: { title: "My collection", icon: "mdi:toy-brick-outline" },
  releases: { title: "New releases", icon: "mdi:new-box" },
  recent: { title: "Out recently", icon: "mdi:new-box" },
  upcoming: { title: "Coming soon", icon: "mdi:calendar-clock" },
  themes: { title: "New in my themes", icon: "mdi:tag-heart-outline" },
  wishlist: { title: "My wishlist", icon: "mdi:heart-outline" },
  value: { title: "Collection value", icon: "mdi:chart-donut" },
  pieces: { title: "Pieces", icon: "mdi:shape-outline" },
};

/**
 * One row of the panel, which is also one dashboard card. It draws its frame and
 * fetches what it needs beyond the shared dashboard; the panel or the card around
 * it decides the order, the folding and which account.
 */
export abstract class LegoRow extends LitElement {
  @property({ attribute: false }) public hass!: Hass;
  @property({ attribute: false }) public dash?: Dashboard;
  @property({ attribute: false }) public entryId = "";
  @property({ type: Boolean, reflect: true }) public collapsed = false;
  /** In the panel, where rows reorder; a card has no handle. */
  @property({ type: Boolean }) public handle = false;
  /** Inside a dashboard card, which draws the frame itself. */
  @property({ type: Boolean, reflect: true }) public bare = false;
  /** Picks the palette's dark steps; set from Home Assistant's theme. */
  @property({ type: Boolean, reflect: true }) public dark = false;

  @state() protected pending = new Set<string>();
  @state() protected writeError = "";

  static override styles: CSSResultGroup = [
    TOKENS,
    SERIES_COLOURS,
    ROW,
    CONTROLS,
    CARDS,
  ];

  protected abstract readonly row: string;

  /** The line under the title: what the row holds, shown folded or not. */
  protected abstract subtitle(): string;
  protected abstract body(): TemplateResult | typeof nothing;

  /** Controls at the right of the header, beside the handle. */
  protected actions(): TemplateResult | typeof nothing {
    return nothing;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("hass")) this.dark = !!this.hass?.themes?.darkMode;
  }

  protected override render(): TemplateResult {
    const meta = ROW_META[this.row];
    return html`
      <section class=${this.collapsed ? "row folded" : "row"}>
        <div class="rowhead">
          <button
            class="fold"
            aria-expanded=${!this.collapsed}
            @click=${this.toggle}
          >
            <ha-icon
              class=${this.collapsed ? "chev" : "chev open"}
              icon="mdi:chevron-right"
            ></ha-icon>
            <ha-icon class="rowicon" icon=${meta.icon}></ha-icon>
            <span class="titles">
              <h2>${meta.title}</h2>
              <span class="sub">${this.subtitle()}</span>
            </span>
          </button>
          <div class="actions">${this.actions()}</div>
          ${
            this.handle
              ? html`<button
                  class="drag"
                  draggable="true"
                  title="Drag, or use the arrow keys, to reorder"
                  aria-label=${`Move ${meta.title} up or down`}
                  @keydown=${this.onHandleKey}
                >
                  <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
                </button>`
              : nothing
          }
        </div>
        ${this.collapsed ? nothing : this.body()}
        ${
          this.writeError
            ? html`<p class="caveat bad" role="alert">
                Brickset would not save that change: ${this.writeError}
              </p>`
            : nothing
        }
      </section>
    `;
  }

  private toggle = (): void => {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(
      new CustomEvent(TOGGLE, {
        detail: { row: this.row, collapsed: this.collapsed },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /** Arrow keys on a row's handle move it, since dragging needs a pointer. */
  private onHandleKey = (ev: KeyboardEvent): void => {
    const step = ev.key === "ArrowUp" ? -1 : ev.key === "ArrowDown" ? 1 : 0;
    if (!step) return;
    ev.preventDefault();
    this.dispatchEvent(
      new CustomEvent(MOVE, {
        detail: { row: this.row, step },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /** Put focus back on the handle after the panel has moved the row. */
  public focusHandle(): void {
    this.renderRoot.querySelector<HTMLButtonElement>(".drag")?.focus();
  }

  protected date(iso: string): string {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return parsed.toLocaleDateString(this.hass?.locale?.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  protected num(value: number): string {
    return value.toLocaleString(this.hass?.locale?.language);
  }

  protected money(value: number, wholeUnits = true): string {
    return (
      formatPrice(
        value,
        this.dash?.currency ?? null,
        this.hass?.locale?.language,
        wholeUnits,
      ) || this.num(Math.round(value))
    );
  }

  protected async toggleOwned(item: LegoSet): Promise<void> {
    if (this.pending.has(item.set_number)) return;
    this.writeError = "";
    this.setPending(item.set_number, true);
    try {
      await this.hass.callService(
        "lego",
        "set_collection",
        ownershipCall(this.dash?.device_id ?? "", item),
      );
    } catch (err) {
      // A rejected write used to fail only in the console, which read as a
      // flaky button rather than a broken one.
      this.writeError = errorText(err);
      return;
    } finally {
      this.setPending(item.set_number, false);
    }
    // Ticked at once; the reload the event starts then brings Brickset's record.
    item.owned = !item.owned;
    item.qty_owned = item.owned ? Math.max(item.qty_owned, 1) : 0;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent(CHANGED, { bubbles: true, composed: true }),
    );
  }

  private setPending(number: string, pending: boolean): void {
    const next = new Set(this.pending);
    if (pending) next.add(number);
    else next.delete(number);
    this.pending = next;
  }

  /**
   * Open the set's Brickset page in a new tab. The image and the name both link,
   * and only the name takes a tab stop, so a keyboard reaches each set once.
   */
  private linked(
    item: LegoSet,
    content: TemplateResult,
    decorative = false,
  ): TemplateResult {
    const href = webUrl(item.url);
    if (!href) return content;
    return html`<a
      class="open"
      href=${href}
      target="_blank"
      rel="noopener noreferrer"
      tabindex=${decorative ? "-1" : nothing}
      aria-hidden=${decorative ? "true" : nothing}
      >${content}</a
    >`;
  }

  protected card(
    item: LegoSet,
    focus: DateFocus = "retirement",
    themeColour?: string,
  ): TemplateResult {
    const now = new Date();
    const image = webUrl(item.image);
    const price = formatPrice(
      item.retail_price,
      this.dash?.currency ?? null,
      this.hass?.locale?.language,
    );
    return html`
      <article class="card">
        ${this.linked(
          item,
          image
            ? html`<img src=${image} alt="" loading="lazy" />`
            : html`<img
                class="noart"
                src=${BRAND_ICON}
                alt=""
                loading="lazy"
              />`,
          true,
        )}
        <div class="meta">
          ${this.linked(
            item,
            html`<span
              class=${isNamed(item) ? "name" : "name unnamed"}
              title=${
                isNamed(item)
                  ? item.name
                  : "Brickset has not published a name yet"
              }
              >${displayName(item)}</span
            >`,
          )}
          <span class="num"
            >${
              themeColour
                ? html`<span
                    class="key"
                    style="background:${themeColour}"
                    title=${item.theme}
                  ></span>`
                : nothing
            }${[item.set_number, price].filter(Boolean).join(" · ")}</span
          >
          <span class="when ${whenTone(item, now, focus)}"
            >${whenLabel(item, now, (iso) => this.date(iso), focus)}</span
          >
          <div class="foot">
            <span
              class=${
                item.owned ? "state own" : item.wanted ? "state want" : "state"
              }
              >${
                item.owned
                  ? item.qty_owned > 1
                    ? `Owned ×${item.qty_owned}`
                    : "Owned"
                  : item.wanted
                    ? "Wanted"
                    : ""
              }</span
            >
            <button
              class=${[
                "act",
                item.owned ? "on" : "",
                this.pending.has(item.set_number) ? "pending" : "",
              ].join(" ")}
              ?disabled=${this.pending.has(item.set_number)}
              title=${
                item.owned
                  ? "Remove from your collection"
                  : "Add to your collection"
              }
              aria-label=${
                item.owned
                  ? `Remove ${displayName(item)} from your collection`
                  : `Add ${displayName(item)} to your collection`
              }
              @click=${() => void this.toggleOwned(item)}
            >
              <ha-icon icon=${item.owned ? "mdi:check" : "mdi:plus"}></ha-icon>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /** The bricks standing in for cards that are not there, and a line on why. */
  protected filler(hint: string): TemplateResult {
    return html`<div class="filler">
      <lego-bricks></lego-bricks>
      <span class="hint">${hint}</span>
    </div>`;
  }

  /** The bricks after a short row of cards, in whatever room the cards leave. */
  protected tail(hint = ""): TemplateResult {
    return html`<div class="filler tail">
      <lego-bricks></lego-bricks>
      ${hint ? html`<span class="hint">${hint}</span>` : nothing}
    </div>`;
  }
}
