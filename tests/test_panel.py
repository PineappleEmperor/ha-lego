"""Tests for the sidebar panel and its websocket commands."""

from http import HTTPStatus

from homeassistant.components import frontend
from homeassistant.const import CONF_API_KEY, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import (
    ClientSessionGenerator,
    WebSocketGenerator,
)

from custom_components.lego.const import (
    CONF_PANEL,
    CONF_THEMES,
    CONF_USER_HASH,
    DOMAIN,
    PANEL_ICON_URL,
    PANEL_ROWS,
    PANEL_URL_PATH,
)

from .conftest import (
    API_KEY,
    BricksetServer,
    lego_device_id,
    make_set,
    setup_integration,
)


async def _second_account(hass: HomeAssistant) -> MockConfigEntry:
    """Set up a second Brickset account alongside the fixture's."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="otherfan",
        unique_id="otherfan",
        version=2,
        data={
            CONF_API_KEY: API_KEY,
            CONF_USERNAME: "otherfan",
            CONF_USER_HASH: "second-hash",
        },
        options={CONF_REGION: "US", CONF_THEMES: []},
    )
    return await setup_integration(hass, entry)


@pytest.mark.usefixtures("brickset")
async def test_accounts_lists_every_loaded_entry(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The panel can ask which accounts exist and which to show first."""
    await setup_integration(hass, mock_config_entry)
    second = await _second_account(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/accounts"})
    result = (await client.receive_json())["result"]

    assert [item["name"] for item in result["accounts"]] == ["brickfan", "otherfan"]
    assert {item["entry_id"] for item in result["accounts"]} == {
        mock_config_entry.entry_id,
        second.entry_id,
    }
    assert result["selected"] == mock_config_entry.entry_id


@pytest.mark.usefixtures("brickset")
async def test_dashboard_serves_two_accounts(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Naming an account returns that account, not an error."""
    await setup_integration(hass, mock_config_entry)
    second = await _second_account(hass)

    client = await hass_ws_client(hass)
    for entry in (mock_config_entry, second):
        await client.send_json_auto_id(
            {"type": "lego/dashboard", "config_entry_id": entry.entry_id}
        )
        message = await client.receive_json()
        assert message["success"], message
        assert message["result"]["entry_id"] == entry.entry_id
        # The panel's actions target the account's device, so it must arrive too.
        assert message["result"]["device_id"] == lego_device_id(hass, entry)
        # So the panel can say how old the data is once the budget is spent.
        assert message["result"]["last_synced"] is not None
        assert message["result"]["quota"]["resets_at"].endswith("T00:00:00+00:00")


@pytest.mark.usefixtures("brickset")
async def test_dashboard_without_an_account_falls_back(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An unnamed request picks the first account rather than failing."""
    await setup_integration(hass, mock_config_entry)
    await _second_account(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    message = await client.receive_json()

    assert message["success"], message
    assert message["result"]["entry_id"] == mock_config_entry.entry_id


@pytest.mark.usefixtures("brickset")
async def test_chosen_account_is_remembered(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A stored choice decides both the listing and an unnamed dashboard call."""
    await setup_integration(hass, mock_config_entry)
    second = await _second_account(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": second.entry_id}
    )
    assert (await client.receive_json())["result"] == {"selected": second.entry_id}

    await client.send_json_auto_id({"type": "lego/accounts"})
    assert (await client.receive_json())["result"]["selected"] == second.entry_id

    await client.send_json_auto_id({"type": "lego/dashboard"})
    message = await client.receive_json()
    assert message["result"]["entry_id"] == second.entry_id


@pytest.mark.usefixtures("brickset")
async def test_stored_account_falls_back_once_removed(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Unloading the chosen account does not leave the panel pointing at nothing."""
    await setup_integration(hass, mock_config_entry)
    second = await _second_account(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": second.entry_id}
    )
    await client.receive_json()

    assert await hass.config_entries.async_unload(second.entry_id)
    await hass.async_block_till_done()

    await client.send_json_auto_id({"type": "lego/accounts"})
    result = (await client.receive_json())["result"]
    assert [item["entry_id"] for item in result["accounts"]] == [
        mock_config_entry.entry_id
    ]
    assert result["selected"] == mock_config_entry.entry_id


@pytest.mark.usefixtures("brickset")
async def test_setting_an_unknown_account_is_rejected(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A stale entry id from an old browser tab is refused, not stored."""
    await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": "does-not-exist"}
    )
    message = await client.receive_json()

    assert not message["success"]
    assert message["error"]["code"] == "not_found"


async def test_theme_rows_show_only_new_sets_newest_first(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Sets out for months drop off the row; the rest run newest release first."""
    # The suite runs on 15 May 2026, so anything out before mid-February is old.
    brickset.theme_sets[:] = [
        make_set(
            81,
            "42201-1",
            "January Set",
            theme="Technic",
            year=2026,
            first_available="2026-01-01T00:00:00Z",
        ),
        make_set(
            82,
            "42202-1",
            "March Set",
            theme="Technic",
            year=2026,
            first_available="2026-03-01T00:00:00Z",
        ),
        make_set(
            83,
            "42203-1",
            "August Set",
            theme="Technic",
            year=2026,
            first_available="2026-08-01T00:00:00Z",
        ),
        make_set(
            84,
            "42204-1",
            "Announced Set",
            theme="Technic",
            year=2026,
            first_available=None,
            released=False,
        ),
        make_set(
            85,
            "42205-1",
            "May Set",
            theme="Technic",
            year=2026,
            first_available="2026-05-01T00:00:00Z",
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    result = (await client.receive_json())["result"]

    assert [item["name"] for item in result["themes"]["Technic"]] == [
        "August Set",
        "May Set",
        "March Set",
        "Announced Set",
    ]


@pytest.mark.usefixtures("brickset")
async def test_panel_is_registered_by_default(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """A new install gets the sidebar entry without being asked."""
    await setup_integration(hass, mock_config_entry)

    assert PANEL_URL_PATH in hass.data[frontend.DATA_PANELS]


@pytest.mark.usefixtures("brickset")
async def test_panel_goes_when_the_last_account_unloads(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Unloading or disabling the only account removes the sidebar entry."""
    await setup_integration(hass, mock_config_entry)
    assert PANEL_URL_PATH in hass.data[frontend.DATA_PANELS]

    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert PANEL_URL_PATH not in hass.data[frontend.DATA_PANELS]

    # Loading it again brings the entry back.
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert PANEL_URL_PATH in hass.data[frontend.DATA_PANELS]


@pytest.mark.usefixtures("brickset")
async def test_panel_stays_while_another_account_is_loaded(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Unloading one of two accounts keeps the sidebar entry for the other."""
    await setup_integration(hass, mock_config_entry)
    await _second_account(hass)

    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert PANEL_URL_PATH in hass.data[frontend.DATA_PANELS]


@pytest.mark.usefixtures("brickset")
async def test_panel_can_be_turned_off(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Opting out leaves no sidebar entry behind."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_PANEL: False}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert PANEL_URL_PATH not in hass.data[frontend.DATA_PANELS]


@pytest.mark.usefixtures("brickset")
async def test_the_fallback_icon_is_served(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Cards without art point at the brand icon, so it has to be reachable."""
    await setup_integration(hass, mock_config_entry)

    response = await (await hass_client()).get(PANEL_ICON_URL)

    assert response.status == HTTPStatus.OK
    assert response.content_type == "image/png"


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
    # Cards show LEGO.com RRP, so the panel needs the region's currency.
    assert result["currency"] == "GBP"
    # The value and pieces rows: totals per theme, most valuable first, and the
    # sensors whose recorded statistics draw the history.
    themes = [row["theme"] for row in result["by_theme"]]
    assert themes[0] == "Icons"
    assert sum(row["sets"] for row in result["by_theme"]) == 4
    assert result["history"]["value"] == "sensor.brickset_brickfan_collection_value"
    assert result["history"]["pieces"] == "sensor.brickset_brickfan_pieces_owned"
    assert result["wishlist"][0]["retail_price"] is not None
    assert len(brickset.get_sets_calls) == before
    # The panel writes through actions that require the entry id, so the payload
    # has to carry it; without this the ownership toggle fails validation.
    assert result["entry_id"] == mock_config_entry.entry_id
    assert result["quota"]["refresh_cost"] == 2
    assert result["quota"]["budget"] >= result["quota"]["calls_today"]


@pytest.mark.usefixtures("brickset")
async def test_dashboard_carries_dates_for_the_wishlist(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
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


@pytest.mark.usefixtures("brickset")
async def test_collection_filters_and_sorts(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The grid is sorted for a person scanning it, not by API order."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/collection", "filter": "owned"})
    owned = (await client.receive_json())["result"]["sets"]

    assert all(item["owned"] for item in owned)
    assert owned == sorted(owned, key=lambda item: (item["theme"], item["name"]))


@pytest.mark.usefixtures("brickset")
async def test_collection_can_return_the_wishlist(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The same command backs the wanted filter."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/collection", "filter": "wanted"})
    sets = (await client.receive_json())["result"]["sets"]

    assert [item["set_number"] for item in sets] == ["10294-1"]


@pytest.mark.usefixtures("brickset")
async def test_row_order_is_saved_and_returned(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Reordering survives, because the dashboard reads back what was saved."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "rows": ["collection", "wishlist", "themes"]}
    )
    saved = await client.receive_json()
    # Rows the saved order does not mention follow it, so none goes missing.
    assert saved["result"]["rows"][:3] == ["collection", "wishlist", "themes"]

    await client.send_json_auto_id({"type": "lego/dashboard"})
    rows = (await client.receive_json())["result"]["rows"]
    assert rows[:3] == ["collection", "wishlist", "themes"]
    assert sorted(rows) == sorted(PANEL_ROWS)


@pytest.mark.usefixtures("brickset")
async def test_rows_can_be_hidden_and_shown(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Hiding a row keeps its place; pieces starts hidden until a user adds it."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["hidden"] == ["pieces"]

    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "hidden": ["value"]}
    )
    saved = (await client.receive_json())["result"]
    assert saved["hidden"] == ["value"]
    assert "value" in saved["rows"]

    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["hidden"] == ["value"]


@pytest.mark.usefixtures("brickset")
async def test_unknown_rows_are_dropped_and_new_ones_appended(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
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
