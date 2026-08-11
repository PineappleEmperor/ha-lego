"""Diagnostics for the LEGO integration."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import CONF_API_KEY, CONF_USERNAME
from homeassistant.core import HomeAssistant

from .const import BRICKSET_DAILY_CALL_LIMIT, CONF_USER_HASH

if TYPE_CHECKING:
    from . import LegoConfigEntry

TO_REDACT = {CONF_API_KEY, CONF_USER_HASH, CONF_USERNAME}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: LegoConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    runtime = entry.runtime_data
    collection = runtime.collection
    feeds = runtime.feeds
    quota = runtime.quota
    catalogue = runtime.catalogue
    data = collection.data

    return {
        "entry": {
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": dict(entry.options),
        },
        "quota": {
            "calls_today": quota.calls_today,
            "budget": quota.budget,
            "remaining": quota.remaining,
            "brickset_daily_limit": BRICKSET_DAILY_CALL_LIMIT,
            "recent_usage": {
                day.isoformat(): count
                for day, count in sorted(quota.server_usage.items(), reverse=True)
            },
        },
        "coordinators": {
            "collection": {
                "last_update_success": collection.last_update_success,
                "update_interval_hours": (
                    collection.update_interval.total_seconds() / 3600
                    if collection.update_interval
                    else None
                ),
                "owned_sets": len(data.owned) if data else 0,
                "wanted_sets": len(data.wanted) if data else 0,
                "watched_sets": sorted(data.watched) if data else [],
            },
            "feeds": {
                "last_update_success": feeds.last_update_success,
                "update_interval_hours": (
                    feeds.update_interval.total_seconds() / 3600
                    if feeds.update_interval
                    else None
                ),
                "themes": {
                    theme: len(sets) for theme, sets in (feeds.data or {}).items()
                },
            },
        },
        "catalogue": (
            {
                "sets": catalogue.size,
                "known_brickset_ids": catalogue.known_ids,
                "fetched": catalogue.fetched.isoformat() if catalogue.fetched else None,
                "stale": catalogue.stale,
            }
            if catalogue
            else None
        ),
        "summary": (
            {
                "sets_owned": data.summary.sets_owned,
                "sets_distinct": data.summary.sets_distinct,
                "pieces_owned": data.summary.pieces_owned,
                "minifigs_owned": data.summary.minifigs_owned,
                "sets_wanted": data.summary.sets_wanted,
                "value": data.summary.value,
                "sets_missing_price": data.summary.sets_missing_price,
            }
            if data
            else None
        ),
    }
