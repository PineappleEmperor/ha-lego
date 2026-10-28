"""Tests for the calls held back above the budget, to keep an account showing."""

import asyncio

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import (
    BRICKSET_DAILY_CALL_LIMIT,
    CONF_DAILY_CALL_BUDGET,
    DEFAULT_DAILY_CALL_BUDGET,
    KEEPALIVE_INTERVAL,
)
from custom_components.lego.exceptions import BricksetQuotaError
from custom_components.lego.quota import QuotaManager, reserve_calls_per_day

from .conftest import BricksetServer, setup_integration


def _collection_polls(brickset: BricksetServer) -> int:
    """Return the collection reads Brickset has answered: one owned, one wanted."""
    return len([call for call in brickset.get_sets_calls if "owned" in call])


def test_the_reserve_reaches_brickset_limit_only_when_drawn() -> None:
    """Past the budget a call is refused, unless it may draw on the reserve."""
    quota = QuotaManager(80)
    quota.record(80)
    with pytest.raises(BricksetQuotaError):
        quota.reserve(2)

    with quota.drawing_reserve():
        quota.reserve(BRICKSET_DAILY_CALL_LIMIT - 80)
        with pytest.raises(BricksetQuotaError):
            quota.reserve(BRICKSET_DAILY_CALL_LIMIT - 79)
    with pytest.raises(BricksetQuotaError):
        quota.reserve(2)


def test_the_reserve_a_day_never_passes_brickset_limit() -> None:
    """A poll every 6 h, cut to whatever the budget leaves of the 100."""
    assert reserve_calls_per_day(80, 2) == 8
    assert reserve_calls_per_day(95, 2) == 5
    assert reserve_calls_per_day(100, 2) == 0


async def test_drawing_on_the_reserve_does_not_leak_into_another_poll() -> None:
    """The collection drawing on it leaves the feeds' poll, alongside, on the budget."""
    quota = QuotaManager(10)
    quota.record(10)
    drawn = asyncio.Event()
    refused: list[bool] = []

    async def collection() -> None:
        with quota.drawing_reserve():
            drawn.set()
            await asyncio.sleep(0)
            quota.reserve(2)

    async def feeds() -> None:
        await drawn.wait()
        try:
            quota.reserve(1)
        except BricksetQuotaError:
            refused.append(True)

    await asyncio.gather(collection(), feeds())
    assert refused == [True]


@pytest.mark.usefixtures("spring")
async def test_a_first_setup_on_a_spent_budget_loads_from_the_reserve(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """With nothing saved to show, the budget being spent does not stop setup."""
    brickset.usage_today = DEFAULT_DAILY_CALL_BUDGET
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.LOADED
    assert mock_config_entry.runtime_data.collection.data.owned
    assert mock_config_entry.runtime_data.quota.calls_today > DEFAULT_DAILY_CALL_BUDGET


@pytest.mark.usefixtures("spring")
async def test_setup_waits_on_brickset_own_limit_with_nothing_saved(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Once all 100 are spent, setup retries, saying why, and spends nothing."""
    brickset.usage_today = BRICKSET_DAILY_CALL_LIMIT
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.state is ConfigEntryState.SETUP_RETRY
    assert "all 100 of today's are spent" in (mock_config_entry.reason or "")
    assert brickset.get_sets_calls == []


@pytest.mark.usefixtures("spring")
async def test_a_spent_budget_keeps_the_collection_current_every_few_hours(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Polls the budget cannot cover wait, until the data is hours old."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    planned = collection.planned_interval
    assert planned is not None
    assert planned < KEEPALIVE_INTERVAL
    synced = collection.last_synced
    assert synced is not None
    polls = _collection_polls(brickset)

    brickset.usage_today = DEFAULT_DAILY_CALL_BUDGET
    while collection.last_synced == synced:
        freezer.tick(planned)
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
        if collection.last_synced == synced:
            # Served from what it has, not polled.
            assert _collection_polls(brickset) == polls
            assert collection.last_update_success

    assert collection.last_synced is not None
    assert collection.last_synced - synced >= KEEPALIVE_INTERVAL
    assert _collection_polls(brickset) > polls


@pytest.mark.usefixtures("spring")
async def test_raising_the_budget_polls_again_at_once(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A budget raised once it is spent lets the waiting poll go ahead on the save."""
    await setup_integration(hass, mock_config_entry)
    planned = mock_config_entry.runtime_data.collection.planned_interval
    assert planned is not None
    brickset.usage_today = DEFAULT_DAILY_CALL_BUDGET
    freezer.tick(planned)
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    polls = _collection_polls(brickset)

    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_DAILY_CALL_BUDGET: 90},
    )
    # Saving the options form reloads the entry.
    assert await hass.config_entries.async_reload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert _collection_polls(brickset) > polls
