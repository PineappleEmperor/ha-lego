import { describe, expect, it } from "vitest";

import {
  chipLayout,
  chipPress,
  foldAll,
  isSearch,
  markedOwned,
  meterFill,
  pressMyThemes,
} from "../src/state";
import type { Quota } from "../src/types";

describe("marking a set owned", () => {
  it("ticks a set that was not owned, as one copy", () => {
    expect(markedOwned({ owned: false, qty_owned: 0 })).toEqual({
      owned: true,
      qty_owned: 1,
    });
  });

  it("keeps the count of a set already held in several copies", () => {
    expect(markedOwned({ owned: false, qty_owned: 3 }).qty_owned).toBe(3);
  });

  it("clears the count when a set is unmarked", () => {
    expect(markedOwned({ owned: true, qty_owned: 2 })).toEqual({
      owned: false,
      qty_owned: 0,
    });
  });
});

describe("search box", () => {
  it("searches from two characters, ignoring spaces", () => {
    expect(isSearch("")).toBe(false);
    expect(isSearch(" 7 ")).toBe(false);
    expect(isSearch("75")).toBe(true);
    expect(isSearch("  x-wing")).toBe(true);
  });
});

describe("collapse all", () => {
  const rows = ["collection", "releases", "wishlist"];

  it("collapses every row while any is open", () => {
    const { anyOpen, next } = foldAll(rows, { collection: true });
    expect(anyOpen).toBe(true);
    expect(next).toEqual({ collection: true, releases: true, wishlist: true });
  });

  it("expands every row once all are folded", () => {
    const folded = { collection: true, releases: true, wishlist: true };
    const { anyOpen, next } = foldAll(rows, folded);
    expect(anyOpen).toBe(false);
    expect(next).toEqual({
      collection: false,
      releases: false,
      wishlist: false,
    });
  });

  it("leaves rows that are not on the page out", () => {
    expect(Object.keys(foldAll(["wishlist"], {}).next)).toEqual(["wishlist"]);
  });
});

describe("calls meter", () => {
  const quota = (over: Partial<Quota>): Quota => ({
    calls_today: 10,
    budget: 80,
    remaining: 70,
    refresh_cost: 2,
    resets_at: "2026-10-29T00:00:00+00:00",
    ...over,
  });

  it("fills by the share of today's budget used, never past full", () => {
    expect(meterFill(quota({ calls_today: 20 })).share).toBe(0.25);
    expect(meterFill(quota({ calls_today: 95 })).share).toBe(1);
  });

  it("does not divide by a zero budget", () => {
    expect(meterFill(quota({ budget: 0, calls_today: 0 })).share).toBe(0);
  });

  it("warns once fewer calls are left than three updates spend", () => {
    expect(meterFill(quota({ remaining: 6 })).tight).toBe(false);
    expect(meterFill(quota({ remaining: 5 })).tight).toBe(true);
  });
});

describe("theme chips", () => {
  it("shows the themes and Edit themes only while My themes is unfolded", () => {
    expect(
      chipLayout({ mine: true, open: false, wiggling: false, followed: 3 }),
    ).toEqual({ themes: false, trailing: "none" });
    expect(
      chipLayout({ mine: true, open: true, wiggling: false, followed: 3 }),
    ).toEqual({ themes: true, trailing: "edit" });
  });

  it("hides the themes while Everything is picked", () => {
    expect(
      chipLayout({ mine: false, open: true, wiggling: false, followed: 3 })
        .themes,
    ).toBe(false);
  });

  it("offers a first theme to follow when none is followed", () => {
    expect(
      chipLayout({ mine: false, open: false, wiggling: false, followed: 0 })
        .trailing,
    ).toBe("edit");
  });

  it("puts Done after the chips while they wiggle", () => {
    expect(
      chipLayout({ mine: true, open: true, wiggling: true, followed: 3 })
        .trailing,
    ).toBe("done");
  });

  it("picks My themes folded, then folds and unfolds it", () => {
    expect(pressMyThemes(false, true)).toEqual({ open: false, pick: true });
    expect(pressMyThemes(true, false)).toEqual({ open: true, pick: false });
    expect(pressMyThemes(true, true)).toEqual({ open: false, pick: false });
  });

  it("spends the press that ended a hold rather than picking the theme", () => {
    expect(chipPress(true, true)).toBe("spent");
    expect(chipPress(false, true)).toBe("ignored");
    expect(chipPress(false, false)).toBe("pick");
  });
});
