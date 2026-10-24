import {
  css,
  html,
  nothing,
  svg,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import { LegoRow, define } from "../base";
import { count, statisticPoints, topThemes, type ThemeSlice } from "../format";
import { slotColour, themeSlots } from "../palette";
import type { Point } from "../types";

/** How far back the trend reaches. */
const HISTORY_DAYS = 365;
/** Set numbers a tooltip lists before it counts the rest. */
const TOOLTIP_SETS = 12;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** A sliver of surface between slices, so neighbours never touch. */
const GAP = 1.5;

/**
 * What the collection is worth, or how many pieces it holds, by theme: a donut
 * for the share, ranked bars for the comparison, and the trend folded beneath.
 */
export class LegoValueRow extends LegoRow {
  @property() public kind: "value" | "pieces" = "value";

  @state() private hover = "";
  @state() private trendOpen = false;
  @state() private history?: Point[] | "loading" | "none";
  @state() private hoverPoint: number | null = null;

  private historyFor = "";

  protected get row(): string {
    return this.kind;
  }

  static override styles = [
    LegoRow.styles,
    css`
      .chart {
        align-items: center;
        display: grid;
        gap: var(--ha-space-8, 32px);
        grid-template-columns: 240px minmax(0, 1fr);
        padding: var(--ha-space-2, 8px) 0 var(--ha-space-1, 4px);
      }
      @media (max-width: 640px) {
        .chart {
          grid-template-columns: minmax(0, 1fr);
          justify-items: center;
        }
      }
      .donut {
        height: 240px;
        position: relative;
        width: 240px;
      }
      .donut svg {
        display: block;
        transform: rotate(-90deg);
      }
      .donut circle {
        transition:
          opacity var(--ha-animation-duration-fast, 150ms),
          stroke-width var(--ha-animation-duration-fast, 150ms);
      }
      .centre {
        align-items: center;
        display: flex;
        flex-direction: column;
        inset: 0;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        text-align: center;
      }
      .centre .n {
        font-size: var(--ha-font-size-3xl, 28px);
        font-variant-numeric: tabular-nums;
        font-weight: var(--ha-font-weight-bold, 700);
        line-height: var(--ha-line-height-condensed, 1.2);
      }
      .centre .l {
        color: var(--lego-text-2);
        font-size: var(--ha-font-size-s, 12px);
        margin-top: var(--ha-space-1, 4px);
        max-width: 120px;
      }
      .bars {
        display: grid;
        gap: var(--ha-space-1, 4px);
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .bar-row {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        border-radius: var(--ha-border-radius-sm, 4px);
        color: inherit;
        display: grid;
        font: inherit;
        gap: var(--ha-space-3, 12px);
        grid-template-columns: minmax(80px, 30%) 1fr;
        min-height: 32px;
        padding: 0 var(--ha-space-1, 4px);
        position: relative;
        text-align: left;
        width: 100%;
      }
      .bar-row.on {
        background: var(--lego-ground);
      }
      .label {
        align-items: center;
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .label .key {
        border-radius: 2px;
        box-shadow: none;
      }
      .track {
        align-items: center;
        display: flex;
        gap: var(--ha-space-2, 8px);
        min-width: 0;
      }
      .bar {
        border-radius: 0 var(--ha-border-radius-sm, 4px)
          var(--ha-border-radius-sm, 4px) 0;
        flex: none;
        height: 16px;
        max-width: calc(100% - 72px);
        transition: opacity var(--ha-animation-duration-fast, 150ms);
      }
      .faded {
        opacity: 0.35;
      }
      .amount {
        font-size: var(--ha-font-size-s, 12px);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .tip {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-md, 8px);
        box-shadow: 0 4px 16px rgb(0 0 0 / 0.14);
        font-size: var(--ha-font-size-s, 12px);
        left: 30%;
        line-height: var(--ha-line-height-normal, 1.6);
        max-width: 320px;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
        position: absolute;
        top: calc(100% + 2px);
        z-index: 3;
      }
      .tip b {
        display: block;
        font-size: var(--ha-font-size-m, 14px);
      }
      .tip .numbers {
        display: block;
        font-variant-numeric: tabular-nums;
        margin-top: var(--ha-space-1, 4px);
      }
      .footnote {
        color: var(--lego-text-2);
        display: flex;
        flex-wrap: wrap;
        font-size: var(--ha-font-size-s, 12px);
        gap: var(--ha-space-2, 8px);
        justify-content: space-between;
        margin: var(--ha-space-3, 12px) 0 0;
      }
      .plot {
        height: 140px;
        margin-bottom: var(--ha-space-2, 8px);
        position: relative;
        touch-action: pan-y;
      }
      .plot svg {
        display: block;
        height: 100%;
        overflow: visible;
        width: 100%;
      }
      .plot .base {
        stroke: var(--lego-outline);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
      }
      .plot .wash {
        fill: var(--lego-primary);
        fill-opacity: 0.1;
      }
      .plot .trace {
        fill: none;
        stroke: var(--lego-primary);
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
      }
      .plot .cross {
        stroke: var(--lego-text-2);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
      }
      .plot .dot {
        background: var(--lego-primary);
        border-radius: 50%;
        box-shadow: 0 0 0 2px var(--lego-surface);
        height: 8px;
        position: absolute;
        transform: translate(-50%, -50%);
        width: 8px;
      }
      .plot .readout {
        background: var(--lego-surface);
        border: var(--lego-line) solid var(--lego-outline);
        border-radius: var(--ha-border-radius-sm, 4px);
        font-size: var(--ha-font-size-s, 12px);
        font-variant-numeric: tabular-nums;
        padding: 2px var(--ha-space-2, 8px);
        position: absolute;
        top: calc(-1 * var(--ha-space-2, 8px));
        transform: translate(-50%, -100%);
        white-space: nowrap;
      }
      .axis {
        color: var(--lego-text-2);
        display: flex;
        font-size: var(--ha-font-size-s, 12px);
        justify-content: space-between;
        margin-bottom: var(--ha-space-2, 8px);
      }
    `,
  ];

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const key = `${this.dash?.entry_id}:${this.kind}`;
    // Statistics belong to an account and a measure; a reload of the same keeps
    // them, so an ownership toggle does not refetch a year.
    if (this.dash && key !== this.historyFor) {
      this.historyFor = key;
      this.history = undefined;
    }
  }

  protected override updated(): void {
    if (this.trendOpen && !this.collapsed && this.history === undefined) {
      void this.loadHistory();
    }
  }

  private format(value: number): string {
    return this.kind === "value"
      ? this.money(value)
      : this.num(Math.round(value));
  }

  protected subtitle(): string {
    const stats = this.dash?.stats;
    if (!stats) return "";
    return this.kind === "value"
      ? `${this.money(stats.value)} at LEGO.com RRP`
      : count(stats.pieces_owned, "piece", "pieces");
  }

  protected body(): TemplateResult {
    const stats = this.dash?.stats;
    if (!stats) return html`<p class="muted">Loading…</p>`;
    const slices = topThemes(this.dash?.by_theme ?? [], this.kind);
    const total = this.kind === "value" ? stats.value : stats.pieces_owned;
    if (!slices.length) {
      return html`<p class="muted">
        Nothing owned with a published figure yet.
      </p>`;
    }
    const slots = themeSlots(
      slices.filter((s) => !s.other).map((s) => s.theme),
    );
    const colour = (slice: ThemeSlice) =>
      slotColour(slice.other ? "other" : slots.get(slice.theme));
    return html`
      <div class="chart">
        ${this.donut(slices, total, colour)} ${this.bars(slices, total, colour)}
      </div>
      <p class="footnote">
        <span
          >${
            this.kind === "value" && stats.sets_missing_price
              ? `${count(stats.sets_missing_price, "set has", "sets have")} no published price and ${stats.sets_missing_price === 1 ? "is" : "are"} not counted.`
              : ""
          }</span
        >
        ${this.kind === "value" ? html`<span>At LEGO.com RRP</span>` : nothing}
      </p>
      ${this.trend()}
    `;
  }

  private donut(
    slices: ThemeSlice[],
    total: number,
    colour: (slice: ThemeSlice) => string,
  ): TemplateResult {
    const sum = slices.reduce((acc, s) => acc + s.amount, 0) || 1;
    let start = 0;
    const segments = slices.map((slice) => {
      const length = Math.max((slice.amount / sum) * CIRCUMFERENCE - GAP, 0.5);
      const segment = svg`<circle
        cx="100"
        cy="100"
        r=${RADIUS}
        fill="none"
        stroke=${colour(slice)}
        stroke-width=${this.hover === slice.theme ? 34 : 28}
        stroke-dasharray=${`${length} ${CIRCUMFERENCE - length}`}
        stroke-dashoffset=${-start}
        class=${this.hover && this.hover !== slice.theme ? "faded" : ""}
        @mouseenter=${() => (this.hover = slice.theme)}
        @mouseleave=${() => (this.hover = "")}
      ></circle>`;
      start += (slice.amount / sum) * CIRCUMFERENCE;
      return segment;
    });
    const hovered = slices.find((s) => s.theme === this.hover);
    return html`<div class="donut">
      <svg
        viewBox="0 0 200 200"
        width="240"
        height="240"
        role="img"
        aria-label=${`${this.subtitle()}, by theme`}
      >
        ${segments}
      </svg>
      <div class="centre">
        <span class="n">${this.format(hovered ? hovered.amount : total)}</span>
        <span class="l">${hovered ? hovered.theme : "in total"}</span>
      </div>
    </div>`;
  }

  /** Ranked bars, each labelled at its tip, so no reading depends on colour. */
  private bars(
    slices: ThemeSlice[],
    total: number,
    colour: (slice: ThemeSlice) => string,
  ): TemplateResult {
    const top = slices.reduce((m, s) => Math.max(m, s.amount), 0) || 1;
    return html`<ul class="bars">
      ${slices.map((slice, i) => {
        const on = this.hover === slice.theme;
        const faded = this.hover && !on;
        const shown = slice.setNumbers.slice(0, TOOLTIP_SETS);
        const more = slice.setNumbers.length - shown.length;
        return html`<li>
          <button
            class=${on ? "bar-row on" : "bar-row"}
            aria-describedby=${`tip-${i}`}
            @mouseenter=${() => (this.hover = slice.theme)}
            @mouseleave=${() => (this.hover = "")}
            @focus=${() => (this.hover = slice.theme)}
            @blur=${() => (this.hover = "")}
          >
            <span class="label"
              ><span class="key" style="background:${colour(slice)}"></span
              >${slice.theme}</span
            >
            <span class="track">
              <span
                class=${faded ? "bar faded" : "bar"}
                style="width:${Math.max(
                  (slice.amount / top) * 100,
                  1,
                )}%;background:${colour(slice)}"
              ></span>
              <span class="amount">${this.format(slice.amount)}</span>
            </span>
            ${
              on
                ? html`<span class="tip" role="tooltip" id=${`tip-${i}`}>
                    <b>${slice.theme} · ${this.format(slice.amount)}</b>
                    ${Math.round((slice.amount / (total || 1)) * 100)}% of the
                    collection, ${count(slice.sets, "set", "sets")}
                    ${
                      shown.length
                        ? html`<span class="numbers"
                            >${shown.join(", ")}${
                              more ? `, and ${more} more` : ""
                            }</span
                          >`
                        : nothing
                    }
                  </span>`
                : nothing
            }
          </button>
        </li>`;
      })}
    </ul>`;
  }

  private trend(): TemplateResult {
    const points = Array.isArray(this.history) ? this.history : null;
    return html`<div class="subsection">
      <button
        class="fold"
        aria-expanded=${this.trendOpen}
        @click=${() => (this.trendOpen = !this.trendOpen)}
      >
        <ha-icon
          class=${this.trendOpen ? "chev open" : "chev"}
          icon="mdi:chevron-right"
        ></ha-icon>
        <h3>Trend over a year</h3>
        ${
          points
            ? html`<span class="sub"
                >${this.format(points[0].v)} →
                ${this.format(points[points.length - 1].v)}</span
              >`
            : nothing
        }
      </button>
      ${this.trendOpen ? this.trendChart() : nothing}
    </div>`;
  }

  private async loadHistory(): Promise<void> {
    const id = this.dash?.history?.[this.kind];
    const key = this.historyFor;
    if (!id) {
      this.history = "none";
      return;
    }
    this.history = "loading";
    try {
      const res = await this.hass.callWS<
        Record<string, { start: number; state?: number; mean?: number }[]>
      >({
        type: "recorder/statistics_during_period",
        start_time: new Date(
          Date.now() - HISTORY_DAYS * 86_400_000,
        ).toISOString(),
        statistic_ids: [id],
        period: "week",
        types: this.kind === "value" ? ["state"] : ["mean"],
      });
      // An account switch mid-fetch must not draw this account's line on the next.
      if (key !== this.historyFor) return;
      const points = statisticPoints(res[id] ?? []);
      this.history = points.length >= 2 ? points : "none";
    } catch {
      if (key === this.historyFor) this.history = "none";
    }
  }

  /**
   * A single line over the last year, from the sensor's recorded weekly
   * statistics. The SVG stretches to the row's width, so the end marker and the
   * hover readout are HTML laid over it rather than text inside it.
   */
  private trendChart(): TemplateResult {
    const state = this.history;
    if (state === undefined || state === "loading") {
      return html`<p class="muted">Loading the trend…</p>`;
    }
    if (state === "none") {
      return html`<p class="muted">
        No history yet. Home Assistant records it weekly from the sensor, so a
        line appears after a couple of weeks.
      </p>`;
    }
    const points = state;
    const lo = Math.min(...points.map((p) => p.v));
    const hi = Math.max(...points.map((p) => p.v));
    const span = hi - lo || 1;
    const t0 = points[0].t;
    const tSpan = points[points.length - 1].t - t0 || 1;
    const x = (p: Point) => ((p.t - t0) / tSpan) * 100;
    // Headroom top and bottom, so the line never sits on the chart's edge.
    const y = (p: Point) => 90 - ((p.v - lo) / span) * 80;
    const line = points.map((p) => `${x(p)},${y(p)}`).join(" ");
    const last = points[points.length - 1];
    const hover =
      this.hoverPoint === null ? undefined : points[this.hoverPoint];
    const shown = hover ?? last;
    const day = (t: number) =>
      new Date(t).toLocaleDateString(this.hass?.locale?.language, {
        day: "numeric",
        month: "short",
      });
    return html`
      <div
        class="plot"
        @pointermove=${(ev: PointerEvent) => {
          const box = (ev.currentTarget as HTMLElement).getBoundingClientRect();
          const at = t0 + ((ev.clientX - box.left) / box.width) * tSpan;
          let index = 0;
          points.forEach((p, i) => {
            if (Math.abs(p.t - at) < Math.abs(points[index].t - at)) index = i;
          });
          this.hoverPoint = index;
        }}
        @pointerleave=${() => (this.hoverPoint = null)}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line class="base" x1="0" y1="100" x2="100" y2="100"></line>
          <polygon class="wash" points=${`0,100 ${line} 100,100`}></polygon>
          <polyline class="trace" points=${line}></polyline>
          ${
            hover
              ? svg`<line class="cross" x1=${x(hover)} y1="0" x2=${x(hover)} y2="100"></line>`
              : nothing
          }
        </svg>
        <span class="dot" style="left:${x(shown)}%;top:${y(shown)}%"></span>
        <span
          class="readout"
          style="left:${Math.min(Math.max(x(shown), 12), 88)}%"
          >${this.format(shown.v)} · ${day(shown.t)}</span
        >
      </div>
      <div class="axis">
        <span>${day(points[0].t)}</span><span>${day(last.t)}</span>
      </div>
    `;
  }
}

define("lego-value-row", LegoValueRow);
