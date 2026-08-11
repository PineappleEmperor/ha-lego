"""The LEGO integration, backed by Brickset."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_KEY, CONF_USERNAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.device_registry import DeviceEntry
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.typing import ConfigType

from .api import BricksetClient
from .catalogue import SetCatalogue
from .const import (
    CONF_CATALOGUE,
    CONF_CATALOGUE_INTERVAL,
    CONF_CATALOGUE_RICH,
    CONF_DAILY_CALL_BUDGET,
    CONF_USER_HASH,
    DEFAULT_CATALOGUE,
    DEFAULT_CATALOGUE_INTERVAL_DAYS,
    DEFAULT_CATALOGUE_RICH,
    DEFAULT_DAILY_CALL_BUDGET,
    DOMAIN,
)
from .coordinator import LegoCollectionCoordinator, LegoFeedsCoordinator
from .quota import QuotaManager
from .services import async_setup_services
from .websocket import async_setup_websocket

PLATFORMS: list[Platform] = [Platform.CALENDAR, Platform.SENSOR]

# How often staleness is reconsidered, not how often the index is downloaded.
CATALOGUE_CHECK_INTERVAL = timedelta(hours=6)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class LegoRuntimeData:
    """Everything a config entry needs at runtime."""

    client: BricksetClient
    quota: QuotaManager
    collection: LegoCollectionCoordinator
    feeds: LegoFeedsCoordinator
    catalogue: SetCatalogue | None


type LegoConfigEntry = ConfigEntry[LegoRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the integration's actions and websocket commands."""
    async_setup_services(hass)
    async_setup_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: LegoConfigEntry) -> bool:
    """Set up a Brickset account from a config entry."""
    quota = QuotaManager(
        entry.options.get(CONF_DAILY_CALL_BUDGET, DEFAULT_DAILY_CALL_BUDGET)
    )
    client = BricksetClient(
        async_get_clientsession(hass),
        entry.data[CONF_API_KEY],
        entry.data[CONF_USER_HASH],
        quota=quota,
    )

    catalogue: SetCatalogue | None = None
    if entry.options.get(CONF_CATALOGUE, DEFAULT_CATALOGUE):
        rich = entry.options.get(CONF_CATALOGUE_RICH, DEFAULT_CATALOGUE_RICH)
        catalogue = SetCatalogue(
            hass,
            async_get_clientsession(hass),
            entry.options.get(CONF_CATALOGUE_INTERVAL, DEFAULT_CATALOGUE_INTERVAL_DAYS),
        )
        await catalogue.async_load(rich=rich)

    collection = LegoCollectionCoordinator(hass, entry, client, quota, catalogue)
    feeds = LegoFeedsCoordinator(hass, entry, client, quota, catalogue)

    await collection.async_config_entry_first_refresh()
    if feeds.themes:
        await feeds.async_config_entry_first_refresh()

    entry.runtime_data = LegoRuntimeData(
        client=client,
        quota=quota,
        collection=collection,
        feeds=feeds,
        catalogue=catalogue,
    )

    if catalogue is not None:
        rich = entry.options.get(CONF_CATALOGUE_RICH, DEFAULT_CATALOGUE_RICH)

        async def async_refresh_catalogue_if_stale(
            _now: datetime | None = None,
        ) -> None:
            """Re-seed once the configured interval has elapsed."""
            if catalogue.stale:
                await catalogue.async_refresh(rich=rich)

        # Seeding downloads half a megabyte, which setup must not wait on.
        entry.async_create_background_task(
            hass, async_refresh_catalogue_if_stale(), "lego_catalogue_refresh"
        )
        # An interval measured in days needs a tick; setup alone would only
        # refresh on restart.
        entry.async_on_unload(
            async_track_time_interval(
                hass, async_refresh_catalogue_if_stale, CATALOGUE_CHECK_INTERVAL
            )
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(async_update_options))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: LegoConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.collection.async_shutdown()
        await entry.runtime_data.feeds.async_shutdown()
        if entry.runtime_data.catalogue is not None:
            await entry.runtime_data.catalogue.async_save_if_dirty()
    return unloaded


async def async_update_options(hass: HomeAssistant, entry: LegoConfigEntry) -> None:
    """Reload the entry so the coordinators pick up the new options."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    entry: LegoConfigEntry,
    device_entry: DeviceEntry,
) -> bool:
    """Refuse removal; the entry owns its only device, so delete the entry."""
    return False


def account_name(entry: ConfigEntry) -> str:
    """Return the Brickset account label for an entry."""
    return str(entry.data.get(CONF_USERNAME, "Brickset"))
