"""The LEGO integration, backed by Brickset."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_KEY, CONF_USERNAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.device_registry import DeviceEntry
from homeassistant.helpers.typing import ConfigType

from .api import BricksetClient
from .const import (
    CONF_DAILY_CALL_BUDGET,
    CONF_USER_HASH,
    DEFAULT_DAILY_CALL_BUDGET,
    DOMAIN,
)
from .coordinator import LegoCollectionCoordinator, LegoFeedsCoordinator
from .quota import QuotaManager
from .services import async_setup_services

PLATFORMS: list[Platform] = [Platform.CALENDAR, Platform.SENSOR]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class LegoRuntimeData:
    """Everything a config entry needs at runtime."""

    client: BricksetClient
    quota: QuotaManager
    collection: LegoCollectionCoordinator
    feeds: LegoFeedsCoordinator


type LegoConfigEntry = ConfigEntry[LegoRuntimeData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the integration's actions."""
    async_setup_services(hass)
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

    collection = LegoCollectionCoordinator(hass, entry, client, quota)
    feeds = LegoFeedsCoordinator(hass, entry, client, quota)

    await collection.async_config_entry_first_refresh()
    if feeds.themes:
        await feeds.async_config_entry_first_refresh()

    entry.runtime_data = LegoRuntimeData(
        client=client, quota=quota, collection=collection, feeds=feeds
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
    return unloaded


async def async_update_options(hass: HomeAssistant, entry: LegoConfigEntry) -> None:
    """Reload the entry when options change.

    Poll intervals, the pricing region and the watched theme list all feed into
    coordinator construction, so a rebuild is simpler than patching in place.
    """
    await hass.config_entries.async_reload(entry.entry_id)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    entry: LegoConfigEntry,
    device_entry: DeviceEntry,
) -> bool:
    """Refuse device removal.

    Each entry owns exactly one service device; removing it while the entry is
    loaded would leave orphaned entities, so the entry must be deleted instead.
    """
    return False


def account_name(entry: ConfigEntry) -> str:
    """Return the Brickset account label for an entry."""
    return str(entry.data.get(CONF_USERNAME, "Brickset"))
