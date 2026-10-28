export type Hass = {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ): Promise<unknown>;
  locale?: { language: string };
  themes?: { darkMode?: boolean };
  /** The websocket, which says "ready" again after Home Assistant restarts. */
  connection?: {
    addEventListener(event: "ready", listener: () => void): void;
  };
};

export interface LegoSet {
  set_number: string;
  name: string;
  year: number | null;
  theme: string;
  pieces: number | null;
  minifigs: number | null;
  image: string | null;
  /** Brickset's address for the picture, tried when Home Assistant's copy fails. */
  image_remote?: string | null;
  /** The large copy, offered to high-resolution screens when sharp pictures are on. */
  image_large?: string | null;
  /** Known only to the local index, so its dates and price are not loaded yet. */
  partial?: boolean;
  url: string | null;
  owned: boolean;
  wanted: boolean;
  qty_owned: number;
  retail_price: number | null;
  released: boolean;
  available_from: string | null;
  available_until: string | null;
}

export interface Stats {
  sets_owned: number;
  sets_distinct: number;
  pieces_owned: number;
  minifigs_owned: number;
  sets_wanted: number;
  value: number;
  sets_missing_price: number;
}

export interface ThemeTotal {
  theme: string;
  value: number;
  pieces: number;
  sets: number;
  set_numbers: string[];
}

/** One recorded statistic: when its period started, and the value for it. */
export interface Point {
  t: number;
  v: number;
}

export interface Quota {
  calls_today: number;
  budget: number;
  remaining: number;
  refresh_cost: number;
  resets_at: string;
}

export interface Account {
  entry_id: string;
  name: string;
  /** False when the account failed to load; `reason` then says why. */
  loaded: boolean;
  reason: string | null;
}

export interface AccountList {
  accounts: Account[];
  /** The account the panel opens on: the user's default, else their own. */
  selected: string | null;
}

export interface ThemeList {
  themes: string[];
  followed: string[];
  follow_cost: number;
  can_change: boolean;
}

export interface FollowResult {
  followed: string[];
  /** False when the theme's sets wait on the next check, the budget being spent. */
  complete: boolean;
}

export type Span =
  "around" | "year" | "past3" | "past1" | "next1" | "next3" | "coming";
export type Scope = "all" | "mine";
export type ReleaseRow = "releases" | "recent" | "upcoming" | "themes";
export type ReleaseStatus = "ready" | "fetching" | "failed" | null;

/** What a release row opens on; a missing key takes the row's own default. */
export interface ReleaseFilter {
  scope?: Scope;
  themes?: string[];
  span?: Span;
}

export interface PanelSettings {
  rows: string[];
  hidden: string[];
  collapsed: string[];
  release_mode: "combined" | "separate";
  release_filters: Partial<Record<ReleaseRow, ReleaseFilter>>;
  /** Whether My collection's set grid shows each set's price. */
  collection_prices: boolean;
  /** How large the panel draws each set's picture. */
  picture_size: PictureSize;
}

/** Once, twice or three times the card's own picture box. */
export type PictureSize = "small" | "medium" | "large";

export interface Dashboard extends PanelSettings {
  entry_id: string;
  device_id: string | null;
  /** The integration version installed, to spot a window running an older bundle. */
  version?: string | null;
  /** The account's Sharper pictures option, which cards follow unless set. */
  sharp_pictures?: boolean;
  /** Whether this user may change the account, not merely look at it. */
  can_change: boolean;
  region: string;
  currency: string | null;
  quota: Quota;
  last_synced: string | null;
  by_theme: ThemeTotal[];
  history: { value: string | null; pieces: string | null };
  stats: Stats;
  wishlist: LegoSet[];
  release_status: { all: ReleaseStatus; mine: ReleaseStatus };
  followed: string[];
}

export interface TimelinePoint {
  date: string;
  theme: string;
  number: string;
  name: string;
}

export interface Releases {
  status: ReleaseStatus;
  span: { from: string; to: string | null };
  sets: LegoSet[];
  timeline: TimelinePoint[];
}
