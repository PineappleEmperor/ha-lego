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


async def test_watched_set_countdown(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A watched set counts down to its retirement date."""
    freezer.move_to("2099-12-01 12:00:00+00:00")
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_set_10497_1_retires_in")
    assert state.state == "30"
    assert state.attributes["set_name"] == "Galaxy Explorer"
    assert state.attributes["retirement_date"] == "2099-12-31"
    assert state.attributes["qty_owned"] == 2
    assert state.attributes["brickset_url"] == "https://brickset.com/sets/10497-1"


async def test_watched_set_without_a_retirement_date(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A set with no published exit date reports unknown, not zero."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, "watchlist": ["6876-1"]},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert hass.states.get(f"{PREFIX}_set_6876_1_retires_in").state == STATE_UNKNOWN


async def test_watched_set_outside_the_collection_costs_one_call(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Watching a set you neither own nor want triggers a single extra lookup."""
    brickset.theme_sets.append(make_set(99, "77777-1", "Unowned Thing"))
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, "watchlist": ["77777-1"]},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    lookups = [call for call in brickset.get_sets_calls if "setNumber" in call]
    assert len(lookups) == 1
    assert lookups[0]["setNumber"] == "77777-1"
    assert hass.states.get(f"{PREFIX}_set_77777_1_retires_in") is not None


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
