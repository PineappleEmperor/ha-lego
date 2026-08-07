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

REGIONS: Final = ["UK", "US", "CA", "DE"]
REGION_CURRENCY: Final = {"UK": "GBP", "US": "USD", "CA": "CAD", "DE": "EUR"}

DEFAULT_REGION: Final = "UK"

# Brickset publishes LEGO.com pricing for four markets; every other country has
# to be asked rather than guessed.
COUNTRY_TO_REGION: Final = {"GB": "UK", "US": "US", "CA": "CA", "DE": "DE"}

DEFAULT_COLLECTION_INTERVAL_HOURS: Final = 6
DEFAULT_FEEDS_INTERVAL_HOURS: Final = 12

# Brickset caps getSets at 100 calls per key per day; no other method counts.
BRICKSET_DAILY_CALL_LIMIT: Final = 100
DEFAULT_DAILY_CALL_BUDGET: Final = 80

MIN_INTERVAL_HOURS: Final = 1
MAX_INTERVAL_HOURS: Final = 168

PAGE_SIZE: Final = 500

MIN_TIME_BETWEEN_QUOTA_CHECKS: Final = timedelta(minutes=30)

EVENT_NEW_SET: Final = f"{DOMAIN}_new_set"
EVENT_WANTED_CHANGED: Final = f"{DOMAIN}_wanted_set_changed"

SERVICE_SET_COLLECTION: Final = "set_collection"
SERVICE_ADD_WATCH: Final = "add_watch"
SERVICE_REMOVE_WATCH: Final = "remove_watch"
SERVICE_SEARCH_SETS: Final = "search_sets"

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
