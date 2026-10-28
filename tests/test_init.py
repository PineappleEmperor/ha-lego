"""Tests for LEGO config entry setup and teardown."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import (
    CONF_API_KEY,
    CONF_REGION,
    CONF_USERNAME,
    STATE_UNAVAILABLE,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    device_registry as dr,
    entity_registry as er,
    issue_registry as ir,
)
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_CATALOGUE_INTERVAL,
    CONF_SHARED,
    CONF_THEMES,
    CONF_USER_HASH,
    DOMAIN,
)

from .conftest import API_KEY, USER_HASH, USERNAME, BricksetServer, setup_integration


@pytest.mark.usefixtures("brickset")
async def test_migrate_watchlist_entry_to_the_wishlist(
    hass: HomeAssistant, entity_registry: er.EntityRegistry
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

    registry = entity_registry
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


@pytest.mark.usefixtures("brickset")
async def test_migrate_shares_an_account_made_before_users(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """An entry from before accounts had users stays open to every user."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=USERNAME,
        unique_id=USERNAME,
        version=2,
        minor_version=1,
        data=dict(mock_config_entry.data),
        options=dict(mock_config_entry.options),
    )

    await setup_integration(hass, entry)

    assert entry.state is ConfigEntryState.LOADED
    assert entry.minor_version == 3
    assert entry.options[CONF_SHARED] is True


@pytest.mark.parametrize(("saved", "kept"), [(7, 30), (14, 14), (None, None)])
@pytest.mark.usefixtures("brickset")
async def test_migrate_moves_the_old_weekly_index_refresh_to_monthly(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    saved: int | None,
    kept: int | None,
) -> None:
    """The weekly default saved by the old form goes monthly; a real choice stays."""
    options = dict(mock_config_entry.options)
    if saved is not None:
        options[CONF_CATALOGUE_INTERVAL] = saved
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=USERNAME,
        unique_id=USERNAME,
        version=2,
        minor_version=2,
        data=dict(mock_config_entry.data),
        options=options,
    )

    await setup_integration(hass, entry)

    assert entry.minor_version == 3
    assert entry.options.get(CONF_CATALOGUE_INTERVAL) == kept


