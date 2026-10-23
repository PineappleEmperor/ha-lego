"""Tests for the all-themes release feed behind the panel's release rows."""

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import CONF_REGION
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_DAILY_CALL_BUDGET,
    CONF_RELEASES,
    CONF_THEMES,
)
from custom_components.lego.panel import dashboard_payload

from .conftest import BricksetServer, make_set, setup_integration


def _with_releases(entry: MockConfigEntry) -> MockConfigEntry:
    """Switch the release rows on for the fixture entry."""
    return MockConfigEntry(
        domain=entry.domain,
        title=entry.title,
        unique_id=entry.unique_id,
        version=entry.version,
        data=dict(entry.data),
        options={CONF_REGION: "UK", CONF_THEMES: [], CONF_RELEASES: True},
    )


def _dated(set_id: int, name: str, day: str, **kwargs: object) -> dict[str, object]:
    """Build a 2026 set that went, or goes, on sale in the UK on a given day."""
    return make_set(
        set_id,
        f"{set_id}-1",
        name,
        year=2026,
        first_available=f"{day}T00:00:00Z",
        **kwargs,  # type: ignore[arg-type]
    )


def _year_calls(brickset: BricksetServer) -> list[dict[str, object]]:
    """Return the year-only getSets calls the release feed made."""
    return [
        call
        for call in brickset.get_sets_calls
        if "year" in call and "theme" not in call
    ]


async def _dashboard(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> dict[str, object]:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    result: dict[str, object] = (await client.receive_json())["result"]
    return result


async def test_existing_entries_keep_the_rows_off(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An entry from before the option spends nothing and offers no release rows."""
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.runtime_data.releases is None
    assert _year_calls(brickset) == []
    assert (await _dashboard(hass, hass_ws_client))["releases"] is None


async def test_rows_split_out_recently_and_coming_soon(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Four weeks either side of today, newest out first and soonest due first."""
    # The suite runs on 15 May 2026.
    brickset.year_sets[:] = [
        _dated(1, "Out in March", "2026-03-01"),
        _dated(2, "Out in late April", "2026-04-20"),
        _dated(3, "Out today", "2026-05-15"),
        _dated(4, "Out in May", "2026-05-01"),
        _dated(5, "Due in June", "2026-06-10"),
        _dated(6, "Due next week", "2026-05-20"),
        _dated(7, "Due in August", "2026-08-01"),
        _dated(8, "A keyring", "2026-05-10", category="Gear"),
        # No UK date yet, so Brickset's set-wide launch date stands in.
        make_set(
            10,
            "10-1",
            "Due worldwide",
            year=2026,
            first_available=None,
            launch_date="2026-05-25T00:00:00Z",
        ),
        make_set(9, "9-1", "Undated", year=2026, first_available=None),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    releases = (await _dashboard(hass, hass_ws_client))["releases"]

    assert isinstance(releases, dict)
    assert [item["name"] for item in releases["recent"]] == [
        "Out today",
        "Out in May",
        "Out in late April",
    ]
    assert [item["name"] for item in releases["upcoming"]] == [
        "Due next week",
        "Due worldwide",
        "Due in June",
    ]
    # The card shows the date the row was sorted by, not "Date unknown".
    assert releases["upcoming"][1]["available_from"] == "2026-05-25"
    assert releases["status"] == "ready"
    assert entry.runtime_data.releases is not None


async def test_feed_pages_through_the_year(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Each page is a billed call, and the next poll is costed from the last."""
    brickset.year_sets[:] = [
        _dated(1000 + n, f"Set {n}", "2026-05-01") for n in range(600)
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["pageNumber"] for call in _year_calls(brickset)] == [1, 2]
    releases = entry.runtime_data.releases
    assert releases is not None
    assert len(releases.data) == 600
    assert releases.poll_cost == 2
    assert releases.measured_cost == 2

    # The options dialog counts the measured pages, not the estimate of three:
    # 24 hourly collection polls of 2, plus 2 for releases.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["description_placeholders"]["estimated_calls"] == "50"


async def test_autumn_adds_next_year(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """From September next year's sets join, since January's wave lands early."""
    freezer.move_to("2026-12-20 12:00:00+00:00")
    brickset.year_sets[:] = [
        _dated(1, "December set", "2026-12-01"),
        make_set(
            2,
            "2-1",
            "New Year set",
            year=2027,
            first_available="2027-01-01T00:00:00Z",
        ),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["year"] for call in _year_calls(brickset)] == [2026, 2027]
    # Read directly: the websocket client's token has expired by December.
    releases = dashboard_payload(entry, [], [])["releases"]
    assert isinstance(releases, dict)
    assert [item["name"] for item in releases["recent"]] == ["December set"]
    assert [item["name"] for item in releases["upcoming"]] == ["New Year set"]
    feed = entry.runtime_data.releases
    assert feed is not None
    assert feed.poll_cost == 2


@pytest.mark.usefixtures("brickset")
async def test_rows_say_when_not_yet_fetched(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Empty rows before the first fetch are not passed off as a quiet month."""
    entry = await setup_integration(hass, _with_releases(mock_config_entry))
    releases = entry.runtime_data.releases
    assert releases is not None
    releases.data = None  # as it is until the background fetch returns

    rows = dashboard_payload(entry, [], [])["releases"]

    assert rows == {"recent": [], "upcoming": [], "status": "fetching"}


async def test_feed_spends_nothing_it_cannot_finish(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A poll that would run out of budget part way spends none of it."""
    brickset.year_sets[:] = [_dated(1, "Out today", "2026-05-15")]
    entry = _with_releases(mock_config_entry)
    # The collection's 2 calls leave 2 of 4, short of the 3 pages estimated.
    entry = MockConfigEntry(
        domain=entry.domain,
        title=entry.title,
        unique_id=entry.unique_id,
        version=entry.version,
        data=dict(entry.data),
        options={**entry.options, CONF_DAILY_CALL_BUDGET: 4},
    )
    await setup_integration(hass, entry)

    assert _year_calls(brickset) == []
    releases = entry.runtime_data.releases
    assert releases is not None
    # Nothing to show yet, so it tries again in hours rather than tomorrow.
    assert releases.update_interval == timedelta(hours=3)
    rows = dashboard_payload(entry, [], [])["releases"]
    assert rows == {"recent": [], "upcoming": [], "status": "failed"}
