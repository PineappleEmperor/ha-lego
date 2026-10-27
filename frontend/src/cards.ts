import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import { INVALIDATED, invalidate, loadDashboard } from "./api";
import { define } from "./base";
import { errorText, releaseFilter } from "./format";
import "./rows/collection";
import "./rows/releases";
import "./rows/value";
import "./rows/wishlist";
import { TOKENS } from "./styles";
import type { Dashboard, Hass, ReleaseFilter, ReleaseRow } from "./types";

interface CardConfig {
  type: string;
  /** A Brickset account's config entry id; the user's chosen account otherwise. */
  account?: string;
  /** For the value card: "value" or "pieces". */
  measure?: "value" | "pieces";
  /** For the releases card: which of the release rows it is. */
  row?: ReleaseRow;
  /** For the releases card: what it opens on, in place of the user's defaults. */
  scope?: ReleaseFilter["scope"];
  themes?: string[];
  span?: ReleaseFilter["span"];
}

/**
 * A dashboard card holding one of the panel's rows. It reads the same websocket
 * commands the panel does, so it costs no Brickset calls of its own.
 */
abstract class LegoCard extends LitElement {
  @property({ attribute: false }) public hass?: Hass;
  @state() protected config?: CardConfig;
  @state() protected dash?: Dashboard;
  @state() private error = "";

  /** The account last loaded; null until the first load, whose key may be "". */
  private loadedFor: string | null = null;

  static override styles = [
    TOKENS,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      ha-card {
        overflow: hidden;
      }
      .error {
        color: var(--ha-color-on-danger-normal, #b30532);
        padding: var(--ha-space-4, 16px);
      }
    `,
  ];

  public setConfig(config: CardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this.config = config;
    this.loadedFor = null;
  }

  public getCardSize(): number {
    return 6;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(INVALIDATED, this.reload);
  }

  public override disconnectedCallback(): void {
    window.removeEventListener(INVALIDATED, this.reload);
    super.disconnectedCallback();
  }

  private reload = (): void => {
    this.loadedFor = null;
    this.requestUpdate();
  };

  protected override updated(): void {
    const key = this.config?.account ?? "";
    if (this.hass && this.config && this.loadedFor !== key) {
      this.loadedFor = key;
      loadDashboard(this.hass, key)
        .then((dash) => {
          this.dash = dash;
          this.error = "";
        })
        .catch((err) => (this.error = errorText(err)));
    }
  }

  protected abstract row(dash: Dashboard): TemplateResult;

  protected override render(): TemplateResult {
    return html`<ha-card
      @lego-changed=${() => invalidate()}
      @lego-toggle=${(ev: Event) => ev.stopPropagation()}
    >
      ${
        this.error
          ? html`<div class="error">${this.error}</div>`
          : this.dash && this.hass
            ? this.row(this.dash)
            : nothing
      }
    </ha-card>`;
  }
}

class LegoCollectionCard extends LegoCard {
  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-collection-row
      bare
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-collection-row>`;
  }
}

class LegoWishlistCard extends LegoCard {
  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-wishlist-row
      bare
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-wishlist-row>`;
  }
}

class LegoValueCard extends LegoCard {
  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-value-row
      bare
      .kind=${this.config?.measure === "pieces" ? "pieces" : "value"}
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-value-row>`;
  }
}

class LegoReleasesCard extends LegoCard {
  protected row(dash: Dashboard): TemplateResult {
    const kind = this.config?.row ?? "releases";
    // A card's own scope, themes and span stand in for the user's defaults.
    const override: ReleaseFilter = {};
    if (this.config?.scope) override.scope = this.config.scope;
    if (this.config?.themes) override.themes = this.config.themes;
    if (this.config?.span) override.span = this.config.span;
    const card: Dashboard = {
      ...dash,
      release_filters: {
        ...dash.release_filters,
        [kind]: { ...releaseFilter(kind, dash), ...override },
      },
    };
    return html`<lego-releases-row
      bare
      .kind=${kind}
      .hass=${this.hass}
      .dash=${card}
      .entryId=${dash.entry_id}
    ></lego-releases-row>`;
  }
}

const CARDS: [string, CustomElementConstructor, string, string][] = [
  [
    "lego-collection-card",
    LegoCollectionCard,
    "LEGO collection",
    "Your Brickset collection's totals, with every set and a search.",
  ],
  [
    "lego-releases-card",
    LegoReleasesCard,
    "LEGO releases",
    "New and upcoming sets, across every theme or the ones you follow.",
  ],
  [
    "lego-wishlist-card",
    LegoWishlistCard,
    "LEGO wishlist",
    "The sets you want, soonest to retire first.",
  ],
  [
    "lego-value-card",
    LegoValueCard,
    "LEGO collection value",
    "What your collection is worth at LEGO.com RRP, by theme.",
  ],
];

declare global {
  interface Window {
    customCards?: { type: string; name: string; description: string }[];
  }
}

for (const [type, element, name, description] of CARDS) {
  define(type, element);
  window.customCards = window.customCards ?? [];
  if (!window.customCards.some((card) => card.type === type)) {
    window.customCards.push({ type, name, description });
  }
}
