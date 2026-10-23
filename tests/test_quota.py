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

from custom_components.lego.api import pages_spent
from custom_components.lego.const import BRICKSET_DAILY_CALL_LIMIT
from custom_components.lego.exceptions import BricksetQuotaError
from custom_components.lego.panel import dashboard_payload
from custom_components.lego.quota import (
    QuotaManager,
    collection_interval,
    feed_years,
    feeds_calls_per_day,
    feeds_poll_estimate,
    poll_window_years,
    window_years,
)

from .conftest import BricksetServer, make_set, setup_integration


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
    ("budget", "poll_cost", "feeds_calls", "hours"),
    [
        (80, 2, 2, 1),
        (80, 2, 0, 1),
        (80, 4, 2, 2),
        (20, 2, 2, 4),
        (100, 2, 2, 1),
        # Nothing fits a budget this small, so it polls once a day regardless.
        (4, 2, 2, 24),
    ],
)
def test_collection_interval_fits_the_budget(
    budget: int, poll_cost: int, feeds_calls: int, hours: int
) -> None:
    """The interval is the shortest whose polls stay inside three quarters of it."""
    assert collection_interval(budget, poll_cost, feeds_calls) == (
        timedelta(hours=hours)
    )


def test_feeds_take_their_share_of_the_budget() -> None:
    """What the feeds spend comes out of the collection's share."""
    # A budget of 68 leaves 51 for polls: 48 hourly collection calls fit beside
    # 2 feed calls a day but not 4, so with 4 the collection polls every 2 hours.
    assert collection_interval(68, 2, 2) == timedelta(hours=1)
    assert collection_interval(68, 2, 4) == timedelta(hours=2)


@pytest.mark.parametrize(
    ("today", "years"),
    [
        # The window reaches back into last year until 28 January.
        (date(2026, 1, 1), [2025, 2026]),
        (date(2026, 1, 28), [2025, 2026]),
        (date(2026, 1, 29), [2026]),
        (date(2026, 6, 15), [2026]),
        # It reaches on into next year from 4 December.
        (date(2026, 12, 3), [2026]),
        (date(2026, 12, 4), [2026, 2027]),
        (date(2026, 12, 31), [2026, 2027]),
        # Leap years move neither edge.
        (date(2028, 1, 28), [2027, 2028]),
        (date(2028, 1, 29), [2028]),
        (date(2028, 2, 29), [2028]),
        (date(2028, 12, 4), [2028, 2029]),
    ],
)
def test_window_years_follow_four_weeks_either_side(
    today: date, years: list[int]
) -> None:
    """The release rows ask for a year only while the window touches it."""
    assert window_years(today) == years


@pytest.mark.parametrize(
    ("today", "years"),
    [
        # A daily poll reads a day ahead: 3 December's covers 4 December's window.
        (date(2026, 12, 2), [2026]),
        (date(2026, 12, 3), [2026, 2027]),
        # And keeps last year through the 28 January poll, which 28 January needs.
        (date(2026, 1, 28), [2025, 2026]),
        (date(2026, 1, 29), [2026]),
    ],
)
def test_poll_window_years_look_a_poll_ahead(today: date, years: list[int]) -> None:
    """The window is cut when viewed, up to a day after the poll that fed it."""
    assert poll_window_years(today) == years


@pytest.mark.parametrize(
    ("today", "releases", "next_year", "years"),
    [
        # The followed themes alone need this year, and next once announced.
        (date(2026, 1, 10), False, False, [2026]),
        (date(2026, 10, 1), False, True, [2026, 2027]),
        # All themes add last year while the window reaches it.
        (date(2026, 1, 10), True, False, [2025, 2026]),
        # Next year is skipped while nothing is filed under it, window or not.
        (date(2026, 12, 10), True, False, [2026]),
        (date(2026, 12, 10), True, True, [2026, 2027]),
        (date(2026, 6, 15), True, True, [2026, 2027]),
    ],
)
def test_feed_years(
    today: date, releases: bool, next_year: bool, years: list[int]
) -> None:
    """A poll asks for each year it needs once, and none it does not."""
    assert feed_years(today, releases, next_year) == years


