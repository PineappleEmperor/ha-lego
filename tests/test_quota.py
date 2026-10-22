"""Tests for the Brickset daily call budget."""

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import BRICKSET_DAILY_CALL_LIMIT
from custom_components.lego.exceptions import BricksetQuotaError
from custom_components.lego.quota import QuotaManager, collection_interval

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
    quota.sync({dt_util.utcnow().date(): 40})

    assert quota.calls_today == 40

    # A lower server figure does not erase locally known calls.
    quota.record()
    quota.sync({dt_util.utcnow().date(): 40})
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


async def test_spent_budget_pauses_polling_until_the_reset(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A spent budget makes entities unavailable and holds polls until midnight UTC."""
    freezer.move_to("2026-08-05 10:00:00+00:00")
    await setup_integration(hass, mock_config_entry)
    coordinator = mock_config_entry.runtime_data.collection
    owned = "sensor.brickset_brickfan_sets_owned"
    calls = "sensor.brickset_brickfan_brickset_calls_today"
    assert hass.states.get(owned).state == "4"

    # Pretend the key has been hammered by something else today.
    mock_config_entry.runtime_data.quota.record(100)

    freezer.tick(timedelta(hours=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    # Cached data would read as current, so the entities go unavailable instead,
    # while the calls sensor stays up to say why.
    assert not coordinator.last_update_success
    assert hass.states.get(owned).state == STATE_UNAVAILABLE
    assert hass.states.get(calls).state != STATE_UNAVAILABLE

    # Hourly polls would fail the same way, so none is made before the reset.
    made = len(brickset.get_sets_calls)
    freezer.tick(timedelta(hours=6))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(brickset.get_sets_calls) == made
    assert hass.states.get(owned).state == STATE_UNAVAILABLE

    freezer.move_to("2026-08-06 00:00:30+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert coordinator.last_update_success
    assert hass.states.get(owned).state == "4"


@pytest.mark.parametrize(
    ("budget", "poll_cost", "watching_themes", "hours"),
    [
        (80, 2, True, 1),
        (80, 2, False, 1),
        (80, 4, True, 2),
        (20, 2, True, 4),
        (100, 2, True, 1),
        # Nothing fits a budget this small, so it polls once a day regardless.
        (4, 2, True, 24),
    ],
)
def test_collection_interval_fits_the_budget(
    budget: int, poll_cost: int, watching_themes: bool, hours: int
) -> None:
    """The interval is the shortest whose polls stay inside three quarters of it."""
    assert collection_interval(budget, poll_cost, watching_themes) == timedelta(
        hours=hours
    )


def test_seconds_until_reset_counts_to_midnight_utc(
    freezer: FrozenDateTimeFactory,
) -> None:
    """Brickset's day ends at midnight UTC."""
    freezer.move_to("2026-08-05 22:30:00+00:00")
    assert QuotaManager(80).seconds_until_reset == 90 * 60
