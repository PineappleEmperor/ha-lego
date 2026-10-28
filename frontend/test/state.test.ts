import { describe, expect, it } from "vitest";

import {
  INVALIDATED,
  PICTURE_RETRY_MS,
  picturesExpired,
  reloadOnReconnect,
} from "../src/api";
import { pictureSources, pictureUrl } from "../src/format";
import {
  chipLayout,
  chipPress,
  foldAll,
  isSearch,
  markedOwned,
  meterFill,
  pressMyThemes,
} from "../src/state";
import type { Hass, Quota } from "../src/types";

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

describe("set pictures", () => {
  const local = "/api/lego/image/small/10294-1.jpg?authSig=abc";
  const large = "/api/lego/image/large/10294-1.jpg?authSig=def";
  const remote = "https://images.brickset.com/sets/small/10294-1.jpg";

  it("takes Home Assistant's copy, and refuses other paths and schemes", () => {
    expect(pictureUrl(local)).toBe(local);
    expect(pictureUrl("/api/states")).toBeNull();
    expect(pictureUrl("javascript:alert(1)")).toBeNull();
    expect(pictureUrl(remote)).toBe(remote);
  });

  it("falls back to Brickset's own copy", () => {
    expect(
      pictureSources({ image: local, image_large: null, image_remote: remote }),
    ).toEqual({ src: local, srcset: null, fallback: remote });
  });

  it("offers the large copy only to a screen with the pixels for it", () => {
    expect(
      pictureSources({ image: local, image_large: large, image_remote: remote })
        .srcset,
    ).toBe(`${local} 1x, ${large} 2x`);
  });

  it("draws a card from an older reply with only Brickset's address", () => {
    expect(pictureSources({ image: remote })).toEqual({
      src: remote,
      srcset: null,
      fallback: null,
    });
  });
});

describe("renewing picture addresses", () => {
  // The tests run without a page; the reload signal only needs something to fire on.
  (globalThis as { window?: EventTarget }).window ??= new EventTarget();

  it("asks for new ones at most once a minute, however many pictures fail", () => {
    let reloads = 0;
    const count = () => reloads++;
    window.addEventListener(INVALIDATED, count);
    try {
      const start = 1_000_000_000;
      expect(picturesExpired(start)).toBe(true);
      expect(picturesExpired(start + 1_000)).toBe(false);
      expect(picturesExpired(start + PICTURE_RETRY_MS)).toBe(true);
      expect(reloads).toBe(2);
    } finally {
      window.removeEventListener(INVALIDATED, count);
    }
  });

  it("reloads once when the connection comes back after a restart", () => {
    const listeners: (() => void)[] = [];
    const connection = {
      addEventListener: (_event: "ready", listener: () => void) =>
        listeners.push(listener),
    };
    const hass = { connection } as unknown as Hass;
    reloadOnReconnect(hass);
    reloadOnReconnect(hass);
    expect(listeners).toHaveLength(1);
  });
});
