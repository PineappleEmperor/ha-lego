"""Tests for LEGO config entry setup and teardown."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_API_KEY, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lego import async_remove_config_entry_device
from custom_components.lego.const import (
    CONF_REGION,
    CONF_THEMES,
    CONF_USER_HASH,
    DOMAIN,
)

from .conftest import API_KEY, USER_HASH, USERNAME, BricksetServer, setup_integration


async def test_migrate_watchlist_entry_to_the_wishlist(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
    """A version 1 entry loses the watchlist option and the sensors it created."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=USERNAME,
        unique_id=USERNAME,
        version=1,
        data={
            CONF_API_KEY: API_KEY,
            CONF_USERNAME: USERNAME,
            CONF_USER_HASH: USER_HASH,
        },
        options={CONF_REGION: "UK", CONF_THEMES: [], "watchlist": ["10294-1"]},
    )
    entry.add_to_hass(hass)

    registry = er.async_get(hass)
    legacy = [
        registry.async_get_or_create(
            "sensor", DOMAIN, f"{entry.entry_id}_watch_{number}", config_entry=entry
        )
        for number in ("10294-1", "10497-1")
    ]

    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)

    assert entry.state is ConfigEntryState.LOADED
    assert entry.version == 2
    assert "watchlist" not in entry.options

    assert all(registry.async_get(item.entity_id) is None for item in legacy)


async def test_setup_and_unload(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The entry loads, creates its device, and unloads cleanly."""
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.LOADED

    devices = dr.async_entries_for_config_entry(
        dr.async_get(hass), mock_config_entry.entry_id
    )
    assert len(devices) == 1
    assert devices[0].manufacturer == "Brickset"

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert mock_config_entry.state is ConfigEntryState.NOT_LOADED


async def test_setup_two_entries(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Two Brickset accounts load side by side."""
    second = MockConfigEntry(
        domain=DOMAIN,
        title="otherfan",
        unique_id="otherfan",
        data={
            CONF_API_KEY: "second-key",
            CONF_USERNAME: "otherfan",
            CONF_USER_HASH: "second-hash",
        },
        version=2,
        options={CONF_REGION: "US", CONF_THEMES: []},
    )

    await setup_integration(hass, mock_config_entry)
    await setup_integration(hass, second)

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert second.state is ConfigEntryState.LOADED

    device_registry = dr.async_get(hass)
    assert len(dr.async_entries_for_config_entry(device_registry, second.entry_id)) == 1


async def test_setup_retries_on_api_error(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A Brickset-side failure leaves the entry in SETUP_RETRY, not errored out."""
    brickset.get_sets_error = "Something broke upstream"

    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.SETUP_RETRY


async def test_setup_starts_reauth_on_bad_hash(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A rejected user hash raises ConfigEntryAuthFailed and starts a reauth flow."""
    brickset.hash_valid = False

    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.SETUP_ERROR
    flows = hass.config_entries.flow.async_progress_by_handler(DOMAIN)
    assert [flow["context"]["source"] for flow in flows] == ["reauth"]


async def test_options_update_reloads(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Changing options reloads the entry so coordinators pick them up."""
    await setup_integration(hass, mock_config_entry)

    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_REGION: "US"},
    )
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert mock_config_entry.runtime_data.collection.region == "US"


async def test_device_removal_refused(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The service device cannot be removed while the entry is loaded."""
    await setup_integration(hass, mock_config_entry)
    device = dr.async_entries_for_config_entry(
        dr.async_get(hass), mock_config_entry.entry_id
    )[0]

    assert (
        await async_remove_config_entry_device(hass, mock_config_entry, device) is False
    )


async def test_user_hash_is_used_not_password(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Only the stored token reaches Brickset; no password is ever held."""
    await setup_integration(hass, mock_config_entry)

    assert "password" not in mock_config_entry.data
    assert mock_config_entry.data[CONF_USER_HASH] == USER_HASH
