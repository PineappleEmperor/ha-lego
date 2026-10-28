import type {
  Dashboard,
  PanelSettings,
  LegoSet,
  Point,
  ReleaseFilter,
  ReleaseRow,
  Scope,
  Span,
  ThemeTotal,
  TimelinePoint,
} from "./types";
/** The narrowest gap between two average bricks, and how far one may widen. */
const BRICK_GAP = 12;
// Wide enough that the rainbow fills a desktop row, around 1,300 pixels.
const BRICK_GAP_STRETCH = 10;

export interface BrickFit {
  /** How many of the bricks fit, smallest first. */
  count: number;
  /** The gap after each shown brick but the last, in pixels. */
  gaps: number[];
}

/**
 * Fit the rainbow into a width: as many bricks as fit at the narrowest gaps,
 * then the spare width shared between the gaps, the bigger pieces' gaps taking
 * more, up to a stretch past which the bricks would read as scattered.
 */
export function fitBricks(widths: number[], available: number): BrickFit {
  // Weighed against these widths, which may be drawn at any scale.
  const mean = widths.reduce((sum, w) => sum + w, 0) / (widths.length || 1);
  const base = (i: number) =>
    (BRICK_GAP * (widths[i] + widths[i + 1])) / 2 / mean;
  let count = 0;
  let used = 0;
  for (const [i, width] of widths.entries()) {
    const next = used + (i ? base(i - 1) : 0) + width;
    if (next > available) break;
    used = next;
    count = i + 1;
  }
  const gaps = Array.from({ length: Math.max(count - 1, 0) }, (_, i) =>
    base(i),
  );
  let spare = available - used;
  // Shared by weight; a gap that reaches its cap passes the rest to the others.
  let open = gaps.map((_, i) => i);
  while (spare > 0.5 && open.length) {
    const weight = open.reduce((sum, i) => sum + base(i), 0);
    const share = spare;
    spare = 0;
    open = open.filter((i) => {
      const cap = base(i) * BRICK_GAP_STRETCH;
      const want = gaps[i] + (share * base(i)) / weight;
      gaps[i] = Math.min(want, cap);
      spare += want - gaps[i];
      return gaps[i] < cap;
    });
  }
  return { count, gaps: gaps.map((gap) => Math.round(gap * 10) / 10) };
}

// Brickset publishes a set before its name is announced and fills the name with
// this placeholder. It is real data, not a fault, but it means nothing on a card.
const UNNAMED = "{?}";

/**
 * The data a set_collection call needs. Exported because the required fields are
 * declared in Python and nothing here can check them: callService takes a plain
 * record, so omitting the target type-checks cleanly and fails at runtime, in the
 * browser, where nobody is watching. That shipped in four releases. Actions target
 * the account's Brickset device, so the target is its device_id.
 */
export function ownershipCall(
  deviceId: string,
  item: Pick<LegoSet, "set_number" | "owned">,
): Record<string, unknown> {
  return {
    device_id: deviceId,
    set_number: item.set_number,
    owned: !item.owned,
  };
}

/** The data a refresh_collection call needs, exported for the same reason. */
export function refreshCall(deviceId: string): Record<string, unknown> {
  return { device_id: deviceId };
}

/**
 * Address a websocket command at one account. Exported for the same reason as
 * ownershipCall: config_entry_id is optional on the Python side, so an empty
 * string would pass the schema and then fail to resolve to an entry. Omitting the
 * key is what makes the server fall back to the stored choice.
 */
export function accountCall(
  type: string,
  entryId: string,
): Record<string, unknown> {
  return entryId ? { type, config_entry_id: entryId } : { type };
}

/**
 * How long ago Brickset last answered a poll. Once the daily budget is spent the
 * panel keeps showing the last sync's data, so its age is what says how far to
 * trust it. Exported so a test can pin the wording.
 */
