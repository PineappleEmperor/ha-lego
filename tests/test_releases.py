"""Tests for following releases across all themes, behind the panel's release rows."""

from datetime import date, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_REGION
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_DAILY_CALL_BUDGET,
    CONF_RELEASES,
    CONF_THEMES,
    DOMAIN,
    EVENT_NEW_SET,
)
from custom_components.lego.diagnostics import async_get_config_entry_diagnostics
from custom_components.lego.panel import dashboard_payload

from .conftest import BricksetServer, make_set, setup_integration


def _with_releases(entry: MockConfigEntry, **options: Any) -> MockConfigEntry:
    """Return the fixture's account following releases across all themes."""
    return MockConfigEntry(
        domain=entry.domain,
        title=entry.title,
        unique_id=entry.unique_id,
        version=entry.version,
        data=dict(entry.data),
        options={CONF_REGION: "UK", CONF_THEMES: [], CONF_RELEASES: True, **options},
    )


def _on(day: date, set_id: int, name: str, **kwargs: Any) -> dict[str, Any]:
    """Build a set that goes on sale in the UK on a day, filed under its year."""
    return make_set(
        set_id,
        f"{set_id}-1",
        name,
        year=day.year,
        first_available=f"{day.isoformat()}T00:00:00Z",
        **kwargs,
    )


def _year_calls(brickset: BricksetServer) -> list[dict[str, Any]]:
    """Return the whole-year getSets calls the feeds made."""
    return [
        call
        for call in brickset.get_sets_calls
        if "year" in call and "theme" not in call
    ]


def _rows(entry: MockConfigEntry) -> dict[str, Any]:
    """Return the panel's release rows, by name, with their status."""
    rows = dashboard_payload(entry, [], [])["releases"]
    assert rows is not None
    return {
        "recent": [item["name"] for item in rows["recent"]],
        "upcoming": [item["name"] for item in rows["upcoming"]],
        "status": rows["status"],
    }


