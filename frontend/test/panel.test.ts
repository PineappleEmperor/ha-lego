import { describe, expect, it } from "vitest";

import {
  ROW_SPANS,
  budgetTitle,
  fitBricks,
  monthsFrom,
  moveRow,
  releaseFilter,
  rowsForMode,
  spanLabel,
  spanProblem,
  stackOffsets,
  stackTimeline,
  timelineGap,
  timelineView,
  toggleTheme,
  webUrl,
} from "../src/format";
import { LOGO, RAINBOW } from "../src/generated/brand";
import { slotColour, themeSlots } from "../src/palette";
import type { Dashboard } from "../src/types";
import type { SvgNode } from "../src/svg";

const dash = (
  over: Partial<
    Pick<Dashboard, "release_filters" | "release_status" | "followed">
  >,
) => ({
  release_filters: {},
  release_status: { all: "ready" as const, mine: "ready" as const },
  followed: ["Botanicals", "Technic"],
  ...over,
});

describe("theme colours", () => {
  it("gives a theme with a known colour its own hue, wherever it ranks", () => {
    const slots = themeSlots(["Star Wars", "Ninjago", "Botanicals"]);
    expect(slots.get("Botanicals")).toBe(6);
    expect(slots.get("Star Wars")).toBe(1);
  });

  it("gives other themes the free slots in a fixed order", () => {
    const slots = themeSlots(["Ninjago", "Friends", "Technic"]);
    expect(slots.get("Ninjago")).toBe(2);
    expect(slots.get("Friends")).toBe(5);
    expect(slots.get("Technic")).toBe(7);
  });

  it("never repeats a slot, and past eight themes falls back to Other", () => {
    const themes = Array.from({ length: 10 }, (_, i) => `Theme ${i}`);
    const slots = themeSlots(themes);
    const used = [...slots.values()].filter((s) => s !== "other");
    expect(new Set(used).size).toBe(used.length);
    expect(slots.get("Theme 9")).toBe("other");
    expect(slotColour("other")).toBe("var(--lego-series-other)");
  });
});

describe("release filters", () => {
  it("opens the combined row on your themes, three months either side", () => {
    expect(releaseFilter("releases", dash({}))).toEqual({
      scope: "mine",
      themes: [],
      span: "around",
    });
  });

  it("opens on Everything only when no theme is followed", () => {
    expect(releaseFilter("releases", dash({ followed: [] })).scope).toBe("all");
  });

  it("names the year span by the year, and orders the spans past to future", () => {
    expect(spanLabel("year", new Date(2026, 9, 28))).toBe("2026");
    expect(spanLabel("year", new Date(2027, 0, 2))).toBe("2027");
    expect(ROW_SPANS.releases.map((span) => spanLabel(span))).toEqual([
      "Past 3 months",
      "Now",
      String(new Date().getFullYear()),
      "Unreleased",
    ]);
  });

  it("refuses a card a span its row does not offer", () => {
    expect(spanProblem("releases", "around")).toBe("");
    expect(spanProblem("upcoming", undefined)).toBe("");
    expect(spanProblem("recent", "coming")).toBe(
      "This row offers Past 3 months, not Unreleased.",
    );
  });

  it("opens on the span picked last time", () => {
    const filter = releaseFilter(
      "releases",
      dash({ release_filters: { releases: { span: "coming" } } }),
    );
    expect(filter.span).toBe("coming");
  });

  it("falls back to the followed themes when releases are not followed", () => {
    const filter = releaseFilter(
      "releases",
      dash({
        release_status: { all: null, mine: "ready" },
        release_filters: { releases: { scope: "all" } },
      }),
    );
    expect(filter.scope).toBe("mine");
  });

  it("drops a saved theme nobody follows any more, and a span the row lacks", () => {
    const filter = releaseFilter(
      "themes",
      dash({
        release_filters: {
          themes: { themes: ["Ninjago", "Technic"], span: "next1" },
        },
      }),
    );
    expect(filter).toEqual({
      scope: "mine",
      themes: ["Technic"],
      span: "around",
    });
  });

  it("keeps the fixed rows on their own scope and span", () => {
    expect(releaseFilter("upcoming", dash({}))).toEqual({
      scope: "all",
      themes: [],
      span: "coming",
    });
    expect(releaseFilter("recent", dash({})).span).toBe("past3");
  });

  it("returns to every theme once all or none are picked", () => {
    const followed = ["Botanicals", "Technic"];
    expect(toggleTheme([], "Technic", followed)).toEqual(["Technic"]);
    expect(toggleTheme(["Technic"], "Botanicals", followed)).toEqual([]);
    expect(toggleTheme(["Technic"], "Technic", followed)).toEqual([]);
  });
});

