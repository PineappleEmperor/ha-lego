"""Constants for the LEGO integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "lego"

ATTRIBUTION: Final = "Data provided by Brickset.com"

CONF_API_KEY: Final = "api_key"
CONF_USERNAME: Final = "username"
CONF_PASSWORD: Final = "password"
CONF_USER_HASH: Final = "user_hash"

CONF_REGION: Final = "region"
CONF_THEMES: Final = "themes"
CONF_WATCHLIST: Final = "watchlist"
CONF_COLLECTION_INTERVAL: Final = "collection_interval_hours"
CONF_FEEDS_INTERVAL: Final = "feeds_interval_hours"
CONF_DAILY_CALL_BUDGET: Final = "daily_call_budget"
CONF_PANEL: Final = "panel"
CONF_CATALOGUE: Final = "catalogue"
CONF_CATALOGUE_RICH: Final = "catalogue_rich"
CONF_CATALOGUE_INTERVAL: Final = "catalogue_interval"

REGIONS: Final = ["UK", "US", "CA", "DE"]
REGION_CURRENCY: Final = {"UK": "GBP", "US": "USD", "CA": "CAD", "DE": "EUR"}

DEFAULT_REGION: Final = "UK"

# Brickset publishes LEGO.com pricing for four markets; every other country has
# to be asked rather than guessed.
COUNTRY_TO_REGION: Final = {"GB": "UK", "US": "US", "CA": "CA", "DE": "DE"}

DEFAULT_COLLECTION_INTERVAL_HOURS: Final = 1
DEFAULT_FEEDS_INTERVAL_HOURS: Final = 12

# Brickset caps getSets at 100 calls per key per day; no other method counts.
BRICKSET_DAILY_CALL_LIMIT: Final = 100
DEFAULT_DAILY_CALL_BUDGET: Final = 80

MIN_INTERVAL_HOURS: Final = 1
MAX_INTERVAL_HOURS: Final = 168

PAGE_SIZE: Final = 500

SETS_CSV_URL: Final = "https://cdn.rebrickable.com/media/downloads/sets.csv.gz"
THEMES_CSV_URL: Final = "https://cdn.rebrickable.com/media/downloads/themes.csv.gz"

# Rebrickable files keyrings, lunchboxes and storybooks under these, numbered
# exactly like sets; Brickset does not carry most of them.
EXCLUDED_ROOT_THEMES: Final = frozenset({"Gear", "Books"})

DEFAULT_CATALOGUE: Final = True
DEFAULT_CATALOGUE_RICH: Final = True
DEFAULT_CATALOGUE_INTERVAL_DAYS: Final = 7
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
PANEL_STORE: Final = "lego_panel_store"
# Row ids the panel may order; unknown ids from a newer build are dropped.
PANEL_ROWS: Final = ("themes", "wishlist", "collection")

MIN_TIME_BETWEEN_QUOTA_CHECKS: Final = timedelta(minutes=30)

EVENT_NEW_SET: Final = f"{DOMAIN}_new_set"
EVENT_WANTED_CHANGED: Final = f"{DOMAIN}_wanted_set_changed"

SERVICE_SET_COLLECTION: Final = "set_collection"
SERVICE_ADD_WATCH: Final = "add_watch"
SERVICE_REMOVE_WATCH: Final = "remove_watch"
SERVICE_SEARCH_SETS: Final = "search_sets"
SERVICE_REFRESH_CATALOGUE: Final = "refresh_catalogue"
SERVICE_REFRESH_COLLECTION: Final = "refresh_collection"

ATTR_CONFIG_ENTRY_ID: Final = "config_entry_id"
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
