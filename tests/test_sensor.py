"""Tests for the LEGO sensors."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import CONF_REGION

from .conftest import BricksetServer, make_set, setup_integration

PREFIX = "sensor.brickset_brickfan"


async def test_summary_sensors(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Collection totals reach the state machine."""
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_sets_owned").state == "4"
    assert hass.states.get(f"{PREFIX}_distinct_sets_owned").state == "3"
    assert hass.states.get(f"{PREFIX}_pieces_owned").state == "7122"
    assert hass.states.get(f"{PREFIX}_minifigures_owned").state == "31"
    assert hass.states.get(f"{PREFIX}_sets_wanted").state == "1"


async def test_wishlist_sensor_carries_the_sets_unrecorded(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The count is the state, the sets ride along, and history stays out of it."""
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_sets_wanted")
    assert state.state == "1"
    sets = state.attributes["sets"]
    assert [item["set_number"] for item in sets] == ["10294-1"]
    assert sets[0]["set_name"] == "Titanic"
    assert sets[0]["retirement_date"] == "2099-12-31"
    assert sets[0]["retired"] is False
    assert sets[0]["priority"] == 1
    # Lean on purpose: the 16-field payload would go to every browser each poll.
    assert set(sets[0]) == {
        "set_number",
        "set_name",
        "theme",
        "year",
        "retail_price",
        "retirement_date",
        "image_url",
        "brickset_url",
        "retired",
        "priority",
    }
    assert "sets" in state.state_info["unrecorded_attributes"]

    other = hass.states.get(f"{PREFIX}_sets_owned")
    assert "sets" not in other.attributes


async def test_wishlist_order_sinks_retired_sets(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Soonest to retire leads, undated follows, and the unbuyable sinks."""
    brickset.wanted = [
        make_set(40, "10294-1", "Titanic", wanted=True, last_available="2099-12-31"),
        make_set(41, "6876-1", "Alienator", wanted=True, last_available="2020-01-01"),
        make_set(42, "42200-1", "Technic", wanted=True, last_available="2030-06-01"),
        make_set(43, "10305-1", "Castle", wanted=True, last_available=None),
        make_set(44, "999-1", "Undated Old", wanted=True, last_available=None),
    ]
    await setup_integration(hass, mock_config_entry)

    sets = hass.states.get(f"{PREFIX}_sets_wanted").attributes["sets"]

    assert [item["set_number"] for item in sets] == [
        "42200-1",
        "10294-1",
        "999-1",
        "10305-1",
        "6876-1",
    ]
    assert [item["retired"] for item in sets] == [False, False, False, False, True]


async def test_value_sensor_reports_missing_prices(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The value sensor states its currency and admits what it could not price."""
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_collection_value")
    assert state.state == "524.99"
    assert state.attributes["unit_of_measurement"] == "GBP"
    assert state.attributes["sets_missing_price"] == 1
    assert state.attributes["region"] == "UK"
    assert state.attributes["attribution"] == "Data provided by Brickset.com"


async def test_value_sensor_follows_the_region(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Switching region changes the currency and drops UK-only prices."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_REGION: "US"}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(f"{PREFIX}_collection_value")
    assert state.attributes["unit_of_measurement"] == "USD"
    # The fixtures only publish UK prices, so nothing can be valued in USD.
    assert state.state == "0.0"
    assert state.attributes["sets_missing_price"] == 3


async def test_quota_sensor(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The diagnostic sensor exposes usage against the budget."""
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_brickset_calls_today")
    # owned + wanted + one theme feed.
    assert state.state == "3"
    assert state.attributes["budget"] == 80
    assert state.attributes["daily_limit"] == 100
    assert state.attributes["remaining"] == 77


async def test_next_wishlist_retirement(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """The sensor counts down to the soonest wishlist retirement."""
    freezer.move_to("2099-12-01 12:00:00+00:00")
    brickset.wanted.append(
        make_set(97, "10305-1", "Lion Knights", wanted=True, last_available=None)
    )
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_next_wishlist_retirement")
    assert state.state == "30"
    assert state.attributes["set_number"] == "10294-1"
    assert state.attributes["set_name"] == "Titanic"
    assert state.attributes["retirement_date"] == "2099-12-31"


async def test_next_retirement_prefers_the_sooner_set(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A nearer retirement wins, whatever order Brickset returned the sets in."""
    freezer.move_to("2099-12-01 12:00:00+00:00")
    brickset.wanted.insert(
        0,
        make_set(
            97, "10305-1", "Lion Knights", wanted=True, last_available="2099-12-11"
        ),
    )
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_next_wishlist_retirement")
    assert state.state == "10"
    assert state.attributes["set_number"] == "10305-1"


async def test_next_retirement_ignores_already_retired_sets(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A date in the past is not reported as a negative countdown."""
    freezer.move_to("2099-12-01 12:00:00+00:00")
    brickset.wanted = [
        make_set(97, "21034-1", "London", wanted=True, last_available="2020-01-01")
    ]
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_next_wishlist_retirement").state == STATE_UNKNOWN


async def test_next_retirement_without_any_dates(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """An undated wishlist reports unknown, not zero."""
    brickset.wanted = [
        make_set(
            98,
            "6879-1",
            "Dateless Wanted Thing",
            wanted=True,
            price=None,
            first_available=None,
            last_available=None,
        )
    ]
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_next_wishlist_retirement").state == STATE_UNKNOWN


async def test_wishlist_sets_get_no_sensor_of_their_own(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The entity count does not track the wishlist length."""
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_set_10294_1_retires_in") is None
    assert hass.states.get(f"{PREFIX}_set_10497_1_retires_in") is None


async def test_latest_theme_sensor(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The theme feed surfaces the newest set number."""
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_latest_technic_set")
    assert state.state == "42200-1"
    assert state.attributes["sets_this_year"] == 2
    assert state.attributes["set_name"] == "New Technic Thing"


async def test_sensors_refresh_on_the_next_poll(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A newly bought set shows up after the collection interval elapses."""
    await setup_integration(hass, mock_config_entry)
    assert hass.states.get(f"{PREFIX}_sets_owned").state == "4"

    brickset.owned.append(
        make_set(50, "21060-1", "Himeji Castle", owned=True, qty_owned=1, pieces=2125)
    )

    freezer.tick(timedelta(hours=7))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert hass.states.get(f"{PREFIX}_sets_owned").state == "5"
    assert hass.states.get(f"{PREFIX}_pieces_owned").state == str(7122 + 2125)
