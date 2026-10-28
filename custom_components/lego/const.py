"""Constants for the LEGO integration."""

from datetime import timedelta
from typing import Final

DOMAIN: Final = "lego"

ATTRIBUTION: Final = "Data provided by Brickset.com"

CONF_USER_HASH: Final = "user_hash"

CONF_THEMES: Final = "themes"
CONF_DAILY_CALL_BUDGET: Final = "daily_call_budget"
CONF_PANEL: Final = "panel"
CONF_CATALOGUE: Final = "catalogue"
CONF_CATALOGUE_RICH: Final = "catalogue_rich"
CONF_CATALOGUE_INTERVAL: Final = "catalogue_interval"
# The Home Assistant users an account belongs to, and whether every user may use it
# anyway. Admins can use every account whatever these say.
CONF_USERS: Final = "users"
CONF_SHARED: Final = "shared"
# Entries made before accounts belonged to anyone migrate shared, so an upgrade
# takes no one's account away; a new account is its users' alone.
DEFAULT_SHARED: Final = False

REGIONS: Final = ["UK", "US", "CA", "DE"]
REGION_CURRENCY: Final = {"UK": "GBP", "US": "USD", "CA": "CAD", "DE": "EUR"}

DEFAULT_REGION: Final = "UK"

# Brickset publishes LEGO.com pricing for four markets; every other country has
# to be asked rather than guessed.
COUNTRY_TO_REGION: Final = {"GB": "UK", "US": "US", "CA": "CA", "DE": "DE"}

# The collection changes only when its owner edits it, so an hour is the floor; the
# interval steps up from there until the polls fit the budget. Theme feeds gain a few
# sets a week, so twice a day is plenty.
COLLECTION_INTERVAL_STEPS_HOURS: Final = (1, 2, 3, 4, 6, 8, 12, 24)
# The feeds poll this often while they ask Brickset for the followed themes alone.
FEEDS_INTERVAL_HOURS: Final = 12
# Following releases across all themes fills the panel's "Out recently" and "Coming
# soon" rows: the feeds then read every set of each year the window either side of
# today touches, and cut the followed themes from that too, so one daily poll does
# both jobs. Off for entries made before it existed, so an upgrade spends no new
# calls; the config flow turns it on for new entries.
CONF_RELEASES: Final = "releases"
DEFAULT_RELEASES: Final = False
RELEASES_INTERVAL_HOURS: Final = 24
RELEASES_WINDOW_DAYS: Final = 28
# Until a first poll lands there is nothing to show, so a failed one is retried sooner.
FEEDS_RETRY_HOURS: Final = 3
# A whole year passes a thousand entries once gear and books count, three pages of
# 500; a year not yet started holds a page at most. The budget plans on these until
# a poll measures the real count, and the cap bounds a bad day.
RELEASES_PAGES_ESTIMATE: Final = 3
YEAR_MAX_PAGES: Final = 4
# getThemes, which is free, says when next year has sets filed under it. Without
# that answer the budget assumes LEGO announces its January wave from this month.
NEXT_YEAR_FROM_MONTH: Final = 9
# Polls may spend this share of the budget; the rest is kept for actions such as a
# manual refresh or a set lookup, which would otherwise find the budget spent.
POLL_SHARE_OF_BUDGET: Final = 0.75
# Owned and wanted cost one call each until either list passes a page.
MIN_COLLECTION_POLL_COST: Final = 2

# Brickset caps getSets at 100 calls per key per day; no other method counts.
BRICKSET_DAILY_CALL_LIMIT: Final = 100
DEFAULT_DAILY_CALL_BUDGET: Final = 80

PAGE_SIZE: Final = 500

