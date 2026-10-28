// The decisions the rows make, kept apart from the drawing so a test can reach
// them without a page to render into.

import type { Dashboard, LegoSet, Quota } from "./types";

/** A set once Brickset has taken the Owned press, before the reload lands. */
export function markedOwned(
  item: Pick<LegoSet, "owned" | "qty_owned">,
): Pick<LegoSet, "owned" | "qty_owned"> {
  const owned = !item.owned;
  return { owned, qty_owned: owned ? Math.max(item.qty_owned, 1) : 0 };
}

/** The search results Brickset has not been asked about, which one call can fill. */
export function partialNumbers(
  items: Pick<LegoSet, "set_number" | "partial">[],
): string[] {
  return items.filter((item) => item.partial).map((item) => item.set_number);
}

/**
 * Whether the owned grid may keep showing while a fresh copy loads: yes for the
 * same account, so a write does not empty the page under the reader; no for another
 * account, whose sets must not be shown as this one's.
 */
export function keepsOwnedList(
  loadedFor: Pick<Dashboard, "entry_id"> | undefined,
  next: Pick<Dashboard, "entry_id"> | undefined,
): boolean {
  return !!loadedFor && !!next && loadedFor.entry_id === next.entry_id;
}

/** Whether the search box holds a query rather than a stray letter. */
export function isSearch(query: string): boolean {
  return query.trim().length >= 2;
}

/** Collapse all when any row is open, else expand all: the button and its effect. */
export function foldAll(
  visible: string[],
  folded: Record<string, boolean>,
): { anyOpen: boolean; next: Record<string, boolean> } {
  const anyOpen = visible.some((row) => !folded[row]);
  return {
    anyOpen,
    next: Object.fromEntries(visible.map((row) => [row, anyOpen])),
  };
}

/** How full the calls meter is, and whether it warns. */
export function meterFill(quota: Quota): { share: number; tight: boolean } {
  return {
    share: Math.min(quota.calls_today / (quota.budget || 1), 1),
    // Fewer calls left than three manual updates would spend.
    tight: quota.remaining < quota.refresh_cost * 3,
  };
}

/**
 * What the theme chips show. The followed themes' own chips show only while My
 * themes is picked and unfolded; the chip after them is Done while they wiggle,
 * else Edit themes, which also stands alone when nothing is followed yet.
 */
export function chipLayout(state: {
  mine: boolean;
  open: boolean;
  wiggling: boolean;
  followed: number;
}): { themes: boolean; trailing: "done" | "edit" | "none" } {
  const themes = state.mine && state.open;
  const trailing = state.wiggling
    ? "done"
    : themes || !state.followed
      ? "edit"
      : "none";
  return { themes, trailing };
}

/** Pressing My themes: picks it folded, then folds and unfolds it once picked. */
export function pressMyThemes(
  mine: boolean,
  open: boolean,
): { open: boolean; pick: boolean } {
  return mine ? { open: !open, pick: false } : { open: false, pick: true };
}

/** A theme chip's press: the one that ended a hold is spent, and a wiggle picks nothing. */
export function chipPress(
  held: boolean,
  wiggling: boolean,
): "spent" | "ignored" | "pick" {
  if (held) return "spent";
  return wiggling ? "ignored" : "pick";
}