export function syncedAgo(lastSynced: string | null, now: Date): string {
  if (!lastSynced) return "Not synced yet";
  const minutes = Math.floor(
    (now.getTime() - new Date(lastSynced).getTime()) / 60_000,
  );
  if (minutes < 1) return "Updated just now";
  const ago = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (minutes < 60) return `Updated ${ago.format(-minutes, "minute")}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `Updated ${ago.format(-hours, "hour")}`;
  return `Updated ${ago.format(-Math.floor(hours / 24), "day")}`;
}

/** A LEGO.com RRP in the account's region, or "" when Brickset has none. */
export function formatPrice(
  value: number | null | undefined,
  currency: string | null,
  language?: string,
  wholeUnits = false,
): string {
  // == null, not === null: a payload that leaves the field out sends undefined,
  // and Intl turns that into "NaN" rather than failing.
  if (value == null || !currency) return "";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    ...(wholeUnits ? { maximumFractionDigits: 0 } : {}),
  }).format(value);
}

/**
 * The text of a rejected call. Home Assistant's websocket rejects with a plain
 * {code, message} object rather than an Error, which String() turns into
 * "[object Object]".
 */
export function errorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

/**
 * Recorder statistics as chart points. A TOTAL sensor records its state, a
 * MEASUREMENT one a mean; periods with neither are dropped rather than drawn as 0.
 */
export function statisticPoints(
  rows: {
    start: number | string;
    state?: number | null;
    mean?: number | null;
  }[],
): Point[] {
  const points: Point[] = [];
  for (const row of rows) {
    const v = row.state ?? row.mean;
    if (v == null) continue;
    points.push({ t: new Date(row.start).getTime(), v });
  }
  return points;
}

export interface ThemeSlice {
  theme: string;
  amount: number;
  sets: number;
  setNumbers: string[];
  other: boolean;
}

/**
 * The biggest few themes by a measure, the rest folded into "Other". Six slices
 * at most, so a donut stays readable at a glance.
 */
export function topThemes(
  totals: ThemeTotal[],
  measure: "value" | "pieces",
  keep = 6,
): ThemeSlice[] {
  const ranked = [...totals]
    .filter((row) => row[measure] > 0)
    .sort((a, b) => b[measure] - a[measure]);
  const shown: ThemeSlice[] = ranked.slice(0, keep).map((row) => ({
    theme: row.theme,
    amount: row[measure],
    sets: row.sets,
    setNumbers: row.set_numbers ?? [],
    other: false,
  }));
  const rest = ranked.slice(keep);
  if (rest.length) {
    shown.push({
      theme: `Other (${count(rest.length, "theme", "themes")})`,
      amount: rest.reduce((sum, row) => sum + row[measure], 0),
      sets: rest.reduce((sum, row) => sum + row.sets, 0),
      setNumbers: rest.flatMap((row) => row.set_numbers ?? []).sort(),
      other: true,
    });
  }
  return shown;
}

/** "1 set", "12 sets". */
export function count(n: number, one: string, many: string): string {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

/** Brickset's own ceiling per API key per day, which no budget can pass. */
const BRICKSET_DAILY_LIMIT = 100;

/**
 * The budget meter's tooltip: what is used, and where the calls between the budget
 * and Brickset's ceiling go, since nothing here spends them.
 */
export function budgetTitle(
  used: number,
  budget: number,
  resets: string,
): string {
  const spare = BRICKSET_DAILY_LIMIT - budget;
  return [
    `${used} of today's ${budget} calls used.`,
    spare > 0
      ? `The other ${spare} of the ${BRICKSET_DAILY_LIMIT} Brickset allows each API key a day are left unused, for anything else on your key.`
      : `Your budget is all ${BRICKSET_DAILY_LIMIT} calls Brickset allows each API key a day.`,
    `The count starts again at ${resets}.`,
  ].join(" ");
}

/** Within this many days of leaving sale, a set's exit date is flagged. */
const RETIRING_SOON_DAYS = 60;

/**
 * Which date a card leads with: a row of new releases is about when a set came
 * out or is due, a wishlist or a collection about when it leaves sale.
 */
export type DateFocus = "release" | "retirement";

/**
 * How a card's date reads at a glance, so released and upcoming sets differ without
 * longer wording: "due" not out yet, "retiring" leaving sale soon, "retired" gone.
 */
export function whenTone(
  item: Pick<LegoSet, "available_from" | "available_until">,
  now: Date,
  focus: DateFocus = "retirement",
): "due" | "retiring" | "retired" | "" {
  if (focus === "release" && item.available_from) {
    return new Date(item.available_from) > now ? "due" : "";
  }
  if (item.available_until) {
    const until = new Date(item.available_until).getTime();
    if (until < now.getTime()) return "retired";
    const days = (until - now.getTime()) / 86_400_000;
    return days <= RETIRING_SOON_DAYS ? "retiring" : "";
  }
  if (item.available_from && new Date(item.available_from) > now) return "due";
  return "";
}