describe("timeline", () => {
  const start = new Date(2026, 0, 1);

  it("places a date in months from 1 January, part months by day", () => {
    expect(monthsFrom(start, "2026-01-01")).toBe(0);
    expect(monthsFrom(start, "2027-01-01")).toBe(12);
    expect(monthsFrom(start, "2026-03-16")).toBeCloseTo(2 + 15 / 31);
  });

  it("stacks sets that would overlap and counts past four", () => {
    const points = ["Botanicals", "Technic", "Icons", "City", "Ninjago"].map(
      (theme, i) => ({
        date: "2026-08-01",
        theme,
        number: `${i}-1`,
        name: theme,
      }),
    );
    points.push({
      date: "2026-10-01",
      theme: "Technic",
      number: "9-1",
      name: "Later",
    });
    const stacks = stackTimeline(points, start);
    expect(stacks).toHaveLength(2);
    // Five sets fill four places: three bricks under a count of the other two.
    expect(stacks[0].themes).toHaveLength(3);
    expect(stacks[0].extra).toBe(2);
    // The hover names every set, the one past the cap included.
    expect(stacks[0].points.map((point) => point.name)).toEqual([
      "Botanicals",
      "Technic",
      "Icons",
      "City",
      "Ninjago",
    ]);
    expect(stacks[1].themes).toEqual(["Technic"]);
  });

  it("draws four sets as four bricks, with no count", () => {
    const points = ["Botanicals", "Technic", "Icons", "City"].map(
      (theme, i) => ({
        date: "2026-08-01",
        theme,
        number: `${i}-1`,
        name: theme,
      }),
    );
    const [stack] = stackTimeline(points, start);
    expect(stack.themes).toHaveLength(4);
    expect(stack.extra).toBe(0);
  });

  it("keeps stacks a set number of pixels apart, however wide the row", () => {
    // 15 months across 1500 pixels is 100 a month, so 20 pixels is a fifth.
    expect(timelineGap(1500, 15, 20)).toBeCloseTo(0.2);
    expect(timelineGap(750, 15, 20)).toBeCloseTo(0.4);
    // Before the row is measured, the old fixed gap.
    expect(timelineGap(0, 15, 20)).toBe(0.15);
  });

  it("leaves out dates before January and past the end of next March", () => {
    const stacks = stackTimeline(
      [
        { date: "2025-12-20", theme: "Technic", number: "1-1", name: "Early" },
        { date: "2027-04-02", theme: "Technic", number: "2-1", name: "Late" },
      ],
      start,
    );
    expect(stacks).toEqual([]);
  });

  it("shows a wide screen the whole year and a phone only the span", () => {
    expect(timelineView(9, 10, false)).toEqual({ from: 0, to: 15, width: 1 });
    // A month fits on a phone with room either side, so it does not scroll.
    const month = timelineView(9, 10, true);
    expect(month.width).toBe(1);
    expect(month.to - month.from).toBeGreaterThanOrEqual(2);
    // The whole year does not, so it scrolls, at a phone's three months a screen.
    const year = timelineView(0, 12, true);
    expect(year.width).toBeCloseTo((12.25 - 0) / 3);
    expect(year.from).toBe(0);
  });

  it("centres a stack on the line, rather than growing it upwards", () => {
    expect(stackOffsets(1)).toEqual([0]);
    expect(stackOffsets(3)).toEqual([-5, 0, 5]);
    const four = stackOffsets(4);
    expect(four[0]).toBe(-four[3]);
  });
});

describe("budget meter", () => {
  it("says where the calls between the budget and Brickset's 100 go", () => {
    expect(budgetTitle(50, 80, "01:00")).toBe(
      "50 of today's 80 calls used. The other 20 of the 100 Brickset allows each API key a day are left unused, for anything else on your key. The count starts again at 01:00.",
    );
  });

  it("leaves the gap out when the budget is the whole allowance", () => {
    expect(budgetTitle(12, 100, "01:00")).not.toContain("left unused");
  });
});