async def test_existing_entries_keep_the_rows_off(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An entry from before the option spends nothing and offers no release rows."""
    await setup_integration(hass, mock_config_entry)

    assert mock_config_entry.runtime_data.feeds.data.releases is None
    assert _year_calls(brickset) == []
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["releases"] is None


async def test_rows_keep_four_weeks_either_side(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The window's last days count, the day past them does not, on any date."""
    today = dt_util.now().date()

    def ago(days: int) -> date:
        return today - timedelta(days=days)

    def ahead(days: int) -> date:
        return today + timedelta(days=days)

    brickset.year_sets[:] = [
        _on(ago(29), 1, "Out 29 days ago"),
        _on(ago(28), 2, "Out 28 days ago"),
        _on(ago(10), 3, "Out 10 days ago"),
        _on(today, 4, "Out today"),
        _on(ahead(1), 5, "Due tomorrow"),
        _on(ahead(28), 6, "Due in 28 days"),
        _on(ahead(29), 7, "Due in 29 days"),
        _on(ago(5), 8, "A keyring", category="Gear"),
        make_set(9, "9-1", "Undated", year=today.year, first_available=None),
        # No UK date yet, so Brickset's set-wide launch date stands in.
        make_set(
            10,
            "10-1",
            "Due worldwide",
            year=ahead(3).year,
            first_available=None,
            launch_date=f"{ahead(3).isoformat()}T00:00:00Z",
        ),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert _rows(entry) == {
        "recent": ["Out today", "Out 10 days ago", "Out 28 days ago"],
        "upcoming": ["Due tomorrow", "Due worldwide", "Due in 28 days"],
        "status": "ready",
    }
    # The card shows the date the row was sorted by, not "Date unknown".
    rows = dashboard_payload(entry, [], [])["releases"]
    assert rows["upcoming"][1]["available_from"] == ahead(3).isoformat()


@pytest.mark.parametrize(
    ("now", "years", "recent", "upcoming"),
    [
        # Early January reaches back into last December.
        ("2026-01-10", [2025, 2026], ["New Year set", "December set"], []),
        # Late December reaches on into the January wave, once it is filed.
        ("2026-12-20", [2026, 2027], ["December set"], ["New Year set"]),
        # Mid-year needs only this year.
        ("2026-06-15", [2026], [], []),
    ],
)
async def test_rows_cross_the_new_year(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
    now: str,
    years: list[int],
    recent: list[str],
    upcoming: list[str],
) -> None:
    """Each poll asks for every year the window touches, and only those."""
    freezer.move_to(f"{now} 12:00:00+00:00")
    year = dt_util.now().year
    december = date(year - 1 if now.endswith("01-10") else year, 12, 15)
    brickset.year_sets[:] = [
        _on(december, 1, "December set"),
        _on(date(december.year + 1, 1, 1), 2, "New Year set"),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["year"] for call in _year_calls(brickset)] == years
    rows = _rows(entry)
    assert rows["recent"] == recent
    assert rows["upcoming"] == upcoming


async def test_december_skips_next_year_until_it_is_filed(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """getThemes, which is free, says next year holds nothing, so it costs nothing."""
    freezer.move_to("2026-12-20 12:00:00+00:00")
    brickset.year_sets[:] = [_on(date(2026, 12, 1), 1, "December set")]
    await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["year"] for call in _year_calls(brickset)] == [2026]


@pytest.mark.usefixtures("spring")
async def test_followed_themes_come_from_the_same_read(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Reading every theme already holds the followed ones; no call is spent on them.

    Mid-year, so the window reads this year alone.
    """
    today = dt_util.now().date()
    brickset.year_sets[:] = [
        _on(today, 1, "Technic set", theme="Technic"),
        _on(today, 2, "Icons set", theme="Icons"),
    ]
    entry = await setup_integration(
        hass, _with_releases(mock_config_entry, **{CONF_THEMES: ["Technic"]})
    )

    feeds = entry.runtime_data.feeds
    assert [s.name for s in feeds.data.themes["Technic"]] == ["Technic set"]
    assert [c for c in brickset.get_sets_calls if "theme" in c] == []
    assert len(_year_calls(brickset)) == 1
    diagnostics = (await async_get_config_entry_diagnostics(hass, entry))[
        "coordinators"
    ]["feeds"]
    assert diagnostics["release_sets"] == 2
    assert diagnostics["themes"] == {"Technic": 1}


@pytest.mark.usefixtures("spring")
async def test_feed_pages_through_the_year(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Each page is a billed call, and the budget plans on the pages measured.

    Mid-year, so the window reads this year alone.
    """
    today = dt_util.now().date()
    brickset.year_sets[:] = [_on(today, 1000 + n, f"Set {n}") for n in range(600)]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["pageNumber"] for call in _year_calls(brickset)] == [1, 2]
    feeds = entry.runtime_data.feeds
    assert len(feeds.data.releases) == 600
    assert feeds.measured_cost == 2

    # The options dialog counts the measured pages, not the estimate of three:
    # 24 hourly collection polls of 2, plus 2 for the year.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["description_placeholders"]["estimated_calls"] == "50"


@pytest.mark.usefixtures("brickset")
async def test_rows_say_when_not_yet_fetched(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Empty rows before the first fetch are not passed off as a quiet month."""
    entry = await setup_integration(hass, _with_releases(mock_config_entry))
    feeds = entry.runtime_data.feeds
    feeds.data = None  # as it is until the background fetch returns

    assert _rows(entry) == {"recent": [], "upcoming": [], "status": "fetching"}


async def test_feed_spends_nothing_it_cannot_finish(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A poll that would run out of budget part way spends none of it."""
    brickset.year_sets[:] = [_on(dt_util.now().date(), 1, "Out today")]
    # The collection's 2 calls leave 2 of 4, short of the 3 pages a year plans on.
    entry = await setup_integration(
        hass, _with_releases(mock_config_entry, **{CONF_DAILY_CALL_BUDGET: 4})
    )

    assert _year_calls(brickset) == []
    feeds = entry.runtime_data.feeds
    # Nothing to show yet, so it tries again in hours rather than tomorrow.
    assert feeds.update_interval == timedelta(hours=3)
    assert _rows(entry) == {"recent": [], "upcoming": [], "status": "failed"}


async def test_the_window_follows_local_time_while_the_budget_follows_utc(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Where it is New Year's Day locally, Brickset's day is still 31 December.

    "Out recently" is about the user's own today, so the window moves at local
    midnight; the call budget is Brickset's, which resets at midnight UTC.
    """
    await hass.config.async_set_time_zone("Pacific/Auckland")
    freezer.move_to("2026-12-31 12:00:00+00:00")  # 01:00 on 1 January in Auckland
    brickset.year_sets[:] = [
        _on(date(2026, 12, 20), 1, "December set"),
        _on(date(2027, 1, 1), 2, "New Year set"),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    # Local 1 January 2027: this year is 2027, and the window reaches back to 2026.
    assert [call["year"] for call in _year_calls(brickset)] == [2026, 2027]
    assert _rows(entry)["recent"] == ["New Year set", "December set"]
    quota = entry.runtime_data.quota
    assert quota.resets_at.isoformat() == "2027-01-01T00:00:00+00:00"


async def test_a_tight_budget_does_not_fail_setup(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Watched themes read from whole years load in the background, not at setup."""
    brickset.year_sets[:] = [_on(dt_util.now().date(), 1, "Technic set")]
    # The collection's 2 calls fit a budget of 4; a year's 3 pages after them do not.
    entry = await setup_integration(
        hass,
        _with_releases(
            mock_config_entry,
            **{CONF_THEMES: ["Technic"], CONF_DAILY_CALL_BUDGET: 4},
        ),
    )

    assert entry.state is ConfigEntryState.LOADED
    assert _rows(entry)["status"] == "failed"


async def test_feeds_keep_polling_with_the_calendar_disabled(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    entity_registry: er.EntityRegistry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """The panel and events need the daily poll even when no entity listens."""
    entry = _with_releases(mock_config_entry)
    entry.add_to_hass(hass)
    entity_registry.async_get_or_create(
        "calendar",
        DOMAIN,
        f"{entry.entry_id}_releases",
        config_entry=entry,
        disabled_by=er.RegistryEntryDisabler.USER,
    )
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    polls = len(_year_calls(brickset))

    freezer.tick(timedelta(hours=25))
    async_fire_time_changed(hass)
    await hass.async_block_till_done(wait_background_tasks=True)

    assert len(_year_calls(brickset)) > polls


async def test_this_years_count_leaves_out_last_year_in_january(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """January reads last year too, but sets this year still means this year."""
    freezer.move_to("2027-01-10 12:00:00+00:00")
    brickset.year_sets[:] = [
        _on(date(2026, 12, 20), 1, "December Technic", theme="Technic"),
        _on(date(2027, 1, 5), 2, "January Technic", theme="Technic"),
    ]
    await setup_integration(
        hass, _with_releases(mock_config_entry, **{CONF_THEMES: ["Technic"]})
    )

    latest = hass.states.get("sensor.brickset_brickfan_latest_technic_set")
    assert latest.attributes["sets_this_year"] == 1


async def test_a_theme_typed_in_other_capitals_still_matches(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Brickset's theme filter forgives capitals, so cutting a year does too."""
    brickset.year_sets[:] = [
        _on(dt_util.now().date(), 1, "Technic set", theme="Technic")
    ]
    entry = await setup_integration(
        hass, _with_releases(mock_config_entry, **{CONF_THEMES: ["technic"]})
    )

    themes = entry.runtime_data.feeds.data.themes
    assert [s.name for s in themes["technic"]] == ["Technic set"]


async def test_3_december_already_reads_the_january_wave(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """The day's poll covers the window as it stands the next day, before the next."""
    freezer.move_to("2026-12-03 15:00:00+00:00")
    brickset.year_sets[:] = [
        _on(date(2026, 12, 1), 1, "December set"),
        _on(date(2027, 1, 1), 2, "New Year set"),
    ]
    entry = await setup_integration(hass, _with_releases(mock_config_entry))

    assert [call["year"] for call in _year_calls(brickset)] == [2026, 2027]
    freezer.move_to("2026-12-04 10:00:00+00:00")
    assert _rows(entry)["upcoming"] == ["New Year set"]


async def test_new_set_events_fire_when_following_every_theme(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The default for new installs still announces new sets in watched themes."""
    today = dt_util.now().date()
    brickset.year_sets[:] = [_on(today, 1, "Known Technic", theme="Technic")]
    entry = await setup_integration(
        hass, _with_releases(mock_config_entry, **{CONF_THEMES: ["Technic"]})
    )
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    brickset.year_sets += [
        _on(today, 2, "New Technic", theme="Technic"),
        # Read in the same poll, but no one follows Icons.
        _on(today, 3, "New Icons", theme="Icons"),
    ]
    await entry.runtime_data.feeds.async_refresh()
    await hass.async_block_till_done()

    assert [event.data["name"] for event in events] == ["New Technic"]
    assert events[0].data["theme"] == "Technic"
