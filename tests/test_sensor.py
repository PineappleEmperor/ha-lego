"""Tests for the LEGO sensors."""

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.components.sensor import SensorDeviceClass, SensorStateClass
from homeassistant.const import CONF_REGION, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from .conftest import BricksetServer, make_set, setup_integration

PREFIX = "sensor.lego_brickfan"


@pytest.mark.usefixtures("brickset")
async def test_summary_sensors(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Collection totals reach the state machine."""
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_sets_owned").state == "4"
    assert hass.states.get(f"{PREFIX}_distinct_sets_owned").state == "3"
    assert hass.states.get(f"{PREFIX}_pieces_owned").state == "7122"
    assert hass.states.get(f"{PREFIX}_minifigures_owned").state == "31"
    assert hass.states.get(f"{PREFIX}_sets_wanted").state == "1"
    # Each is a count of what is held now, which graphs as a measurement.
    for name in ("sets_owned", "pieces_owned", "sets_wanted"):
        state = hass.states.get(f"{PREFIX}_{name}")
        assert state.attributes["state_class"] == SensorStateClass.MEASUREMENT


@pytest.mark.usefixtures("brickset")
async def test_wishlist_sensor_carries_the_sets_unrecorded(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
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
    assert (sets[0]["theme"], sets[0]["year"]) == ("Icons", 2024)
    assert sets[0]["retail_price"] == 629.99
    assert sets[0]["image_url"] == (
        "https://images.brickset.com/sets/images/10294-1.jpg"
    )
    assert sets[0]["brickset_url"] == "https://brickset.com/sets/10294-1"
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


@pytest.mark.usefixtures("brickset")
async def test_value_sensor_reports_missing_prices(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The value sensor states its currency and admits what it could not price."""
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_collection_value")
    assert state.state == "524.99"
    assert state.attributes["unit_of_measurement"] == "GBP"
    assert state.attributes["sets_missing_price"] == 1
    assert state.attributes["region"] == "UK"
    assert state.attributes["attribution"] == "Data provided by Brickset.com"


@pytest.mark.usefixtures("brickset")
async def test_value_sensor_follows_the_region(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
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


@pytest.mark.usefixtures("brickset")
async def test_quota_sensor(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
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
    assert state.attributes["device_class"] == SensorDeviceClass.DURATION


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


@pytest.mark.usefixtures("brickset")
async def test_wishlist_sets_get_no_sensor_of_their_own(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The entity count does not track the wishlist length."""
    await setup_integration(hass, mock_config_entry)

    assert hass.states.get(f"{PREFIX}_set_10294_1_retires_in") is None
    assert hass.states.get(f"{PREFIX}_set_10497_1_retires_in") is None


async def test_latest_theme_sensor(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The theme feed surfaces the newest set number, and counts this year's."""
    year = dt_util.now().year
    brickset.theme_sets[:] = [
        make_set(5, "42200-1", "New Technic Thing", theme="Technic", year=year),
        make_set(6, "42199-1", "Older Technic Thing", theme="Technic", year=year),
        make_set(7, "42150-1", "Last Year's Technic", theme="Technic", year=year - 1),
    ]
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_latest_technic_set")
    assert state.state == "42200-1"
    assert state.attributes["sets_this_year"] == 2
    attributes = state.attributes
    assert attributes["set_name"] == "New Technic Thing"
    assert (attributes["theme"], attributes["year"]) == ("Technic", year)
    assert (attributes["pieces"], attributes["minifigs"]) == (1000, 3)
    assert attributes["retail_price"] == 99.99
    assert attributes["release_date"] == "2024-01-01"
    assert attributes["retirement_date"] == "2099-12-31"
    assert (attributes["owned"], attributes["wanted"]) == (False, False)
    assert attributes["image_url"] == (
        "https://images.brickset.com/sets/images/42200-1.jpg"
    )
    assert attributes["brickset_url"] == "https://brickset.com/sets/42200-1"


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


async def test_latest_theme_set_is_the_most_recently_released(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Released sets newest first, then those still to come, undated ones last."""
    today = dt_util.now().date()

    def on(days: int) -> str:
        return f"{(today + timedelta(days=days)).isoformat()}T00:00:00Z"

    # Listed out of order, with the highest number neither released nor latest,
    # so only real ordering by release date picks the right one.
    brickset.theme_sets[:] = [
        make_set(
            1, "9999-1", "Out last month", theme="Technic", first_available=on(-30)
        ),
        make_set(
            2,
            "42999-1",
            "Announced",
            theme="Technic",
            first_available=None,
            released=False,
        ),
        make_set(
            3, "10294-1", "Out yesterday", theme="Technic", first_available=on(-1)
        ),
        make_set(4, "42500-1", "Due next week", theme="Technic", first_available=on(7)),
        make_set(
            5, "10295-1", "Also out yesterday", theme="Technic", first_available=on(-1)
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    state = hass.states.get(f"{PREFIX}_latest_technic_set")
    # Two out the same day: the higher number, numerically, is the later set.
    assert state.state == "10295-1"
    feed = mock_config_entry.runtime_data.feeds.data.themes["Technic"]
    assert [item.name for item in feed] == [
        "Also out yesterday",
        "Out yesterday",
        "Out last month",
        "Due next week",
        "Announced",
    ]


async def test_a_set_retiring_today_is_still_counting_down(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """On its last day a set is 0 days away and not yet retired."""
    today = dt_util.now().date().isoformat()
    brickset.wanted[:] = [
        make_set(
            4, "10294-1", "Titanic", wanted=True, last_available=f"{today}T00:00:00Z"
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    countdown = hass.states.get(f"{PREFIX}_next_wishlist_retirement")
    assert countdown.state == "0"
    assert countdown.attributes["set_number"] == "10294-1"
    wanted = hass.states.get(f"{PREFIX}_sets_wanted").attributes["sets"]
    assert wanted[0]["retired"] is False
