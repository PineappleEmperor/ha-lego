"""Tests for the events the LEGO coordinators fire."""

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import CONF_REGION
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import (
    CONF_THEMES,
    DOMAIN,
    EVENT_NEW_SET,
    EVENT_WANTED_CHANGED,
)

from .conftest import BricksetServer, lego_device_id, make_set, setup_integration


async def test_new_set_event(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A set appearing in a watched theme fires an event, but not on first poll."""
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)

    await setup_integration(hass, mock_config_entry)
    # The first poll establishes the baseline, so a restart replays nothing.
    assert events == []

    brickset.theme_sets.insert(
        0, make_set(77, "42222-1", "Brand New Technic", theme="Technic", year=2026)
    )

    freezer.tick(timedelta(hours=13))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert len(events) == 1
    data = events[0].data
    assert data["set_number"] == "42222-1"
    assert data["theme"] == "Technic"
    assert data["name"] == "Brand New Technic"
    assert data["entry_id"] == mock_config_entry.entry_id
    # The device is what the actions target, so an automation can pass it straight on.
    assert data["device_id"] == lego_device_id(hass, mock_config_entry)
    assert data["release_date"] == "2024-01-01"
    assert data["retirement_date"] == "2099-12-31"
    assert data["retail_price"] == 99.99
    assert data["released"] is True
    assert data["region"] == "UK"


async def test_new_set_event_without_a_release_date(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """An announced set with no published dates reports None, not a crash."""
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    await setup_integration(hass, mock_config_entry)

    brickset.theme_sets.insert(
        0,
        make_set(
            78,
            "42333-1",
            "Announced Technic",
            theme="Technic",
            year=2026,
            price=None,
            first_available=None,
            last_available=None,
        ),
    )

    freezer.tick(timedelta(hours=13))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert len(events) == 1
    data = events[0].data
    assert data["release_date"] is None
    assert data["retirement_date"] is None
    assert data["retail_price"] is None


async def test_wanted_set_change_event(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A price or retirement change on a wanted set fires an event."""
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_WANTED_CHANGED, record)

    await setup_integration(hass, mock_config_entry)
    assert events == []

    brickset.wanted[0]["LEGOCom"]["UK"]["retailPrice"] = 699.99
    brickset.wanted[0]["LEGOCom"]["UK"]["dateLastAvailable"] = "2027-01-31T00:00:00Z"

    freezer.tick(timedelta(hours=7))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["set_number"] == "10294-1"
    assert events[0].data["price"] == 699.99
    assert events[0].data["retirement_date"] == "2027-01-31"
    assert events[0].data["device_id"] == lego_device_id(hass, mock_config_entry)


@pytest.mark.usefixtures("brickset")
async def test_unchanged_wanted_set_fires_nothing(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A poll that changes nothing is silent."""
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_WANTED_CHANGED, record)

    await setup_integration(hass, mock_config_entry)

    freezer.tick(timedelta(hours=7))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert events == []


async def test_two_themes_cost_one_call(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Brickset takes a comma-joined theme, so a feed poll is one call not two."""
    brickset.theme_sets.append(make_set(60, "10333-1", "Icons Thing", theme="Icons"))
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_THEMES: ["Technic", "Icons"]},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)

    theme_calls = [call for call in brickset.get_sets_calls if "theme" in call]
    assert [call["theme"] for call in theme_calls] == ["Technic,Icons"]

    feeds = mock_config_entry.runtime_data.feeds.data.themes
    assert [s.number for s in feeds["Technic"]] == ["42200-1", "42199-1"]
    assert [s.number for s in feeds["Icons"]] == ["10333-1"]


async def test_theme_batching_falls_back_when_brickset_stops_accepting_it(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """An undocumented shortcut must degrade to per-theme calls, not lose a feed."""
    brickset.theme_sets.append(make_set(60, "10333-1", "Icons Thing", theme="Icons"))
    brickset.themes_batchable = False
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_THEMES: ["Technic", "Icons"]},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)

    theme_calls = [call["theme"] for call in brickset.get_sets_calls if "theme" in call]
    assert theme_calls == ["Technic,Icons", "Technic", "Icons"]

    feeds = mock_config_entry.runtime_data.feeds.data.themes
    assert [s.number for s in feeds["Technic"]] == ["42200-1", "42199-1"]
    assert [s.number for s in feeds["Icons"]] == ["10333-1"]
    assert "falling back to one call per theme" in caplog.text


