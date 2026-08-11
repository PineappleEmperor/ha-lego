"""Websocket commands, so a dashboard can search without spending quota."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import (
    ERR_HOME_ASSISTANT_ERROR,
    ERR_NOT_FOUND,
)
from homeassistant.components.websocket_api.decorators import (
    async_response,
    websocket_command,
)
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import DOMAIN, PANEL_STORE
from .panel import dashboard_payload, summarise

if TYPE_CHECKING:
    from . import LegoConfigEntry


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands."""
    async_register_command(hass, websocket_search)
    async_register_command(hass, websocket_dashboard)
    async_register_command(hass, websocket_collection)
    async_register_command(hass, websocket_set_rows)


@callback
@websocket_command(
    {
        vol.Required("type"): "lego/search",
        vol.Optional("config_entry_id"): str,
        vol.Required("query"): str,
        vol.Optional("limit", default=10): vol.All(int, vol.Range(min=1, max=50)),
    }
)
def websocket_search(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Search the local catalogue; never reaches Brickset, so never billed."""
    entry = _loaded_entry(hass, connection, msg)
    if entry is None:
        return

    catalogue = entry.runtime_data.catalogue
    if catalogue is None or not catalogue.loaded:
        connection.send_error(
            msg["id"], ERR_NOT_FOUND, "The set catalogue is not available"
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
@websocket_command(
    {
        vol.Required("type"): "lego/dashboard",
        vol.Optional("config_entry_id"): str,
    }
)
def websocket_dashboard(
    hass: HomeAssistant,
    connection: ActiveConnection,
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
@websocket_command(
    {
        vol.Required("type"): "lego/collection",
        vol.Optional("config_entry_id"): str,
        vol.Optional("filter", default="owned"): vol.In(("owned", "wanted", "all")),
    }
)
def websocket_collection(
    hass: HomeAssistant,
    connection: ActiveConnection,
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


@websocket_command(
    {
        vol.Required("type"): "lego/panel_config/set",
        vol.Required("rows"): [str],
    }
)
@async_response
async def websocket_set_rows(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save this user's row order and return what was stored."""
    if connection.user is None:
        connection.send_error(msg["id"], ERR_NOT_FOUND, "No signed-in user")
        return

    store = hass.data[PANEL_STORE]
    rows = await store.async_set_rows(connection.user.id, msg["rows"])
    connection.send_result(msg["id"], {"rows": rows})


def _loaded_entry(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> LegoConfigEntry | None:
    """Resolve a loaded LEGO entry, reporting why not when it fails."""
    requested = msg.get("config_entry_id")
    if requested is None:
        # The panel is registered globally and has no entry to name, so a single
        # account needs no picker.
        loaded = [
            item
            for item in hass.config_entries.async_entries(DOMAIN)
            if item.state is ConfigEntryState.LOADED
        ]
        if len(loaded) != 1:
            connection.send_error(
                msg["id"],
                ERR_NOT_FOUND,
                f"Name a config_entry_id: found {len(loaded)} loaded LEGO accounts",
            )
            return None
        return cast("LegoConfigEntry", loaded[0])

    entry = hass.config_entries.async_get_entry(requested)
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(msg["id"], ERR_NOT_FOUND, "Unknown LEGO entry")
        return None
    if entry.state is not ConfigEntryState.LOADED:
        connection.send_error(
            msg["id"], ERR_HOME_ASSISTANT_ERROR, "LEGO entry is not loaded"
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