/** What a card says about a set's dates, worded for whether they have passed. */
export function whenLabel(
  item: Pick<LegoSet, "available_from" | "available_until" | "name">,
  now: Date,
  format: (iso: string) => string,
  focus: DateFocus = "retirement",
): string {
  if (focus === "release" && item.available_from) {
    const coming = new Date(item.available_from) > now;
    return `${coming ? "Due" : "Out"} ${format(item.available_from)}`;
  }
  if (item.available_until) {
    const gone = new Date(item.available_until) < now;
    return `${gone ? "Retired" : "Retires"} ${format(item.available_until)}`;
  }
  if (item.available_from) {
    const coming = new Date(item.available_from) > now;
    return `${coming ? "Due" : "Out"} ${format(item.available_from)}`;
  }
  return isNamed(item) ? "Date unknown" : "Details tbd";
}

/**
 * A link or picture address from Brickset's data, kept only when it is a web
 * address. The data is copied from the API as-is, and Lit binds a `javascript:`
 * URL into an href as readily as any other.
 */
export function webUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

export function isNamed(item: Pick<LegoSet, "name">): boolean {
  const name = (item.name ?? "").trim();
  return name !== "" && name !== UNNAMED;
}

export function displayName(item: Pick<LegoSet, "name">): string {
  return isNamed(item) ? item.name : "Name tbd";
}

export const SPAN_LABELS: Record<Span, string> = {
  around: "Now",
  year: "This year",
  past3: "Past 3 months",
  past1: "Past month",
  next1: "Next month",
  next3: "Next 3 months",
  coming: "Unreleased",
};

/** What a span covers, for the spans whose short name does not say. */
export const SPAN_HINTS: Partial<Record<Span, string>> = {
  around: "Three months either side of today",
  year: "January to December",
  coming: "Every set announced and not yet out, with a date or without",
};

/** A span's name on its pill: the year span is named by the year itself. */
export function spanLabel(span: Span, today = new Date()): string {
  return span === "year" ? String(today.getFullYear()) : SPAN_LABELS[span];
}

/** Why a card cannot open a row on a span, or "" when it can. */
export function spanProblem(row: ReleaseRow, span: Span | undefined): string {
  if (!span || ROW_SPANS[row].includes(span)) return "";
  const offered = ROW_SPANS[row].map((s) => spanLabel(s)).join(", ");
  return `This row offers ${offered}, not ${spanLabel(span)}.`;
}

/**
 * The spans each release row offers, in time order, the past first. Brickset
 * dates little more than a few months ahead, so the future is one span, and the
 * fixed rows have one span each.
 */
export const ROW_SPANS: Record<ReleaseRow, Span[]> = {
  releases: ["past3", "around", "year", "coming"],
  themes: ["past3", "around", "year", "coming"],
  recent: ["past3"],
  upcoming: ["coming"],
};

/** A release row's own scope: the fixed rows cover every theme or yours. */
const ROW_SCOPE: Partial<Record<ReleaseRow, Scope>> = {
  recent: "all",
  upcoming: "all",
  themes: "mine",
};

export interface ResolvedFilter {
  scope: Scope;
  themes: string[];
  span: Span;
}

/**
 * The filter a release row opens on: the user's saved default where it still
 * applies, else the row's own. A saved theme nobody follows any more is dropped
 * rather than leaving the row empty, and "Everything" falls back to the followed
 * themes when releases across all themes are not being followed.
 */
export function releaseFilter(
  row: ReleaseRow,
  dash: Pick<Dashboard, "release_filters" | "release_status" | "followed">,
): ResolvedFilter {
  const saved: ReleaseFilter = dash.release_filters?.[row] ?? {};
  const allOn = dash.release_status.all !== null;
  const fixed = ROW_SCOPE[row];
  // Your own themes first: every theme costs a read of the whole year, so it is
  // the one to pick, not the one to be given.
  const fallback: Scope = dash.followed.length || !allOn ? "mine" : "all";
  let scope: Scope = fixed ?? saved.scope ?? fallback;
  if (scope === "all" && !allOn) scope = "mine";
  const followed = new Set(dash.followed.map((t) => t.toLowerCase()));
  const themes =
    scope === "mine"
      ? (saved.themes ?? []).filter((t) => followed.has(t.toLowerCase()))
      : [];
  const spans = ROW_SPANS[row];
  const span =
    saved.span && spans.includes(saved.span)
      ? saved.span
      : row === "upcoming"
        ? "coming"
        : row === "recent"
          ? "past3"
          : "around";
  return { scope, themes, span };
}

/**
 * Add or remove a theme from a multi-select, where an empty list means every
 * followed theme. Picking the last one unpicked, or every one, returns to all.
 */
