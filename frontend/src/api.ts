import { accountCall } from "./format";
import type { Dashboard, Hass, Releases, ReleaseFilter } from "./types";

/**
 * Dashboards in flight or loaded, per account. Several cards on one dashboard
 * share one request rather than each asking; a write anywhere empties it.
 */
const dashboards = new Map<string, Promise<Dashboard>>();

/** Fired on window after the cache is emptied, so every card reloads. */
export const INVALIDATED = "lego-invalidated";

export function loadDashboard(hass: Hass, entryId: string): Promise<Dashboard> {
  let pending = dashboards.get(entryId);
  if (!pending) {
    pending = hass.callWS<Dashboard>(accountCall("lego/dashboard", entryId));
    dashboards.set(entryId, pending);
    // A failure must not stick: the next card to ask tries again.
    pending.catch(() => dashboards.delete(entryId));
  }
  return pending;
}

export function invalidate(): void {
  dashboards.clear();
  window.dispatchEvent(new Event(INVALIDATED));
}

export function loadReleases(
  hass: Hass,
  entryId: string,
  filter: Required<ReleaseFilter>,
): Promise<Releases> {
  return hass.callWS<Releases>({
    ...accountCall("lego/releases", entryId),
    scope: filter.scope,
    themes: filter.themes,
    span: filter.span,
  });
}