@pytest.mark.parametrize(
    ("today", "themes", "releases", "cost"),
    [
        (date(2026, 5, 15), False, False, 0),
        # One batched call a year for the followed themes, next year from September.
        (date(2026, 8, 31), True, False, 1),
        (date(2026, 9, 1), True, False, 2),
        # Three pages a whole year, one for next year's early announcements.
        (date(2026, 5, 15), False, True, 3),
        (date(2026, 9, 1), True, True, 4),
        # January reads last year whole too.
        (date(2026, 1, 10), False, True, 6),
        (date(2026, 12, 10), False, True, 4),
    ],
)
def test_feeds_poll_estimate(
    today: date, themes: bool, releases: bool, cost: int
) -> None:
    """Before a poll has measured its pages, the budget plans on these."""
    assert feeds_poll_estimate(today, themes, releases) == cost


def test_feeds_calls_per_day() -> None:
    """Themes alone poll twice a day; reading whole years, once."""
    spring = date(2026, 5, 15)
    assert feeds_calls_per_day(False, False, spring) == 0
    assert feeds_calls_per_day(True, False, spring) == 2
    assert feeds_calls_per_day(True, True, spring) == 3
    # A measured poll replaces the estimate.
    assert feeds_calls_per_day(False, True, spring, measured=2) == 2
    assert feeds_calls_per_day(True, False, spring, measured=3) == 6


def test_resets_at_midnight_utc(freezer: FrozenDateTimeFactory) -> None:
    """Brickset's day ends at midnight UTC."""
    freezer.move_to("2026-08-05 22:30:00+00:00")
    assert QuotaManager(80).resets_at.isoformat() == "2026-08-06T00:00:00+00:00"


@pytest.mark.parametrize(
    ("count", "pages"),
    [
        # Paging stops at the first short page: an empty list still costs a call,
        # and a full page costs one more to learn it was the last.
        (0, 1),
        (1, 1),
        (499, 1),
        (500, 2),
        (600, 2),
        (1000, 3),
        # The cap bounds a bad day.
        (10_000, 10),
    ],
)
def test_pages_spent(count: int, pages: int) -> None:
    """The budget plans on the calls paging really makes."""
    assert pages_spent(count) == pages


@pytest.mark.parametrize(
    ("owned", "wanted", "calls"),
    [(3, 1, 2), (0, 0, 2), (500, 0, 3), (600, 0, 3), (1000, 3, 4)],
)
async def test_collection_poll_cost_matches_the_calls_it_makes(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    owned: int,
    wanted: int,
    calls: int,
) -> None:
    """What a poll is planned to cost is what the next poll spends."""
    brickset.owned[:] = [
        make_set(10_000 + n, f"{70000 + n}-1", f"Owned {n}", owned=True, qty_owned=1)
        for n in range(owned)
    ]
    brickset.wanted[:] = [
        make_set(20_000 + n, f"{80000 + n}-1", f"Wanted {n}", wanted=True)
        for n in range(wanted)
    ]
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    assert collection.poll_cost == calls

    before = len(brickset.get_sets_calls)
    await collection.async_refresh()
    spent = brickset.get_sets_calls[before:]

    assert len([c for c in spent if c.get("owned") or c.get("wanted")]) == calls
    # The panel's Update now quotes the same cost.
    payload = dashboard_payload(mock_config_entry, [], [])
    assert payload["quota"]["refresh_cost"] == calls


async def test_brickset_usage_is_rechecked_at_most_every_half_hour(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """The free usage check is rate limited, so polls do not hammer it."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    checks = brickset.usage_checks

    freezer.tick(timedelta(minutes=10))
    await collection.async_refresh()
    assert brickset.usage_checks == checks

    freezer.tick(timedelta(minutes=21))
    await collection.async_refresh()
    assert brickset.usage_checks == checks + 1
