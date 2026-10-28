"""Tests for the sidebar panel and its websocket commands."""

from datetime import date, timedelta
from http import HTTPStatus
from typing import Any

from homeassistant.components import frontend
from homeassistant.const import CONF_API_KEY, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
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
from custom_components.lego.panel import PanelStore, dashboard_payload, releases_payload

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


async def test_release_spans_pick_and_order_the_followed_themes(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Behind today runs newest first, ahead soonest first, undated only in Upcoming."""
    today = dt_util.now().date()

    def dated(set_id: int, name: str, days: int, **kwargs: Any) -> dict[str, Any]:
        """A Technic set that went, or goes, on sale this many days from today."""
        return make_set(
            set_id,
            f"{42200 + set_id}-1",
            name,
            theme="Technic",
            first_available=f"{(today + timedelta(days=days)).isoformat()}T00:00:00Z",
            **kwargs,
        )

    brickset.theme_sets[:] = [
        dated(1, "Out 92 days ago", -92),
        dated(2, "Out 91 days ago", -91),
        dated(3, "Out 30 days ago", -30),
        dated(4, "Due in a month", 30),
        dated(7, "Due in 100 days", 100),
        make_set(
            5,
            "42205-1",
            "Announced Set",
            theme="Technic",
            first_available=None,
            released=False,
        ),
        dated(6, "Out today", 0),
        dated(8, "A keyring", -5, category="Gear"),
    ]
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    async def names(span: str) -> list[str]:
        await client.send_json_auto_id({"type": "lego/releases", "span": span})
        message = await client.receive_json()
        assert message["success"], message
        assert message["result"]["status"] == "ready"
        return [item["name"] for item in message["result"]["sets"]]

    # Thirteen weeks back, the last day included; gear filed beside sets is not one.
    assert await names("past3") == ["Out today", "Out 30 days ago", "Out 91 days ago"]
    assert await names("next3") == ["Due in a month"]
    assert await names("coming") == [
        "Due in a month",
        "Due in 100 days",
        "Announced Set",
    ]
    # Either side of today: what just came out leads, then what is next.
    assert await names("around") == [
        "Out today",
        "Out 30 days ago",
        "Out 91 days ago",
        "Due in a month",
    ]


async def test_release_timeline_and_theme_filter(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The timeline dots every dated set of the picked themes, oldest first."""
    today = dt_util.now().date()
    brickset.theme_sets[:] = [
        make_set(
            1,
            "42001-1",
            "Later",
            theme="Technic",
            first_available=f"{today.isoformat()}T00:00:00Z",
        ),
        make_set(
            2,
            "42002-1",
            "Earlier",
            theme="Technic",
            first_available=f"{date(today.year, 1, 1).isoformat()}T00:00:00Z",
        ),
    ]
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/releases", "themes": ["technic"], "span": "year"}
    )
    result = (await client.receive_json())["result"]
    assert result["timeline"] == [
        {
            "date": date(today.year, 1, 1).isoformat(),
            "theme": "Technic",
            "number": "42002-1",
            "name": "Earlier",
        },
        {
            "date": today.isoformat(),
            "theme": "Technic",
            "number": "42001-1",
            "name": "Later",
        },
    ]
    # The year's span is the whole calendar year, what is still to come included.
    assert result["span"] == {
        "from": date(today.year, 1, 1).isoformat(),
        "to": date(today.year, 12, 31).isoformat(),
    }

    # A theme nobody follows matches nothing, rather than falling back to them all.
    await client.send_json_auto_id(
        {"type": "lego/releases", "themes": ["Ninjago"], "span": "year"}
    )
    assert (await client.receive_json())["result"]["sets"] == []