export function toggleTheme(
  picked: string[],
  theme: string,
  followed: string[],
): string[] {
  const next = picked.includes(theme)
    ? picked.filter((t) => t !== theme)
    : [...picked, theme];
  return next.length === followed.length ? [] : next;
}

/** Months the timeline spans: January this year to the end of next March. */
export const TIMELINE_MONTHS = 15;

/** On a phone, the months one screen's width of timeline shows. */
const COMPACT_MONTHS = 3;
/** The least a phone shows, so a short span still has some year around it. */
const COMPACT_LEAST = 2;
const COMPACT_MARGIN = 0.25;

export interface TimelineView {
  /** The first and last month shown, in months from 1 January. */
  from: number;
  to: number;
  /** How many screen widths the timeline is drawn across; above 1 it scrolls. */
  width: number;
}

/**
 * The part of the timeline to draw. A wide screen shows all of it; a phone shows
 * only the chosen span, at a readable scale, scrolling once the span is longer
 * than a screen's width holds.
 */
export function timelineView(
  from: number,
  to: number,
  compact: boolean,
): TimelineView {
  if (!compact) return { from: 0, to: TIMELINE_MONTHS, width: 1 };
  let first = Math.max(from - COMPACT_MARGIN, 0);
  let last = Math.min(to + COMPACT_MARGIN, TIMELINE_MONTHS);
  const short = COMPACT_LEAST - (last - first);
  if (short > 0) {
    first = Math.max(first - short / 2, 0);
    last = Math.min(first + COMPACT_LEAST, TIMELINE_MONTHS);
    first = Math.max(last - COMPACT_LEAST, 0);
  }
  return {
    from: first,
    to: last,
    width: Math.max((last - first) / COMPACT_MONTHS, 1),
  };
}

/** A date's position on the timeline, in months from 1 January this year. */
export function monthsFrom(start: Date, iso: string | Date): number {
  const d =
    typeof iso === "string" ? new Date(`${iso.slice(0, 10)}T00:00:00`) : iso;
  const months =
    (d.getFullYear() - start.getFullYear()) * 12 +
    d.getMonth() -
    start.getMonth();
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return months + (d.getDate() - 1) / days;
}

export interface Stack {
  at: number;
  themes: string[];
  extra: number;
  /** Every set in the stack, the ones past the cap included, for its hover. */
  points: TimelinePoint[];
}

/**
 * Group timeline points that would overlap into stacks of at most `cap`, the rest
 * counted. Points within `gap` months of a stack's first point join it, so dense
 * weeks read as one stack rather than a smear.
 */
export function stackTimeline(
  points: TimelinePoint[],
  start: Date,
  gap = 0.15,
  cap = 4,
): Stack[] {
  const stacks: { at: number; points: TimelinePoint[] }[] = [];
  for (const point of [...points].sort((a, b) =>
    a.date.localeCompare(b.date),
  )) {
    const at = monthsFrom(start, point.date);
    if (at < 0 || at > TIMELINE_MONTHS) continue;
    const last = stacks[stacks.length - 1];
    if (last && at - last.at <= gap) last.points.push(point);
    else stacks.push({ at, points: [point] });
  }
  return stacks.map((s) => ({
    at: s.at,
    themes: s.points.slice(0, cap).map((point) => point.theme),
    extra: Math.max(s.points.length - cap, 0),
    points: s.points,
  }));
}

/**
 * Where each disc of a stack sits against the line, in pixels: centred, so a
 * stack grows equally above and below it rather than drifting upwards.
 */
export function stackOffsets(size: number, step = 5): number[] {
  return Array.from({ length: size }, (_, i) => (i - (size - 1) / 2) * step);
}

const SEPARATE: string[] = ["recent", "upcoming", "themes"];
/** The rows a release layout uses: one combined row, or the three split ones. */
export function rowsForMode(
  rows: string[],
  mode: PanelSettings["release_mode"],
): string[] {
  const skip = mode === "combined" ? SEPARATE : ["releases"];
  return rows.filter((row) => !skip.includes(row));
}

/**
 * Move a row one step among the rows a list shows, keeping its place in the full
 * order, which also holds rows the list leaves out.
 */
export function moveRow(
  rows: string[],
  shown: string[],
  row: string,
  step: number,
): string[] {
  const target = shown[shown.indexOf(row) + step];
  if (!target) return rows;
  const next = rows.filter((r) => r !== row);
  next.splice(next.indexOf(target) + (step > 0 ? 1 : 0), 0, row);
  return next;
}
