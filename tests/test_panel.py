"""Tests for the sidebar panel and its websocket commands."""

from __future__ import annotations

from homeassistant.components import frontend
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import CONF_PANEL, PANEL_ROWS, PANEL_URL_PATH

from .conftest import BricksetServer, setup_integration


async def test_panel_is_registered_by_default(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A new install gets the sidebar entry without being asked."""
    await setup_integration(hass, mock_config_entry)

    assert PANEL_URL_PATH in hass.data[frontend.DATA_PANELS]


async def test_panel_can_be_turned_off(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Opting out leaves no sidebar entry behind."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_PANEL: False}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert PANEL_URL_PATH not in hass.data[frontend.DATA_PANELS]


async def test_dashboard_returns_the_home_view(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """One reply carries stats, wishlist and theme feeds."""
    await setup_integration(hass, mock_config_entry)
    before = len(brickset.get_sets_calls)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    response = await client.receive_json()

    assert response["success"]
    result = response["result"]
    assert result["rows"] == list(PANEL_ROWS)
    # Three distinct sets, one of them owned twice.
    assert result["stats"]["sets_owned"] == 4
    assert result["stats"]["sets_distinct"] == 3
    assert result["stats"]["pieces_owned"] == 7122
    assert [item["set_number"] for item in result["wishlist"]] == ["10294-1"]
    assert list(result["themes"]) == ["Technic"]
    assert len(brickset.get_sets_calls) == before


async def test_dashboard_carries_dates_for_the_wishlist(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A wishlist card needs a date to be worth showing."""
    await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    wanted = (await client.receive_json())["result"]["wishlist"][0]

    assert wanted["name"] == "Titanic"
    assert wanted["retail_price"] == 629.99
    assert "available_from" in wanted
    assert "available_until" in wanted


async def test_collection_filters_and_sorts(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The grid is sorted for a person scanning it, not by API order."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/collection", "filter": "owned"})
    owned = (await client.receive_json())["result"]["sets"]

    assert all(item["owned"] for item in owned)
    assert owned == sorted(owned, key=lambda item: (item["theme"], item["name"]))


async def test_collection_can_return_the_wishlist(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The same command backs the wanted filter."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/collection", "filter": "wanted"})
    sets = (await client.receive_json())["result"]["sets"]

    assert [item["set_number"] for item in sets] == ["10294-1"]


async def test_row_order_is_saved_and_returned(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Reordering survives, because the dashboard reads back what was saved."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "rows": ["collection", "wishlist", "themes"]}
    )
    saved = await client.receive_json()
    assert saved["result"]["rows"] == ["collection", "wishlist", "themes"]

    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["rows"] == [
        "collection",
        "wishlist",
        "themes",
    ]


async def test_unknown_rows_are_dropped_and_new_ones_appended(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A saved order from another version must not lose or invent a row."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "rows": ["wishlist", "mocs"]}
    )
    rows = (await client.receive_json())["result"]["rows"]

    assert rows[0] == "wishlist"
    assert "mocs" not in rows
    assert sorted(rows) == sorted(PANEL_ROWS)
