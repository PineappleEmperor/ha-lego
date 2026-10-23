"""Tests for the Brickset daily call budget."""

from datetime import date, timedelta

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
from custom_components.lego.quota import (
    QuotaManager,
    collection_interval,
    feeds_calls_per_day,
    releases_calls_per_day,
)

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


async def test_spent_budget_keeps_cached_data_with_its_age(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A spent budget keeps the last sync's data, and Last synced shows its age."""
    freezer.move_to("2026-08-05 10:00:00+00:00")
    await setup_integration(hass, mock_config_entry)
    owned = "sensor.brickset_brickfan_sets_owned"
    synced = "sensor.brickset_brickfan_last_synced"
    assert hass.states.get(synced).state == "2026-08-05T10:00:00+00:00"

    # Pretend the key has been hammered by something else today.
    mock_config_entry.runtime_data.quota.record(100)
    brickset.owned = []

    freezer.tick(timedelta(hours=3))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    # The entities keep the last good data rather than going unavailable, and the
    # sync time stays where it was, which is how a dashboard tells it is stale.
    assert mock_config_entry.runtime_data.collection.last_update_success
    assert hass.states.get(owned).state == "4"
    assert hass.states.get(synced).state == "2026-08-05T10:00:00+00:00"

    freezer.move_to("2026-08-06 00:30:00+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    # After the reset the next poll lands, even though nothing it returned is
    # news to the sets sensors, and the sync time moves with it.
    assert hass.states.get(owned).state == "0"
    assert hass.states.get(synced).state == "2026-08-06T00:30:00+00:00"


async def test_unchanged_poll_still_moves_last_synced(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A poll that changes nothing still counts as a sync."""
    freezer.move_to("2026-08-05 10:00:00+00:00")
    await setup_integration(hass, mock_config_entry)
    calls = len(brickset.get_sets_calls)

    freezer.tick(timedelta(hours=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert len(brickset.get_sets_calls) > calls
    state = hass.states.get("sensor.brickset_brickfan_last_synced")
    assert state.state == "2026-08-05T11:00:00+00:00"


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
    spring = date(2026, 5, 15)
    assert collection_interval(budget, poll_cost, watching_themes, spring) == (
        timedelta(hours=hours)
    )


def test_autumn_feeds_take_their_share_of_the_budget() -> None:
    """Next year's call doubles the feed cost, which can stretch the collection."""
    spring, autumn = date(2026, 5, 15), date(2026, 10, 1)
    assert feeds_calls_per_day(True, spring) == 2
    assert feeds_calls_per_day(True, autumn) == 4
    assert feeds_calls_per_day(False, autumn) == 0
    # A budget of 68 leaves 51 for polls: 48 hourly collection calls fit beside the
    # 2 spring feed calls but not the 4 autumn ones, so autumn polls every 2 hours.
    assert collection_interval(68, 2, True, spring) == timedelta(hours=1)
    assert collection_interval(68, 2, True, autumn) == timedelta(hours=2)


def test_resets_at_midnight_utc(freezer: FrozenDateTimeFactory) -> None:
    """Brickset's day ends at midnight UTC."""
    freezer.move_to("2026-08-05 22:30:00+00:00")
    assert QuotaManager(80).resets_at.isoformat() == "2026-08-06T00:00:00+00:00"


def test_releases_calls_per_day() -> None:
    """The release feed costs its pages once a day, plus next year in autumn."""
    assert releases_calls_per_day(False, date(2026, 5, 15)) == 0
    assert releases_calls_per_day(True, date(2026, 5, 15)) == 3
    assert releases_calls_per_day(True, date(2026, 9, 1)) == 4
    # Once a poll has measured its pages, that replaces the estimate.
    assert releases_calls_per_day(True, date(2026, 5, 15), measured=1) == 1
    # Its calls come out of the collection's share: 60 less 3 still fits hourly,
    # while 18 less 3 leaves room for polls every 4 h instead of every 3 h.
    spring = date(2026, 5, 15)
    assert collection_interval(80, 2, False, spring, 3) == timedelta(hours=1)
    assert collection_interval(24, 2, False, spring) == timedelta(hours=3)
    assert collection_interval(24, 2, False, spring, 3) == timedelta(hours=4)