@pytest.mark.usefixtures("brickset")
async def test_releases_rejects_an_unknown_span(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The span is one of the panel's own, never a free-form window."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/releases", "span": "decade"})
    message = await client.receive_json()

    assert not message["success"]
    assert message["error"]["code"] == "invalid_format"


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
    # Two Galaxy Explorers at 90.00 and the castle at 344.99; the Alienator has
    # no LEGO.com price, so it is counted as missing rather than as nothing.
    assert result["stats"]["value"] == 524.99
    assert result["stats"]["sets_missing_price"] == 1
    assert result["stats"]["minifigs_owned"] == 31
    assert result["stats"]["sets_wanted"] == 1
    assert [item["set_number"] for item in result["wishlist"]] == ["10294-1"]
    assert result["followed"] == ["Technic"]
    # Collection value starts folded; the release rows start combined.
    assert result["collapsed"] == ["value", "pieces"]
    assert result["release_mode"] == "combined"
    assert result["collection_prices"] is True
    assert result["release_status"] == {"all": None, "mine": "ready"}
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

    # Drawn from Home Assistant's copy, with Brickset's own as the fallback.
    assert wanted.pop("image").startswith("/api/lego/image/small/10294-1.jpg?authSig=")
    assert wanted == {
        "set_number": "10294-1",
        "name": "Titanic",
        "year": 2024,
        "theme": "Icons",
        "pieces": 9090,
        "minifigs": 0,
        "image_remote": "https://images.brickset.com/sets/small/10294-1.jpg",
        "image_large": None,
        "url": "https://brickset.com/sets/10294-1",
        "owned": False,
        "wanted": True,
        "qty_owned": 0,
        "retail_price": 629.99,
        "released": True,
        "available_from": "2024-01-01",
        "available_until": "2099-12-31",
    }


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
    # Each card arrives drawn from the set's record, not just its number.
    castle = next(item for item in owned if item["set_number"] == "10305-1")
    assert castle["name"] == "Lion Knights' Castle"
    assert castle["image"].startswith("/api/lego/image/small/10305-1.jpg?authSig=")
    assert castle["image_remote"] == (
        "https://images.brickset.com/sets/small/10305-1.jpg"
    )
    assert (castle["retail_price"], castle["qty_owned"]) == (344.99, 1)
    assert castle["available_until"] == "2099-12-31"

    await client.send_json_auto_id({"type": "lego/collection", "filter": "all"})
    every = {
        item["set_number"] for item in (await client.receive_json())["result"]["sets"]
    }
    assert every == {item["set_number"] for item in owned} | {"10294-1"}


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
    # Rows the saved order does not mention follow it, so none goes missing; the
    # combined release row joins its siblings rather than the end.
    expected = ["collection", "wishlist", "releases", "themes"]
    assert saved["result"]["rows"][:4] == expected

    await client.send_json_auto_id({"type": "lego/dashboard"})
    rows = (await client.receive_json())["result"]["rows"]
    assert rows[:4] == expected
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


async def test_wanted_filter_includes_a_set_also_owned(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Wanted means wanted, not merely not owned: a second copy can be both."""
    brickset.owned[1]["collection"]["wanted"] = True
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "lego/collection", "filter": "wanted"})
    sets = (await client.receive_json())["result"]["sets"]

    assert sorted(item["set_number"] for item in sets) == ["10294-1", "10305-1"]


async def test_value_by_theme_runs_most_valuable_first(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Each theme's total counts every copy, and the biggest leads."""
    brickset.owned[:] = [
        make_set(
            1, "10001-1", "Icons", theme="Icons", owned=True, qty_owned=1, price=100.0
        ),
        make_set(
            2,
            "42001-1",
            "Technic",
            theme="Technic",
            owned=True,
            qty_owned=1,
            price=300.0,
        ),
        make_set(
            3,
            "75001-1",
            "Star Wars",
            theme="Star Wars",
            owned=True,
            qty_owned=2,
            price=40.0,
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    rows = dashboard_payload(mock_config_entry)["by_theme"]

    assert [(row["theme"], row["value"], row["sets"]) for row in rows] == [
        ("Technic", 300.0, 1),
        ("Icons", 100.0, 1),
        ("Star Wars", 80.0, 2),
    ]
    # The chart's tooltip names the sets behind each theme's total.
    assert [row["set_numbers"] for row in rows] == [
        ["42001-1"],
        ["10001-1"],
        ["75001-1"],
    ]


async def test_wishlist_runs_soonest_retirement_first_retired_last(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """What to buy before it goes leads; what has already gone sinks."""
    today = dt_util.now().date()

    def on(days: int) -> str:
        return f"{(today + timedelta(days=days)).isoformat()}T00:00:00Z"

    brickset.wanted[:] = [
        make_set(1, "10001-1", "Retired", wanted=True, last_available=on(-10)),
        make_set(2, "10002-1", "Retires later", wanted=True, last_available=on(200)),
        make_set(3, "10003-1", "No date", wanted=True, last_available=None),
        make_set(4, "10004-1", "Retires soon", wanted=True, last_available=on(20)),
    ]
    await setup_integration(hass, mock_config_entry)

    wishlist = dashboard_payload(mock_config_entry)["wishlist"]

    assert [item["name"] for item in wishlist] == [
        "Retires soon",
        "Retires later",
        "No date",
        "Retired",
    ]
    # Each card carries its own dates, not one standing in for the other.
    assert wishlist[0]["available_until"] == (today + timedelta(days=20)).isoformat()
    assert wishlist[0]["available_from"] == "2024-01-01"


async def test_an_undated_set_already_out_is_not_new(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Undated is news only while unreleased; a released set with no date is old."""
    brickset.theme_sets[:] = [
        make_set(
            1,
            "42001-1",
            "Old undated",
            theme="Technic",
            first_available=None,
            released=True,
        ),
        make_set(
            2,
            "42002-1",
            "Announced",
            theme="Technic",
            first_available=None,
            released=False,
        ),
    ]
    await setup_integration(hass, mock_config_entry)

    coming = releases_payload(mock_config_entry, "mine", [], "coming")["sets"]

    assert [item["name"] for item in coming] == ["Announced"]


@pytest.mark.usefixtures("brickset")
async def test_panel_settings_survive_a_restart(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Row order, hidden rows and the chosen account are stored, not just held."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "lego/panel_config/set",
            "rows": ["wishlist", "themes"],
            "hidden": ["value"],
        }
    )
    assert (await client.receive_json())["success"]
    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": mock_config_entry.entry_id}
    )
    await client.receive_json()

    # A fresh store reads back what the running one wrote, as after a restart.
    restarted = PanelStore(hass)
    await restarted.async_load()

    assert restarted.rows(hass_admin_user.id)[:2] == ["wishlist", "releases"]
    assert restarted.hidden(hass_admin_user.id) == ["value"]
    assert restarted.account(hass_admin_user.id) == mock_config_entry.entry_id


@pytest.mark.usefixtures("brickset")
async def test_release_and_collapse_settings_are_saved(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Which rows start folded, the release layout and each row's filters persist."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {
            "type": "lego/panel_config/set",
            "collapsed": ["wishlist", "mocs"],
            "release_mode": "separate",
            "release_filters": {
                "themes": {"themes": ["Technic"], "span": "year"},
            },
        }
    )
    saved = await client.receive_json()
    assert saved["success"], saved
    assert saved["result"]["collapsed"] == ["wishlist"]
    assert saved["result"]["release_mode"] == "separate"

    # A later save of one row's filters leaves the others alone.
    await client.send_json_auto_id(
        {
            "type": "lego/panel_config/set",
            "release_filters": {"recent": {"span": "past3"}},
        }
    )
    filters = (await client.receive_json())["result"]["release_filters"]
    assert filters == {
        "themes": {"themes": ["Technic"], "span": "year"},
        "recent": {"span": "past3"},
    }

    restarted = PanelStore(hass)
    await restarted.async_load()
    assert restarted.settings(hass_admin_user.id)["release_mode"] == "separate"
    assert restarted.collapsed(hass_admin_user.id) == ["wishlist"]


@pytest.mark.usefixtures("brickset")
async def test_hiding_collection_prices_is_saved(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_admin_user: MockUser,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Hiding prices on the owned sets survives a restart and reaches the dashboard."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id(
        {"type": "lego/panel_config/set", "collection_prices": False}
    )
    saved = await client.receive_json()
    assert saved["success"], saved
    assert saved["result"]["collection_prices"] is False

    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["collection_prices"] is False

    restarted = PanelStore(hass)
    await restarted.async_load()
    assert restarted.settings(hass_admin_user.id)["collection_prices"] is False
    assert restarted.settings("someone-else")["collection_prices"] is True


@pytest.mark.usefixtures("brickset")
async def test_release_filters_reject_an_unknown_row_or_span(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A filter for a row that has none, or a span the panel lacks, is refused."""
    await setup_integration(hass, mock_config_entry)
    client = await hass_ws_client(hass)

    for filters in (
        {"wishlist": {"span": "year"}},
        {"recent": {"span": "decade"}},
    ):
        await client.send_json_auto_id(
            {"type": "lego/panel_config/set", "release_filters": filters}
        )
        message = await client.receive_json()
        assert not message["success"], filters


async def test_saved_orders_gain_the_combined_row_where_releases_were(
    hass: HomeAssistant,
) -> None:
    """An order saved before the combined row existed places it with its siblings."""
    store = PanelStore(hass)
    await store.async_update("user", rows=["wishlist", "recent", "collection"])

    rows = store.rows("user")

    assert rows[:4] == ["wishlist", "releases", "recent", "collection"]
    assert sorted(rows) == sorted(PANEL_ROWS)


@pytest.mark.usefixtures("brickset")
async def test_the_bundle_loads_on_every_page_for_the_cards(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The cards ship in the panel bundle, loaded at the very URL the panel uses."""
    await setup_integration(hass, mock_config_entry)

    modules = hass.data[frontend.DATA_EXTRA_MODULE_URL].urls
    panel_url = hass.data[frontend.DATA_PANELS][PANEL_URL_PATH].config["_panel_custom"][
        "module_url"
    ]
    assert panel_url in modules
