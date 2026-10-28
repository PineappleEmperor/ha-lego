"""Tests for keeping each account's polls across restarts."""

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.models import LegoSet
from custom_components.lego.poll_cache import poll_cache_key

from .conftest import OWNED_SETS, WANTED_SETS, BricksetServer, setup_integration


def _billed(brickset: BricksetServer) -> int:
    """Return the getSets calls a poll would bill, leaving out lookups by number."""
    return len([call for call in brickset.get_sets_calls if "setNumber" not in call])


async def _restart(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Unload and set the entry up again, as a restart or an options save does."""
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)


def test_a_saved_set_reads_back_the_same() -> None:
    """Every field of a set survives the trip through the saved file."""
    for record in (*OWNED_SETS, *WANTED_SETS):
        lego_set = LegoSet.from_api(record)
        assert LegoSet.from_store(lego_set.to_store()) == lego_set


@pytest.mark.usefixtures("spring")
async def test_a_restart_shows_the_saved_polls_without_calling(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Data younger than the interval is shown at once, and the poll waits its turn."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    owned = [item.number for item in collection.data.owned]
    planned = collection.planned_interval
    assert planned is not None
    before = _billed(brickset)

    freezer.tick(timedelta(minutes=20))
    await _restart(hass, mock_config_entry)

    collection = mock_config_entry.runtime_data.collection
    assert _billed(brickset) == before
    assert [item.number for item in collection.data.owned] == owned
    assert hass.states.get("sensor.lego_brickfan_sets_owned").state == str(
        collection.data.summary.sets_owned
    )
    # The first poll comes when the one before the restart would have been followed.
    assert collection.update_interval == planned - timedelta(minutes=20)
    assert collection.planned_interval == planned
    # The day's count still comes from Brickset, which costs nothing.
    assert brickset.usage_checks >= 2

    freezer.tick(planned - timedelta(minutes=19))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert _billed(brickset) > before
    assert collection.update_interval == planned


@pytest.mark.usefixtures("spring")
async def test_a_restart_after_the_interval_polls_at_once(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Saved data older than the interval is refreshed on setup."""
    await setup_integration(hass, mock_config_entry)
    planned = mock_config_entry.runtime_data.collection.planned_interval
    assert planned is not None
    before = _billed(brickset)

    freezer.tick(planned + timedelta(minutes=1))
    await _restart(hass, mock_config_entry)

    assert _billed(brickset) > before


@pytest.mark.usefixtures("spring")
async def test_a_restart_on_a_spent_budget_shows_the_saved_polls(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A restart once the budget is spent keeps the account, on what it last saw."""
    await setup_integration(hass, mock_config_entry)
    planned = mock_config_entry.runtime_data.collection.planned_interval
    assert planned is not None
    owned = len(mock_config_entry.runtime_data.collection.data.owned)

    brickset.usage_today = 100
    freezer.tick(planned + timedelta(minutes=1))
    await _restart(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert len(mock_config_entry.runtime_data.collection.data.owned) == owned
    assert hass.states.get("sensor.lego_brickfan_sets_owned").state != "unavailable"


@pytest.mark.usefixtures("spring", "brickset")
async def test_a_write_from_the_panel_is_saved_too(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A set marked between polls is still marked after a restart."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    wanted = collection.data.wanted[0]
    collection.apply_collection_change(wanted, want=False)

    await _restart(hass, mock_config_entry)

    numbers = {
        item.number for item in mock_config_entry.runtime_data.collection.data.wanted
    }
    assert wanted.number not in numbers


@pytest.mark.usefixtures("spring")
async def test_saved_data_it_cannot_read_is_ignored(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    hass_storage: dict[str, Any],
) -> None:
    """A file from some other shape of the data means a poll, not a failed setup."""
    hass_storage[poll_cache_key(mock_config_entry.entry_id)] = {
        "version": 1,
        "data": {
            "collection": {"synced": "2026-05-15T11:59:00+00:00", "data": {"sets": 3}}
        },
    }
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert _billed(brickset) > 0
    assert mock_config_entry.runtime_data.collection.data.owned


@pytest.mark.usefixtures("brickset")
async def test_removing_the_account_deletes_its_saved_polls(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    hass_storage: dict[str, Any],
) -> None:
    """Nothing of an account is left behind once it is removed."""
    await setup_integration(hass, mock_config_entry)
    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    assert poll_cache_key(mock_config_entry.entry_id) in hass_storage

    await hass.config_entries.async_remove(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert poll_cache_key(mock_config_entry.entry_id) not in hass_storage
