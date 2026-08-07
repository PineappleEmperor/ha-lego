"""Tests for the events the LEGO coordinators fire."""

from __future__ import annotations

from datetime import timedelta

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Event, HomeAssistant, callback
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.lego.const import EVENT_NEW_SET, EVENT_WANTED_CHANGED

from .conftest import BricksetServer, make_set, setup_integration


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


async def test_unchanged_wanted_set_fires_nothing(
    hass: HomeAssistant,
    brickset: BricksetServer,
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
