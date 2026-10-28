import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import {
  INVALIDATED,
  invalidate,
  loadDashboard,
  reloadOnReconnect,
} from "./api";
import { ROW_META, define } from "./base";
import {
  ROW_SPANS,
  errorText,
  releaseFilter,
  spanLabel,
  spanProblem,
} from "./format";
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
  /** Whether the card opens folded to its header. */
  collapsed?: boolean;
  /** For the value card: "value" or "pieces". */
  measure?: "value" | "pieces";
  /** For the releases card: which of the release rows it is. */
  row?: ReleaseRow;
  /** For the releases card: what it opens on, in place of the user's defaults. */
  scope?: ReleaseFilter["scope"];
  themes?: string[];
  span?: ReleaseFilter["span"];
}

/** One field of Home Assistant's built-in card editor form. */
interface FormField {
  name: keyof CardConfig;
  selector: Record<string, unknown>;
}

/** What getConfigForm hands Home Assistant, which draws the visual editor from it. */
interface ConfigForm {
  schema: FormField[];
  computeLabel: (field: FormField) => string | undefined;
  computeHelper: (field: FormField) => string | undefined;
  assertConfig: (config: CardConfig) => void;
}

const LABELS: Partial<Record<keyof CardConfig, string>> = {
  account: "Brickset account",
  collapsed: "Start folded",
  measure: "Show",
  row: "Row",
  scope: "Themes",
  themes: "Only these themes",
  span: "Span",
};

const HELPERS: Partial<Record<keyof CardConfig, string>> = {
  account: "Leave empty to show the account you opened last in the LEGO panel.",
  collapsed: "Show only the card's header until it is opened.",
  scope: "Everything needs Follow releases across all themes in the options.",
  themes: "Narrows My themes to some of the themes you follow.",
  span: "Leave empty for the row's own default.",
};

const ACCOUNT: FormField = {
  name: "account",
  selector: { config_entry: { integration: "lego" } },
};
const COLLAPSED: FormField = { name: "collapsed", selector: { boolean: {} } };

function form(
  schema: FormField[],
  assertConfig: (config: CardConfig) => void = () => {},
): ConfigForm {
  return {
    schema,
    computeLabel: (field) => LABELS[field.name],
    computeHelper: (field) => HELPERS[field.name],
    assertConfig,
  };
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
    return this.config?.collapsed ? 1 : 6;
  }

  /** A row reads best across the whole width of a sections view. */
  public getGridOptions(): { columns: number; min_columns: number } {
    return { columns: 12, min_columns: 6 };
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
    if (this.hass) reloadOnReconnect(this.hass);
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
  public static getStubConfig(): Omit<CardConfig, "type"> {
    return {};
  }

  public static getConfigForm(): ConfigForm {
    return form([ACCOUNT, COLLAPSED]);
  }

  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-collection-row
      bare
      .collapsed=${this.config?.collapsed ?? false}
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-collection-row>`;
  }
}

class LegoWishlistCard extends LegoCard {
  public static getStubConfig(): Omit<CardConfig, "type"> {
    return {};
  }

  public static getConfigForm(): ConfigForm {
    return form([ACCOUNT, COLLAPSED]);
  }

  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-wishlist-row
      bare
      .collapsed=${this.config?.collapsed ?? false}
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-wishlist-row>`;
  }
}

class LegoValueCard extends LegoCard {
  public static getStubConfig(): Omit<CardConfig, "type"> {
    return { measure: "value" };
  }

  public static getConfigForm(): ConfigForm {
    return form([
      ACCOUNT,
      {
        name: "measure",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "value", label: "Collection value" },
              { value: "pieces", label: "Pieces" },
            ],
          },
        },
      },
      COLLAPSED,
    ]);
  }

  protected row(dash: Dashboard): TemplateResult {
    return html`<lego-value-row
      bare
      .kind=${this.config?.measure === "pieces" ? "pieces" : "value"}
      .collapsed=${this.config?.collapsed ?? false}
      .hass=${this.hass}
      .dash=${dash}
      .entryId=${dash.entry_id}
    ></lego-value-row>`;
  }
}

class LegoReleasesCard extends LegoCard {
  public static getStubConfig(): Omit<CardConfig, "type"> {
    return { row: "releases" };
  }

  public static getConfigForm(): ConfigForm {
    const spans = [...new Set(Object.values(ROW_SPANS).flat())];
    return form(
      [
        ACCOUNT,
        {
          name: "row",
          selector: {
            select: {
              mode: "dropdown",
              options: (Object.keys(ROW_SPANS) as ReleaseRow[]).map((row) => ({
                value: row,
                label: ROW_META[row].title,
              })),
            },
          },
        },
        {
          name: "scope",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "mine", label: "My themes" },
                { value: "all", label: "Everything" },
              ],
            },
          },
        },
        {
          name: "themes",
          selector: {
            select: { multiple: true, custom_value: true, options: [] },
          },
        },
        {
          name: "span",
          selector: {
            select: {
              mode: "dropdown",
              options: spans.map((span) => ({
                value: span,
                label: spanLabel(span),
              })),
            },
          },
        },
        COLLAPSED,
      ],
      (config) => {
        const problem = spanProblem(config.row ?? "releases", config.span);
        if (problem) throw new Error(problem);
      },
    );
  }

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
      .collapsed=${this.config?.collapsed ?? false}
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

const DOCS = "https://github.com/PineappleEmperor/ha-lego#dashboard-cards";

declare global {
  interface Window {
    customCards?: {
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }[];
  }
}

for (const [type, element, name, description] of CARDS) {
  define(type, element);
  window.customCards = window.customCards ?? [];
  if (!window.customCards.some((card) => card.type === type)) {
    // The picker draws a live preview: the card costs no Brickset calls to show.
    window.customCards.push({
      type,
      name,
      description,
      preview: true,
      documentationURL: DOCS,
    });
  }
}
