"""Tests for the Brickset daily call budget."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import BRICKSET_DAILY_CALL_LIMIT
from custom_components.lego.exceptions import BricksetQuotaError
from custom_components.lego.quota import QuotaManager

from .conftest import BricksetServer, setup_integration


def test_reserve_and_record() -> None:
    """Reserving succeeds until the budget is spent."""
    quota = QuotaManager(3)
    for _ in range(3):
        quota.reserve()
        quota.record()

    assert quota.calls_today == 3
    assert quota.remaining == 0
    with pytest.raises(BricksetQuotaError):
        quota.reserve()


def test_budget_capped_at_brickset_limit() -> None:
    """A budget above Brickset's own ceiling is clamped."""
    assert QuotaManager(500).budget == BRICKSET_DAILY_CALL_LIMIT


def test_sync_prefers_the_higher_server_count() -> None:
    """Calls made by other tools on the same key still count."""
    quota = QuotaManager(80)
    quota.record()
    quota.sync({dt_util.now().date(): 40})

    assert quota.calls_today == 40

    # A lower server figure does not erase locally known calls.
    quota.record()
    quota.sync({dt_util.now().date(): 40})
    assert quota.calls_today == 41


def test_tally_resets_on_a_new_day(freezer: FrozenDateTimeFactory) -> None:
    """The local tally rolls over at midnight."""
    freezer.move_to("2026-08-05 10:00:00+00:00")
    quota = QuotaManager(80)
    quota.record(10)
    assert quota.calls_today == 10

    freezer.move_to("2026-08-06 10:00:00+00:00")
    assert quota.calls_today == 0
    assert quota.remaining == 80


async def test_poll_stops_at_budget_but_keeps_data(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Once the budget is spent, entities keep the last good data."""
    await setup_integration(hass, mock_config_entry)

    coordinator = mock_config_entry.runtime_data.collection
    assert coordinator.last_update_success
    first = coordinator.data

    # Pretend the key has been hammered by something else today.
    mock_config_entry.runtime_data.quota.record(100)
    brickset.owned = []

    freezer.tick(timedelta(hours=7))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    # No new fetch happened, so the previous data survives and entities stay up.
    assert coordinator.last_update_success
    assert coordinator.data is first
    assert coordinator.data.summary.sets_owned == 4
