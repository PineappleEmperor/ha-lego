"""Tests for the LEGO calendars."""

from __future__ import annotations

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
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


async def test_retirement_events(
    hass: HomeAssistant,
    brickset: BricksetServer,
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


async def test_release_events_cover_wanted_and_watched_themes(
    hass: HomeAssistant,
    brickset: BricksetServer,
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


async def test_anniversary_events(
    hass: HomeAssistant,
    brickset: BricksetServer,
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


async def test_next_event_property(
    hass: HomeAssistant,
    brickset: BricksetServer,
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
        (dt_util.now().replace(year=dt_util.now().year + 1)).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
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