describe("row order", () => {
  const rows = [
    "collection",
    "releases",
    "recent",
    "upcoming",
    "themes",
    "wishlist",
  ];

  it("shows the combined row or the three split ones, never both", () => {
    expect(rowsForMode(rows, "combined")).toEqual([
      "collection",
      "releases",
      "wishlist",
    ]);
    expect(rowsForMode(rows, "separate")).toEqual([
      "collection",
      "recent",
      "upcoming",
      "themes",
      "wishlist",
    ]);
  });

  it("moves past the rows a layout leaves out", () => {
    const shown = rowsForMode(rows, "combined");
    const moved = moveRow(rows, shown, "wishlist", -1);
    expect(rowsForMode(moved, "combined")).toEqual([
      "collection",
      "wishlist",
      "releases",
    ]);
    expect(moved).toHaveLength(rows.length);
  });

  it("stays put at either end", () => {
    expect(moveRow(rows, rows, "collection", -1)).toBe(rows);
    expect(moveRow(rows, rows, "wishlist", 1)).toBe(rows);
  });
});

describe("generated drawings", () => {
  const ALLOWED = new Set([
    "svg",
    "g",
    "polygon",
    "path",
    "ellipse",
    "circle",
    "line",
  ]);
  const walk = (node: SvgNode): SvgNode[] => [
    node,
    ...(node.children ?? []).flatMap(walk),
  ];

  it("hold only the elements the renderer draws, and no event handlers", () => {
    for (const root of [LOGO, ...RAINBOW.map((brick) => brick.svg)]) {
      for (const node of walk(root)) {
        expect(ALLOWED.has(node.tag)).toBe(true);
        expect(
          Object.keys(node.attrs).some((key) => key.startsWith("on")),
        ).toBe(false);
      }
    }
  });

  it("draw the logo in the theme's primary colour", () => {
    const styles = walk(LOGO)
      .map((node) => node.attrs.style ?? "")
      .join(" ");
    expect(styles).toContain("var(--primary-color");
  });

  it("are real parts, lengths never falling", () => {
    expect(RAINBOW.map((brick) => brick.part)).toEqual([
      "3005",
      "3004",
      "3010",
      "3001",
      "3009",
      "2456",
      "3008",
      "3007",
    ]);
    const lengths = RAINBOW.map((brick) => Number(brick.size.split("x")[1]));
    expect([...lengths].sort((a, b) => a - b)).toEqual(lengths);
  });

  const widths = RAINBOW.map((brick) => Math.round(brick.width * 0.54));
  const total = (fit: { count: number; gaps: number[] }) =>
    widths.slice(0, fit.count).reduce((sum, w) => sum + w, 0) +
    fit.gaps.reduce((sum, g) => sum + g, 0);

  it("show only the bricks that fit, never spilling past the width", () => {
    const phone = fitBricks(widths, 320);
    expect(phone.count).toBeGreaterThan(1);
    expect(phone.count).toBeLessThan(widths.length);
    expect(total(phone)).toBeLessThanOrEqual(320);
    expect(fitBricks(widths, 0)).toEqual({ count: 0, gaps: [] });
  });

  it("share the spare room, the bigger pieces' gaps widest", () => {
    const fit = fitBricks(widths, 700);
    expect(fit.count).toBe(widths.length);
    expect([...fit.gaps].sort((a, b) => a - b)).toEqual(fit.gaps);
    expect(total(fit)).toBeCloseTo(700, 0);
  });

  it("stop widening the gaps once the bricks would look scattered", () => {
    const fit = fitBricks(widths, 4000);
    expect(total(fit)).toBeLessThan(4000);
    const mean = widths.reduce((sum, w) => sum + w, 0) / widths.length;
    expect(fit.gaps[0]).toBeLessThanOrEqual(
      ((12 * (widths[0] + widths[1])) / 2 / mean) * 10 + 0.1,
    );
    // A desktop row is filled.
    expect(total(fitBricks(widths, 1300))).toBeCloseTo(1300, 0);
  });
});

describe("links and pictures from Brickset's data", () => {
  it("keeps web addresses", () => {
    expect(webUrl("https://brickset.com/sets/10497-1")).toBe(
      "https://brickset.com/sets/10497-1",
    );
    expect(webUrl("http://images.brickset.com/sets/10497-1.jpg")).toBe(
      "http://images.brickset.com/sets/10497-1.jpg",
    );
  });

  it("drops anything that could run or embed instead", () => {
    expect(webUrl("javascript:alert(1)")).toBeNull();
    expect(webUrl(" JavaScript:alert(1)")).toBeNull();
    expect(webUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(webUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("drops what is missing or not an address at all", () => {
    expect(webUrl(null)).toBeNull();
    expect(webUrl(undefined)).toBeNull();
    expect(webUrl("")).toBeNull();
    expect(webUrl("not a url")).toBeNull();
  });
});
