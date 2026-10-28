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

/**
 * The version this bundle was loaded as. Home Assistant serves it with the installed
 * version in its address, and a browser keeps running whatever an open window
 * loaded, through updates and restarts alike.
 */
export function bundleVersion(url: string = import.meta.url): string | null {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

/** Whether Home Assistant now runs a different version from this window's bundle. */
export function bundleOutdated(
  installed: string | null | undefined,
  url: string = import.meta.url,
): boolean {
  const loaded = bundleVersion(url);
  return !!installed && !!loaded && installed !== loaded;
}

const watched = new WeakSet<object>();

/**
 * Reload everything once Home Assistant is back after a restart. A restart voids
 * every signed picture address, so an open dashboard needs new ones to keep drawing
 * from Home Assistant's copies rather than going to Brickset.
 */
export function reloadOnReconnect(hass: Hass): void {
  const connection = hass.connection;
  if (!connection || watched.has(connection)) return;
  watched.add(connection);
  connection.addEventListener("ready", invalidate);
}

/** At most this often, a refused picture asks for new addresses. */
export const PICTURE_RETRY_MS = 60_000;
let picturesRetried = Number.NEGATIVE_INFINITY;

/**
 * A picture address Home Assistant refused has outlived its signature, as in a tab
 * left open past a day. Ask once a minute at most for new ones, however many
 * pictures failed together.
 */
export function picturesExpired(now = Date.now()): boolean {
  if (now - picturesRetried < PICTURE_RETRY_MS) return false;
  picturesRetried = now;
  invalidate();
  return true;
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