async def test_next_year_joins_once_brickset_files_a_set_under_it(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """getThemes, which is free, decides when next year is worth a call."""
    freezer.move_to("2026-09-10 12:00:00+00:00")
    brickset.filter_theme_year = True
    await setup_integration(hass, mock_config_entry)
    feeds = mock_config_entry.runtime_data.feeds
    # September, but nothing is filed under 2027 yet, so nothing is asked of it.
    assert [c["year"] for c in brickset.get_sets_calls if "theme" in c] == [2026]
    assert feeds.poll_cost == 1

    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    brickset.theme_sets.append(
        make_set(70, "42250-1", "January Technic", theme="Technic", year=2027)
    )
    await feeds.async_refresh()
    await hass.async_block_till_done()

    theme_years = [c["year"] for c in brickset.get_sets_calls if "theme" in c]
    assert theme_years[-2:] == [2026, 2027]
    assert feeds.poll_cost == 2
    assert [s.number for s in feeds.data.themes["Technic"]] == [
        "42250-1",
        "42200-1",
        "42199-1",
    ]
    assert [event.data["set_number"] for event in events] == ["42250-1"]
    latest = hass.states.get("sensor.brickset_brickfan_latest_technic_set")
    assert latest.attributes["set_number"] == "42250-1"


async def test_next_year_falls_back_to_the_season_without_get_themes(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """Should getThemes fail, next year is asked for from September as before."""
    brickset.themes_error = "Service temporarily unavailable"
    freezer.move_to("2026-08-31 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)
    feeds = mock_config_entry.runtime_data.feeds
    assert [c["year"] for c in brickset.get_sets_calls if "theme" in c] == [2026]

    freezer.move_to("2026-09-01 12:00:00+00:00")
    await feeds.async_refresh()

    theme_years = [c["year"] for c in brickset.get_sets_calls if "theme" in c]
    assert theme_years[-2:] == [2026, 2027]


async def test_feeds_ask_for_this_year_only_until_next_is_announced(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """On any day, with nothing filed under next year, a poll is one call."""
    await setup_integration(hass, mock_config_entry)

    theme_years = [c["year"] for c in brickset.get_sets_calls if "theme" in c]
    assert theme_years == [dt_util.now().year]
    assert mock_config_entry.runtime_data.feeds.poll_cost == 1


async def test_feeds_poll_nothing_with_nothing_followed(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """No themes and no all-theme rows: no feed calls, even in the autumn."""
    freezer.move_to("2026-10-01 12:00:00+00:00")
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_THEMES: []}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    feeds = mock_config_entry.runtime_data.feeds
    assert feeds.update_interval is None

    await feeds.async_refresh()

    assert [c for c in brickset.get_sets_calls if "theme" in c or "year" in c] == []
    assert feeds.data.themes == {}


async def test_themes_past_a_page_raise_a_repair(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    issue_registry: ir.IssueRegistry,
) -> None:
    """The user hears when the followed themes stop fitting one call."""
    year = dt_util.now().year
    brickset.theme_sets[:] = [
        make_set(1000 + n, f"{50000 + n}-1", f"Set {n}", theme="Technic", year=year)
        for n in range(600)
    ]
    await setup_integration(hass, mock_config_entry)
    feeds = mock_config_entry.runtime_data.feeds
    issue_id = f"theme_feed_paging_{mock_config_entry.entry_id}"

    issue = issue_registry.async_get_issue(DOMAIN, issue_id)
    assert issue is not None
    assert issue.translation_key == "theme_feed_paging"
    assert issue.translation_placeholders["pages"] == "2"
    assert issue.translation_placeholders["calls"] == "4"
    assert feeds.poll_cost == 2
    assert len(feeds.data.themes["Technic"]) == 600

    del brickset.theme_sets[400:]
    await feeds.async_refresh()

    assert issue_registry.async_get_issue(DOMAIN, issue_id) is None
    assert feeds.poll_cost == 1


async def test_a_get_themes_failure_reuses_its_last_answer(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """One failed getThemes keeps next year, so its sets are not announced twice."""
    freezer.move_to("2026-07-10 12:00:00+00:00")
    brickset.filter_theme_year = True
    brickset.theme_sets.append(
        make_set(70, "42250-1", "January Technic", theme="Technic", year=2027)
    )
    await setup_integration(hass, mock_config_entry)
    feeds = mock_config_entry.runtime_data.feeds

    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    # July is before the September fallback, so the month rule would drop 2027.
    brickset.themes_error = "Service temporarily unavailable"
    await feeds.async_refresh()
    brickset.themes_error = None
    await feeds.async_refresh()
    await hass.async_block_till_done()

    theme_years = [c["year"] for c in brickset.get_sets_calls if "theme" in c]
    assert theme_years == [2026, 2027] * 3
    assert events == []


async def test_the_paging_repair_goes_when_no_theme_is_followed(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    issue_registry: ir.IssueRegistry,
) -> None:
    """Following the Repair's advice to the letter must not leave it behind."""
    year = dt_util.now().year
    brickset.theme_sets[:] = [
        make_set(1000 + n, f"{50000 + n}-1", f"Set {n}", theme="Technic", year=year)
        for n in range(600)
    ]
    await setup_integration(hass, mock_config_entry)
    issue_id = f"theme_feed_paging_{mock_config_entry.entry_id}"
    assert issue_registry.async_get_issue(DOMAIN, issue_id) is not None

    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_THEMES: []}
    )
    await hass.config_entries.async_reload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert issue_registry.async_get_issue(DOMAIN, issue_id) is None


async def test_wishlist_availability_change_fires_an_event(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A wanted set going from retail to retired is worth an automation's notice."""
    await setup_integration(hass, mock_config_entry)
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_WANTED_CHANGED, record)
    brickset.wanted[0]["availability"] = "Retired"
    await mock_config_entry.runtime_data.collection.async_refresh()
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["set_number"] == "10294-1"
    assert events[0].data["availability"] == "Retired"
    assert "price" not in events[0].data


async def test_new_set_event_prices_in_the_chosen_region(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """An American user hears the US price, not the UK one."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_REGION: "US"}
    )
    await setup_integration(hass, mock_config_entry)
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    new = make_set(77, "42222-1", "Brand New Technic", theme="Technic")
    new["LEGOCom"]["US"] = {
        "retailPrice": 119.99,
        "dateFirstAvailable": "2025-03-01T00:00:00Z",
    }
    brickset.theme_sets.insert(0, new)
    await mock_config_entry.runtime_data.feeds.async_refresh()
    await hass.async_block_till_done()

    assert [event.data["retail_price"] for event in events] == [119.99]
    assert events[0].data["region"] == "US"
    assert events[0].data["release_date"] == "2025-03-01"
