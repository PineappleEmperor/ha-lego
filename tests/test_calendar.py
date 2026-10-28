"""Tests for the LEGO calendars."""

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from .conftest import BricksetServer, make_set, setup_integration

RETIREMENTS = "calendar.brickset_brickfan_set_retirements"
RELEASES = "calendar.brickset_brickfan_set_releases"
ANNIVERSARIES = "calendar.brickset_brickfan_set_anniversaries"


async def _events(
    hass: HomeAssistant, entity_id: str, start: str, end: str
) -> list[dict]:
    """Fetch calendar events through the public action."""
    response = await hass.services.async_call(
        "calendar",
        "get_events",
        {"entity_id": entity_id, "start_date_time": start, "end_date_time": end},
        blocking=True,
        return_response=True,
    )
    return response[entity_id]["events"]


@pytest.mark.usefixtures("brickset")
async def test_retirement_events(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Sets with a published exit date land on the retirement calendar."""
    freezer.move_to("2099-01-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass, RETIREMENTS, "2099-12-01 00:00:00", "2100-01-05 00:00:00"
    )

    summaries = {event["summary"] for event in events}
    assert "10497-1 Galaxy Explorer retires" in summaries
    assert "10294-1 Titanic retires" in summaries
    # The 1990 set has no exit date, so it produces no event.
    assert not any("Alienator" in summary for summary in summaries)
    assert events[0]["start"] == "2099-12-31"
    by_summary = {event["summary"]: event for event in events}
    titanic = by_summary["10294-1 Titanic retires"]
    assert (titanic["start"], titanic["end"]) == ("2099-12-31", "2100-01-01")
    assert titanic["description"] == "https://brickset.com/sets/10294-1"


@pytest.mark.usefixtures("brickset")
async def test_release_events_cover_wanted_and_watched_themes(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Wanted sets and watched-theme sets both appear on the release calendar."""
    freezer.move_to("2023-06-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)

    events = await _events(hass, RELEASES, "2023-12-01 00:00:00", "2024-02-01 00:00:00")

    summaries = {event["summary"] for event in events}
    assert "10294-1 Titanic released" in summaries
    assert "42200-1 New Technic Thing released" in summaries
    technic = next(e for e in events if e["summary"].startswith("42200-1"))
    assert technic["start"] == "2024-01-01"
    assert technic["description"] == "https://brickset.com/sets/42200-1"


async def test_release_calendar_follows_feed_updates(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A new set in a watched theme moves the next release without a collection change."""
    freezer.move_to("2023-06-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)
    assert "Brand New Bricks" not in hass.states.get(RELEASES).attributes["message"]

    brickset.theme_sets.append(
        make_set(
            7,
            "42300-1",
            "Brand New Bricks",
            theme="Technic",
            year=2023,
            first_available="2023-06-10T00:00:00Z",
        )
    )
    await mock_config_entry.runtime_data.feeds.async_refresh()
    await hass.async_block_till_done()

    state = hass.states.get(RELEASES)
    assert state.attributes["message"] == "42300-1 Brand New Bricks released"
    assert state.attributes["start_time"].startswith("2023-06-10")


@pytest.mark.usefixtures("brickset")
async def test_anniversary_events(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Owned sets get a birthday each year, counted from their launch."""
    freezer.move_to("2030-06-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass, ANNIVERSARIES, "2030-12-25 00:00:00", "2031-01-05 00:00:00"
    )

    summaries = {event["summary"] for event in events}
    # Launched 2024-01-01, so 1 January 2031 is its seventh birthday.
    assert "Galaxy Explorer turns 7" in summaries
    # The 1990 set has no launch date, so it falls back to 1 January of its year.
    assert "Alienator turns 41" in summaries


@pytest.mark.usefixtures("brickset")
async def test_next_event_property(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """The calendar state points at the next upcoming event."""
    freezer.move_to("2099-12-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(RETIREMENTS)
    assert state.attributes["message"].endswith("retires")
    assert state.attributes["start_time"].startswith("2099-12-31")


async def test_empty_calendar_has_no_next_event(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A collection with no dated sets yields an empty calendar, not an error."""
    for record in (*brickset.owned, *brickset.wanted, *brickset.theme_sets):
        record["LEGOCom"] = {}

    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass,
        RETIREMENTS,
        dt_util.now().strftime("%Y-%m-%d %H:%M:%S"),
        # A year on by days: replacing the year has no 29 February to land on.
        (dt_util.now() + timedelta(days=365)).strftime("%Y-%m-%d %H:%M:%S"),
    )
    assert events == []
    assert hass.states.get(RETIREMENTS).state == "off"


async def test_leap_day_anniversary_falls_back_to_the_28th(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A 29 February launch produces an event on the 28th in non-leap years."""
    freezer.move_to("2025-01-01 12:00:00+00:00")
    brickset.owned = [
        make_set(
            77,
            "40777-1",
            "Leap Day Set",
            owned=True,
            qty_owned=1,
            year=2024,
            first_available="2024-02-29T00:00:00Z",
        )
    ]

    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass, ANNIVERSARIES, "2025-02-01 00:00:00", "2025-03-05 00:00:00"
    )

    assert [(event["summary"], event["start"]) for event in events] == [
        ("Leap Day Set turns 1", "2025-02-28")
    ]


async def test_calendar_ranges_include_their_first_day(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A retirement on the day a range starts is in that range."""
    day = dt_util.now().date() + timedelta(days=10)
    brickset.wanted[:] = [
        make_set(
            4,
            "10294-1",
            "Titanic",
            wanted=True,
            last_available=f"{day.isoformat()}T00:00:00Z",
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass,
        RETIREMENTS,
        f"{day.isoformat()} 00:00:00",
        f"{(day + timedelta(days=1)).isoformat()} 00:00:00",
    )

    assert [event["summary"] for event in events] == ["10294-1 Titanic retires"]


async def test_a_set_has_no_birthday_in_its_launch_year(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Its first anniversary is a year after launch, never "turns 0"."""
    launch = dt_util.now().date() - timedelta(days=30)
    brickset.owned[:] = [
        make_set(
            1,
            "10497-1",
            "Galaxy Explorer",
            owned=True,
            qty_owned=1,
            first_available=f"{launch.isoformat()}T00:00:00Z",
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    events = await _events(
        hass,
        ANNIVERSARIES,
        f"{(launch - timedelta(days=1)).isoformat()} 00:00:00",
        f"{(launch + timedelta(days=1)).isoformat()} 00:00:00",
    )

    assert events == []