async def test_migrate_refuses_an_entry_from_a_newer_version(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """A downgrade leaves an entry it cannot read alone."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=USERNAME,
        unique_id=USERNAME,
        version=3,
        data=dict(mock_config_entry.data),
        options=dict(mock_config_entry.options),
    )
    entry.add_to_hass(hass)

    await hass.config_entries.async_setup(entry.entry_id)

    assert entry.state is ConfigEntryState.MIGRATION_ERROR
    assert entry.options == mock_config_entry.options


@pytest.mark.usefixtures("brickset")
async def test_setup_creates_the_device(
    hass: HomeAssistant,
    device_registry: dr.DeviceRegistry,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The entry loads and creates its service device."""
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.LOADED

    devices = dr.async_entries_for_config_entry(
        device_registry, mock_config_entry.entry_id
    )
    assert len(devices) == 1
    assert devices[0].manufacturer == "Brickset"


async def test_unload_stops_polling(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Unloading leaves the entry not loaded and spends no more calls."""
    await setup_integration(hass, mock_config_entry)

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert mock_config_entry.state is ConfigEntryState.NOT_LOADED

    calls = len(brickset.get_sets_calls)
    freezer.tick(timedelta(days=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(brickset.get_sets_calls) == calls


@pytest.mark.usefixtures("brickset")
async def test_setup_two_entries(
    hass: HomeAssistant,
    device_registry: dr.DeviceRegistry,
    mock_config_entry: MockConfigEntry,
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


@pytest.mark.usefixtures("brickset")
async def test_removing_an_account_clears_its_repairs(
    hass: HomeAssistant,
    issue_registry: ir.IssueRegistry,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Neither the paging nor the rejected-write repair outlives its account."""
    entry = await setup_integration(hass, mock_config_entry)
    raised = {
        f"theme_feed_paging_{entry.entry_id}": (
            "theme_feed_paging",
            {"name": entry.title, "themes": "Technic", "pages": "2", "calls": "2"},
        ),
        f"collection_write_failed_{entry.entry_id}": (
            "collection_write_failed",
            {"name": entry.title, "error": "rejected"},
        ),
    }
    for issue_id, (key, placeholders) in raised.items():
        ir.async_create_issue(
            hass,
            DOMAIN,
            issue_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=key,
            translation_placeholders=placeholders,
        )
    issues = tuple(raised)

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    for issue_id in issues:
        assert issue_registry.async_get_issue(DOMAIN, issue_id) is None


@pytest.mark.usefixtures("brickset")
async def test_removing_the_last_account_deletes_the_stored_files(
    hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The set index and the panel layouts go with the last account, not before."""
    entry = await setup_integration(hass, mock_config_entry)
    second = MockConfigEntry(
        domain=DOMAIN,
        title="otherfan",
        unique_id="otherfan",
        version=2,
        minor_version=2,
        data={**mock_config_entry.data, CONF_USERNAME: "otherfan"},
        options=dict(mock_config_entry.options),
    )
    await setup_integration(hass, second)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "rows": ["wishlist", "collection"]}
    )
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert {"lego_catalogue", "lego_panel"} <= hass_storage.keys()

    await hass.config_entries.async_remove(second.entry_id)
    await hass.async_block_till_done()
    assert {"lego_catalogue", "lego_panel"} <= hass_storage.keys()

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert "lego_catalogue" not in hass_storage
    assert "lego_panel" not in hass_storage


@pytest.mark.usefixtures("brickset")
async def test_an_options_write_outside_the_flow_needs_no_reload(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Options are read live, so a write from the panel takes effect in place."""
    # Only the options flow reloads the entry; following a theme writes the options
    # directly, and a reload would spend a collection poll.
    await setup_integration(hass, mock_config_entry)
    runtime = mock_config_entry.runtime_data

    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_REGION: "US"},
    )
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert mock_config_entry.runtime_data is runtime
    assert runtime.collection.region == "US"


@pytest.mark.usefixtures("brickset")
async def test_device_removal_refused(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    device_registry: dr.DeviceRegistry,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Deleting the service device from the UI is refused while its entry exists."""
    assert await async_setup_component(hass, "config", {})
    await setup_integration(hass, mock_config_entry)
    device = dr.async_entries_for_config_entry(
        device_registry, mock_config_entry.entry_id
    )[0]

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "config/device_registry/remove", "device_id": device.id}
    )
    response = await client.receive_json()

    assert not response["success"]
    assert "rejected by integration" in response["error"]["message"]
    assert device_registry.async_get(device.id) is not None


@pytest.mark.usefixtures("brickset")
async def test_user_hash_is_used_not_password(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Only the stored token reaches Brickset; no password is ever held."""
    await setup_integration(hass, mock_config_entry)

    assert "password" not in mock_config_entry.data
    assert mock_config_entry.data[CONF_USER_HASH] == USER_HASH


async def test_a_failed_poll_after_setup_makes_entities_unavailable(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A Brickset failure is not shown as current data; recovery brings it back."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    owned = "sensor.lego_brickfan_sets_owned"
    assert hass.states.get(owned).state == "4"

    brickset.get_sets_error = "Something broke upstream"
    await collection.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(owned).state == STATE_UNAVAILABLE

    brickset.get_sets_error = None
    await collection.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(owned).state == "4"


async def test_an_expired_token_after_setup_asks_to_reconnect(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A password changed on Brickset mid-run starts a reauth, not silent failure."""
    await setup_integration(hass, mock_config_entry)

    brickset.hash_valid = False
    await mock_config_entry.runtime_data.collection.async_refresh()
    await hass.async_block_till_done()

    flows = hass.config_entries.flow.async_progress_by_handler(DOMAIN)
    assert [flow["context"]["source"] for flow in flows] == ["reauth"]
