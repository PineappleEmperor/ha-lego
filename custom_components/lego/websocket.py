"""Websocket commands, so a dashboard can search without spending quota."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import (
    ERR_HOME_ASSISTANT_ERROR,
    ERR_NOT_FOUND,
)
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import voluptuous as vol

from .const import DOMAIN

if TYPE_CHECKING:
    from . import LegoConfigEntry


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands."""
    async_register_command(hass, websocket_search)


@callback
@websocket_command(
    {
        vol.Required("type"): "lego/search",
        vol.Required("config_entry_id"): str,
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
    entry = hass.config_entries.async_get_entry(msg["config_entry_id"])
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(msg["id"], ERR_NOT_FOUND, "Unknown LEGO entry")
        return
    if entry.state is not ConfigEntryState.LOADED:
        connection.send_error(
            msg["id"], ERR_HOME_ASSISTANT_ERROR, "LEGO entry is not loaded"
        )
        return

    catalogue = cast("LegoConfigEntry", entry).runtime_data.catalogue
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


def _owned(entry: Any, number: str) -> bool:
    """Whether the signed-in user already owns a set."""
    data = entry.runtime_data.collection.data
    if data is None:
        return False
    lego_set = data.all_sets.get(number)
    return bool(lego_set and lego_set.collection.owned)