SETS_CSV_URL: Final = "https://cdn.rebrickable.com/media/downloads/sets.csv.gz"
# Brickset's own pictures of a set, which its server finds by number alone, so a set
# the index knows draws without a call. A number Brickset lacks answers 404. Measured
# 2026-10-28: the small one runs about 16 KB, the large one about 90 KB.
BRICKSET_THUMBNAIL_URL: Final = "https://images.brickset.com/sets/small/{number}.jpg"
BRICKSET_IMAGE_URL: Final = "https://images.brickset.com/sets/images/{number}.jpg"
# Whether a high-resolution screen is offered the large picture as well.
CONF_SHARP_PICTURES: Final = "sharp_pictures"
DEFAULT_SHARP_PICTURES: Final = False
THEMES_CSV_URL: Final = "https://cdn.rebrickable.com/media/downloads/themes.csv.gz"

# Rebrickable files keyrings, lunchboxes and storybooks under these, numbered
# exactly like sets; Brickset does not carry most of them.
EXCLUDED_ROOT_THEMES: Final = frozenset({"Gear", "Books"})

DEFAULT_CATALOGUE: Final = True
DEFAULT_CATALOGUE_RICH: Final = True
# Monthly, out of respect for Rebrickable's servers; Brickset's polls fill in the
# sets announced since, so the index only needs to catch up on the long tail.
DEFAULT_CATALOGUE_INTERVAL_DAYS: Final = 30
# The default before 1.0.0, which an upgrade moves to the monthly one.
PREVIOUS_CATALOGUE_INTERVAL_DAYS: Final = 7
MIN_CATALOGUE_INTERVAL_DAYS: Final = 1
MAX_CATALOGUE_INTERVAL_DAYS: Final = 90

STORAGE_KEY: Final = "lego_catalogue"
STORAGE_VERSION: Final = 1

DEFAULT_PANEL: Final = True
PANEL_URL_PATH: Final = "lego"
PANEL_MODULE_URL: Final = "/lego_panel/lego-panel.js"
PANEL_ICON_URL: Final = "/lego_panel/icon.png"
PANEL_COMPONENT: Final = "lego-panel"
PANEL_STORAGE_KEY: Final = "lego_panel"
# Row ids the panel may order; unknown ids from a newer build are dropped.
PANEL_ROWS: Final = (
    "collection",
    "releases",
    "recent",
    "upcoming",
    "themes",
    "wishlist",
    "value",
    "pieces",
)
# Rows a user starts without; the panel's Customise list adds them.
PANEL_DEFAULT_HIDDEN: Final = ("pieces",)
# Rows that start folded to their header until a user opens them.
PANEL_DEFAULT_COLLAPSED: Final = ("value", "pieces")
# "releases" is one row filtered by scope and span; the other three are the same
# sets split into fixed rows. Which a user sees is a setting, not two features.
RELEASE_MODES: Final = ("combined", "separate")
RELEASE_ROWS: Final = ("releases", "recent", "upcoming", "themes")
RELEASE_SCOPES: Final = ("all", "mine")
# How large the panel draws each set's picture: once, twice or three times the card.
PICTURE_SIZES: Final = ("small", "medium", "large")
DEFAULT_PICTURE_SIZE: Final = "medium"
RELEASE_SPANS: Final = (
    "around",
    "year",
    "past3",
    "past1",
    "next1",
    "next3",
    "coming",
)

MIN_TIME_BETWEEN_QUOTA_CHECKS: Final = timedelta(minutes=30)

EVENT_NEW_SET: Final = f"{DOMAIN}_new_set"
EVENT_WANTED_CHANGED: Final = f"{DOMAIN}_wanted_set_changed"

SERVICE_SET_COLLECTION: Final = "set_collection"
SERVICE_SEARCH_SETS: Final = "search_sets"
SERVICE_REFRESH_CATALOGUE: Final = "refresh_catalogue"
SERVICE_REFRESH_COLLECTION: Final = "refresh_collection"

ATTR_SET_NUMBER: Final = "set_number"
ATTR_OWNED: Final = "owned"
ATTR_WANTED: Final = "wanted"
ATTR_QTY_OWNED: Final = "qty_owned"
ATTR_RATING: Final = "rating"
ATTR_NOTES: Final = "notes"
ATTR_QUERY: Final = "query"
ATTR_THEME: Final = "theme"
ATTR_YEAR: Final = "year"
ATTR_LIMIT: Final = "limit"
