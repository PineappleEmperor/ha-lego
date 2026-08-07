"""Tests for the lego/search websocket command."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import CONF_CATALOGUE

from .conftest import BricksetServer, setup_integration


async def test_search_returns_catalogue_hits(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A dashboard can search the local index without a Brickset call."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()
    before = len(brickset.get_sets_calls)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "lego/search",
            "config_entry_id": mock_config_entry.entry_id,
            "query": "galaxy",
        }
    )
    response = await client.receive_json()

    assert response["success"]
    assert response["result"]["sets"] == [
        {
            "set_number": "10497-1",
            "name": "Galaxy Explorer",
            "year": 2022,
            "theme": "Icons",
            "owned": True,
        }
    ]
    assert len(brickset.get_sets_calls) == before


async def test_search_honours_the_limit(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A type-ahead asks for a handful, not the whole index."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "lego/search",
            "config_entry_id": mock_config_entry.entry_id,
            "query": "e",
            "limit": 1,
        }
    )
    response = await client.receive_json()

    assert response["success"]
    assert len(response["result"]["sets"]) == 1


async def test_search_rejects_an_unknown_entry(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An entry id from another integration is not searchable."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/search", "config_entry_id": "nope", "query": "galaxy"}
    )
    response = await client.receive_json()

    assert not response["success"]
    assert response["error"]["code"] == "not_found"


async def test_search_reports_a_missing_catalogue(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Searching with the index turned off fails loudly rather than silently empty."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_CATALOGUE: False},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "lego/search",
            "config_entry_id": mock_config_entry.entry_id,
            "query": "galaxy",
        }
    )
    response = await client.receive_json()

    assert not response["success"]
    assert response["error"]["code"] == "not_found"
