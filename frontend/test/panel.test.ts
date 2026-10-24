import { describe, expect, it } from "vitest";

import {
  monthsFrom,
  moveRow,
  releaseFilter,
  rowsForMode,
  stackOffsets,
  stackTimeline,
  toggleTheme,
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
  it("opens the combined row on Everything when all themes are followed", () => {
    expect(releaseFilter("releases", dash({}))).toEqual({
      scope: "all",
      themes: [],
      span: "past3",
    });
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
      span: "past3",
    });
  });

  it("keeps the fixed rows on their own scope and span", () => {
    expect(releaseFilter("upcoming", dash({}))).toEqual({
      scope: "all",
      themes: [],
      span: "next1",
    });
    expect(releaseFilter("recent", dash({})).span).toBe("past1");
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
      (theme) => ({ date: "2026-08-01", theme }),
    );
    points.push({ date: "2026-10-01", theme: "Technic" });
    const stacks = stackTimeline(points, start);
    expect(stacks).toHaveLength(2);
    expect(stacks[0].themes).toHaveLength(4);
    expect(stacks[0].extra).toBe(1);
    expect(stacks[1].themes).toEqual(["Technic"]);
  });

  it("leaves out dates before January and past the end of next March", () => {
    const stacks = stackTimeline(
      [
        { date: "2025-12-20", theme: "Technic" },
        { date: "2027-04-02", theme: "Technic" },
      ],
      start,
    );
    expect(stacks).toEqual([]);
  });

  it("centres a stack on the line, rather than growing it upwards", () => {
    expect(stackOffsets(1)).toEqual([0]);
    expect(stackOffsets(3)).toEqual([-5, 0, 5]);
    const four = stackOffsets(4);
    expect(four[0]).toBe(-four[3]);
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
});
