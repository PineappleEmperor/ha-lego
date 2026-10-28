"""The LEGO integration, backed by Brickset."""

from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.const import CONF_API_KEY, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    config_validation as cv,
    entity_registry as er,
    issue_registry as ir,
)
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.device_registry import AnyDeviceEntry
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType

from .api import BricksetClient
from .catalogue import SetCatalogue
from .const import (
    CONF_CATALOGUE,
    CONF_CATALOGUE_INTERVAL,
    CONF_CATALOGUE_RICH,
    CONF_DAILY_CALL_BUDGET,
    CONF_SHARED,
    CONF_USER_HASH,
    DEFAULT_CATALOGUE,
    DEFAULT_CATALOGUE_INTERVAL_DAYS,
    DEFAULT_CATALOGUE_RICH,
    DEFAULT_DAILY_CALL_BUDGET,
    DOMAIN,
    PREVIOUS_CATALOGUE_INTERVAL_DAYS,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .coordinator import (
    LegoCollectionCoordinator,
    LegoConfigEntry,
    LegoFeedsCoordinator,
    LegoRuntimeData,
    paging_issue_id,
)
from .panel import (
    PANEL_STORE,
    PanelStore,
    async_refresh_panel,
    async_setup_panel_static,
)
from .quota import QuotaManager
from .services import async_setup_services, write_issue_id
from .websocket import async_setup_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.CALENDAR, Platform.SENSOR]

# Removed in 1.0.0: the wishlist now decides which sets get a countdown sensor.
LEGACY_CONF_WATCHLIST = "watchlist"
LEGACY_COUNTDOWN_PREFIX = "_watch_"

# How often staleness is reconsidered, not how often the index is downloaded.
CATALOGUE_CHECK_INTERVAL = timedelta(hours=6)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the integration's actions, websocket commands and panel bundle."""
    async_setup_services(hass)
    async_setup_websocket(hass)
    store = PanelStore(hass)
    await store.async_load()
    hass.data[PANEL_STORE] = store
    await async_setup_panel_static(hass)
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
    feeds = LegoFeedsCoordinator(
        hass, entry, client, quota, catalogue, collection=collection
    )

    await collection.async_config_entry_first_refresh()
    # A theme feed is one call, worth having before the entities appear; a read of
    # whole years is a few, which a tight budget must not let fail the entry.
    if feeds.themes and not feeds.releases:
        await feeds.async_config_entry_first_refresh()

    entry.runtime_data = LegoRuntimeData(
        client=client,
        quota=quota,
        collection=collection,
        feeds=feeds,
        catalogue=catalogue,
    )

    # A coordinator schedules polls only while something listens, and the panel and
    # the new-set events need them even with every entity disabled. Kept even while
    # nothing is followed, so a theme followed from the panel starts polling.
    entry.async_on_unload(feeds.async_add_listener(lambda: None))
    if feeds.releases:
        entry.async_create_background_task(
            hass, feeds.async_refresh(), "lego_feeds_refresh"
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
    await async_refresh_panel(hass)
    return True


async def async_migrate_entry(hass: HomeAssistant, entry: LegoConfigEntry) -> bool:
    """Drop the watchlist and its sensors, then share accounts made before users."""
    if entry.version > 2:
        _LOGGER.error(
            "Cannot read a LEGO entry saved by a newer version (%s); upgrade first",
            entry.version,
        )
        return False
    if entry.version == 1:
        _migrate_watchlist(hass, entry)
    if entry.minor_version < 2:
        # Before an account belonged to anyone every user could use it, so it stays
        # that way until an admin says whose it is.
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, CONF_SHARED: True}, minor_version=2
        )
    if entry.minor_version < 3:
        # The options form saved the old weekly default as if it were chosen; a
        # value someone actually picked is left alone.
        options = dict(entry.options)
        if options.get(CONF_CATALOGUE_INTERVAL) == PREVIOUS_CATALOGUE_INTERVAL_DAYS:
            options[CONF_CATALOGUE_INTERVAL] = DEFAULT_CATALOGUE_INTERVAL_DAYS
        hass.config_entries.async_update_entry(entry, options=options, minor_version=3)
    return True


def _migrate_watchlist(hass: HomeAssistant, entry: LegoConfigEntry) -> None:
    """Drop the watchlist option and the sensors it created."""
    registry = er.async_get(hass)
    legacy_prefix = f"{entry.entry_id}{LEGACY_COUNTDOWN_PREFIX}"
    for registered in list(er.async_entries_for_config_entry(registry, entry.entry_id)):
        if registered.unique_id.startswith(legacy_prefix):
            registry.async_remove(registered.entity_id)

    hass.config_entries.async_update_entry(
        entry,
        options={
            key: value
            for key, value in entry.options.items()
            if key != LEGACY_CONF_WATCHLIST
        },
        version=2,
    )


async def async_unload_entry(hass: HomeAssistant, entry: LegoConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        if entry.runtime_data.catalogue is not None:
            await entry.runtime_data.catalogue.async_save_if_dirty()
        await async_refresh_panel(hass)
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: LegoConfigEntry) -> None:
    """Drop the sidebar panel once the last entry is gone, and its repairs."""
    ir.async_delete_issue(hass, DOMAIN, paging_issue_id(entry.entry_id))
    ir.async_delete_issue(hass, DOMAIN, write_issue_id(entry.entry_id))
    if not hass.config_entries.async_entries(DOMAIN):
        # The set index and everyone's panel layout belong to no account once the
        # last one goes, so removing the integration leaves nothing behind.
        await Store[dict[str, Any]](hass, STORAGE_VERSION, STORAGE_KEY).async_remove()
        await hass.data[PANEL_STORE].async_remove()
    await async_refresh_panel(hass)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    entry: LegoConfigEntry,
    device_entry: AnyDeviceEntry,
) -> bool:
    """Refuse removal; the entry owns its only device, so delete the entry."""
    return False
