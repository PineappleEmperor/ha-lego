import { LitElement, css, html, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";

import { fitBricks } from "./format";
import { RAINBOW } from "./generated/brand";
import { drawSvg } from "./svg";

/** The drawn bricks' widths at the size the panel shows them. */
const SCALE = 0.54;
const WIDTHS = RAINBOW.map((brick) => Math.round(brick.width * SCALE));

/**
 * The rainbow of real bricks, in whatever width it is given: as many as fit, the
 * gaps opening up into the spare room, wider beside the bigger pieces. It
 * measures itself, so it can fill an empty row or the end of a short one.
 */
export class LegoBricks extends LitElement {
  @state() private width = 0;

  private observer?: ResizeObserver;

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      overflow: hidden;
    }
    .bricks {
      align-items: flex-end;
      display: flex;
    }
    .bricks div {
      flex: none;
    }
    svg {
      display: block;
      height: auto;
      width: 100%;
    }
  `;

  public override connectedCallback(): void {
    super.connectedCallback();
    this.observer = new ResizeObserver(([entry]) => {
      this.width = Math.floor(entry.contentRect.width);
    });
    this.observer.observe(this);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  protected override render(): TemplateResult {
    const { count, gaps } = fitBricks(WIDTHS, this.width);
    return html`<div class="bricks" aria-hidden="true">
      ${RAINBOW.slice(0, count).map(
        (brick, i) =>
          html`<div style="width:${WIDTHS[i]}px;margin-right:${gaps[i] ?? 0}px">
            ${drawSvg(brick.svg)}
          </div>`,
      )}
    </div>`;
  }
}

// Registered here rather than through base.ts, which imports this module.
if (!customElements.get("lego-bricks")) {
  customElements.define("lego-bricks", LegoBricks);
}

declare global {
  interface HTMLElementTagNameMap {
    "lego-bricks": LegoBricks;
  }
}
