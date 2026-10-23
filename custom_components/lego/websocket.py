"""Websocket commands, so a dashboard can search without spending quota."""

from typing import TYPE_CHECKING, Any, cast

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import probatio

from .const import DOMAIN
from .panel import PANEL_STORE, dashboard_payload, summarise

if TYPE_CHECKING:
    from homeassistant.auth.models import User

    from .coordinator import LegoConfigEntry


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands."""
    websocket_api.async_register_command(hass, websocket_search)
    websocket_api.async_register_command(hass, websocket_dashboard)
    websocket_api.async_register_command(hass, websocket_collection)
    websocket_api.async_register_command(hass, websocket_set_rows)
    websocket_api.async_register_command(hass, websocket_accounts)
    websocket_api.async_register_command(hass, websocket_set_account)


@callback
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/search",
        probatio.Optional("config_entry_id"): str,
        probatio.Required("query"): str,
        probatio.Optional("limit", default=10): probatio.All(
            int, probatio.Range(min=1, max=50)
        ),
    }
)
def websocket_search(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Search the local catalogue; never reaches Brickset, so never billed."""
    entry = _loaded_entry(hass, connection, msg)
    if entry is None:
        return

    catalogue = entry.runtime_data.catalogue
    if catalogue is None or not catalogue.loaded:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "The set catalogue is not available"
        )
        return

    connection.send_result(
        msg["id"],
        {
            "sets": [
                {
                    "set_number": found.number,
                    "name": found.name,
                    "year": found.year,
                    "theme": found.theme,
                    "owned": _owned(entry, found.number),
                }
                for found in catalogue.search(msg["query"], msg["limit"])
            ]
        },
    )


@callback
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/dashboard",
        probatio.Optional("config_entry_id"): str,
    }
)
def websocket_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the home view in one reply: stats, wishlist and theme feeds."""
    entry = _loaded_entry(hass, connection, msg)
    if entry is None:
        return

    store = hass.data[PANEL_STORE]
    user_id = connection.user.id if connection.user else None
    connection.send_result(msg["id"], dashboard_payload(entry, store.rows(user_id)))


@callback
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/collection",
        probatio.Optional("config_entry_id"): str,
        probatio.Optional("filter", default="owned"): probatio.In(
            ("owned", "wanted", "all")
        ),
    }
)
def websocket_collection(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the sets Brickset already told us about; costs no calls."""
    entry = _loaded_entry(hass, connection, msg)
    if entry is None:
        return

    data = entry.runtime_data.collection.data
    region = entry.runtime_data.collection.region
    wanted = msg["filter"]
    sets = [] if data is None else list(data.all_sets.values())
    if wanted == "owned":
        sets = [item for item in sets if item.collection.owned]
    elif wanted == "wanted":
        sets = [item for item in sets if item.collection.wanted]

    connection.send_result(
        msg["id"],
        {"sets": [summarise(item, region) for item in _by_name(sets)]},
    )


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/panel_config/set",
        probatio.Required("rows"): [str],
    }
)
@websocket_api.async_response
async def websocket_set_rows(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save this user's row order and return what was stored."""
    # websocket_api.ActiveConnection types user as always set; keep the guard anyway, since a
    # write keyed on a missing user would land in another user's slot.
    if (user := cast("User | None", connection.user)) is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "No signed-in user"
        )
        return

    store = hass.data[PANEL_STORE]
    rows = await store.async_set_rows(user.id, msg["rows"])
    connection.send_result(msg["id"], {"rows": rows})


@callback
@websocket_api.websocket_command({probatio.Required("type"): "lego/accounts"})
def websocket_accounts(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List the loaded Brickset accounts and which one this user is on."""
    loaded = _loaded_entries(hass)
    connection.send_result(
        msg["id"],
        {
            "accounts": [
                {"entry_id": entry.entry_id, "name": entry.title} for entry in loaded
            ],
            "selected": _selected(hass, connection, loaded),
        },
    )


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/account/set",
        probatio.Required("config_entry_id"): str,
    }
)
@websocket_api.async_response
async def websocket_set_account(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remember which account this user's panel is showing."""
    # websocket_api.ActiveConnection types user as always set; keep the guard anyway, since a
    # write keyed on a missing user would land in another user's slot.
    if (user := cast("User | None", connection.user)) is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "No signed-in user"
        )
        return

    entry_id = msg["config_entry_id"]
    if entry_id not in {entry.entry_id for entry in _loaded_entries(hass)}:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown LEGO entry"
        )
        return

    await hass.data[PANEL_STORE].async_set_account(user.id, entry_id)
    connection.send_result(msg["id"], {"selected": entry_id})


def _loaded_entries(hass: HomeAssistant) -> list[LegoConfigEntry]:
    """Return every LEGO entry currently loaded."""
    return [
        cast("LegoConfigEntry", item)
        for item in hass.config_entries.async_entries(DOMAIN)
        if item.state is ConfigEntryState.LOADED
    ]


def _selected(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    loaded: list[LegoConfigEntry],
) -> str | None:
    """Return the account to show: this user's last choice, else the first."""
    if not loaded:
        return None
    user_id = connection.user.id if connection.user else None
    chosen = hass.data[PANEL_STORE].account(user_id)
    if any(entry.entry_id == chosen for entry in loaded):
        return str(chosen)
    return loaded[0].entry_id


def _loaded_entry(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> LegoConfigEntry | None:
    """Resolve a loaded LEGO entry, reporting why not when it fails."""
    requested = msg.get("config_entry_id")
    if requested is None:
        # The panel is registered globally, so it names no entry until it has asked
        # which accounts exist. Falling back to this user's stored choice keeps a
        # browser still running an older bundle working with several accounts.
        loaded = _loaded_entries(hass)
        if not loaded:
            connection.send_error(
                msg["id"], websocket_api.ERR_NOT_FOUND, "No LEGO account is loaded"
            )
            return None
        selected = _selected(hass, connection, loaded)
        return next(entry for entry in loaded if entry.entry_id == selected)

    entry = hass.config_entries.async_get_entry(requested)
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown LEGO entry"
        )
        return None
    if entry.state is not ConfigEntryState.LOADED:
        connection.send_error(
            msg["id"],
            websocket_api.ERR_HOME_ASSISTANT_ERROR,
            "LEGO entry is not loaded",
        )
        return None
    return cast("LegoConfigEntry", entry)


def _by_name(sets: list[Any]) -> list[Any]:
    """Sort for a grid a person scans, not by whatever the API returned."""
    return sorted(sets, key=lambda item: (item.theme, item.name, item.number))


def _owned(entry: Any, number: str) -> bool:
    """Whether the signed-in user already owns a set."""
    data = entry.runtime_data.collection.data
    if data is None:
        return False
    lego_set = data.all_sets.get(number)
    return bool(lego_set and lego_set.collection.owned)
