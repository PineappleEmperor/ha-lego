"""Tests for the lego/search websocket command."""

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_CATALOGUE,
    CONF_SHARED,
    DOMAIN,
    SERVICE_SET_COLLECTION,
)

from .conftest import BricksetServer, lego_device_id, setup_integration


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
    # An owned set has a Brickset record, so it draws like any other card.
    [hit] = response["result"]["sets"]
    assert hit.pop("image").startswith("/api/lego/image/small/10497-1.jpg?authSig=")
    assert hit == {
        "set_number": "10497-1",
        "name": "Galaxy Explorer",
        "year": 2024,
        "theme": "Icons",
        "pieces": 1254,
        "minifigs": 4,
        "image_remote": "https://images.brickset.com/sets/small/10497-1.jpg",
        "image_large": None,
        "url": "https://brickset.com/sets/10497-1",
        "owned": True,
        "wanted": False,
        "qty_owned": 2,
        "retail_price": 90.0,
        "released": True,
        "available_from": "2024-01-01",
        "available_until": "2099-12-31",
    }
    assert len(brickset.get_sets_calls) == before


@pytest.mark.usefixtures("brickset")
async def test_search_honours_the_limit(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
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


@pytest.mark.usefixtures("brickset")
async def test_search_rejects_an_unknown_entry(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
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


@pytest.mark.usefixtures("brickset")
async def test_search_reports_a_missing_catalogue(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
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


async def test_search_fills_in_a_set_known_only_to_the_index(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A set with no Brickset record still arrives with every field a card reads."""
    brickset.theme_sets.clear()
    await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/search", "query": "42200"})
    [hit] = (await client.receive_json())["result"]["sets"]

    assert hit["name"] == "New Technic Thing"
    assert hit["retail_price"] is None
    assert hit["image_remote"] == "https://images.brickset.com/sets/small/42200-1.jpg"
    assert hit["image"].startswith("/api/lego/image/small/42200-1.jpg?authSig=")
    assert hit["url"] == "https://brickset.com/sets/42200-1"
    assert hit["owned"] is False
    assert hit["partial"] is True


async def test_details_for_search_results_cost_one_call(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Loading details asks once for every unknown set, then marking one is free."""
    held = list(brickset.theme_sets)
    brickset.theme_sets.clear()
    await setup_integration(hass, mock_config_entry)
    # Brickset knows the set; this account's polls have just never returned it.
    brickset.theme_sets.extend(held)
    before = len(brickset.get_sets_calls)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/set_details", "numbers": ["42200-1", "10497-1", "42200-1"]}
    )
    response = await client.receive_json()

    assert response["result"] == {"found": 1, "cost": 1}
    # The owned set already has its record, and the repeat is asked for once.
    assert [c["setNumber"] for c in brickset.get_sets_calls[before:]] == ["42200-1"]

    await client.send_json_auto_id({"type": "lego/search", "query": "42200"})
    [hit] = (await client.receive_json())["result"]["sets"]
    assert "partial" not in hit
    assert hit["retail_price"] == 99.99
    assert hit["available_until"] == "2099-12-31"

    await client.send_json_auto_id({"type": "lego/set_details", "numbers": ["42200-1"]})
    assert (await client.receive_json())["result"] == {"found": 0, "cost": 0}

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "42200-1",
            "owned": True,
        },
        blocking=True,
    )
    assert len(brickset.get_sets_calls) == before + 1


@pytest.mark.usefixtures("brickset")
async def test_details_need_an_account_the_user_may_change(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_read_only_access_token: str,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A billed call comes out of the account's budget, so a viewer cannot spend it."""
    # Shared with everyone, so the read-only user can see the account to be refused.
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_SHARED: True}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    client = await hass_ws_client(hass, hass_read_only_access_token)

    await client.send_json_auto_id({"type": "lego/set_details", "numbers": ["42200-1"]})
    response = await client.receive_json()

    assert response["error"]["code"] == "unauthorized"
