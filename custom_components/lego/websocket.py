"""Websocket commands, so a dashboard can search without spending quota."""

from typing import TYPE_CHECKING, Any, cast

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
import probatio

from .access import can_view, is_linked
from .const import DOMAIN, RELEASE_MODES, RELEASE_ROWS, RELEASE_SCOPES, RELEASE_SPANS
from .panel import (
    PANEL_STORE,
    dashboard_payload,
    releases_payload,
    summarise,
    summarise_entry,
)

if TYPE_CHECKING:
    from homeassistant.auth.models import User

    from .coordinator import LegoConfigEntry


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register the websocket commands."""
    websocket_api.async_register_command(hass, websocket_search)
    websocket_api.async_register_command(hass, websocket_dashboard)
    websocket_api.async_register_command(hass, websocket_releases)
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

    # A set Home Assistant already holds a Brickset record for draws as fully as
    # anywhere else in the panel; the rest carry what the local index knows.
    region = entry.runtime_data.collection.region
    known = _known_sets(entry)
    connection.send_result(
        msg["id"],
        {
            "sets": [
                summarise(known[found.number], region)
                if found.number in known
                else summarise_entry(found, _owned(entry, found.number))
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
    connection.send_result(msg["id"], dashboard_payload(entry, store.settings(user_id)))


@callback
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/releases",
        probatio.Optional("config_entry_id"): str,
        probatio.Optional("scope", default="mine"): probatio.In(RELEASE_SCOPES),
        probatio.Optional("themes", default=list): [str],
        probatio.Optional("span", default="past3"): probatio.In(RELEASE_SPANS),
    }
)
def websocket_releases(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return one release row's sets for a span; read from the feeds, never billed."""
    entry = _loaded_entry(hass, connection, msg)
    if entry is None:
        return

    connection.send_result(
        msg["id"],
        releases_payload(entry, msg["scope"], msg["themes"], msg["span"]),
    )


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


RELEASE_FILTER = probatio.Schema(
    {
        probatio.Optional("scope"): probatio.In(RELEASE_SCOPES),
        probatio.Optional("themes"): [str],
        probatio.Optional("span"): probatio.In(RELEASE_SPANS),
    }
)


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "lego/panel_config/set",
        probatio.Optional("rows"): [str],
        probatio.Optional("hidden"): [str],
        probatio.Optional("collapsed"): [str],
        probatio.Optional("release_mode"): probatio.In(RELEASE_MODES),
        probatio.Optional("release_filters"): {
            probatio.In(RELEASE_ROWS): RELEASE_FILTER
        },
    }
)
@websocket_api.async_response
async def websocket_set_rows(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save whichever panel settings were sent and return them all."""
    # websocket_api.ActiveConnection types user as always set; keep the guard anyway, since a
    # write keyed on a missing user would land in another user's slot.
    if (user := cast("User | None", connection.user)) is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "No signed-in user"
        )
        return

    settings = await hass.data[PANEL_STORE].async_update(
        user.id,
        rows=msg.get("rows"),
        hidden=msg.get("hidden"),
        collapsed=msg.get("collapsed"),
        release_mode=msg.get("release_mode"),
        release_filters=msg.get("release_filters"),
    )
    connection.send_result(msg["id"], settings)


@callback
@websocket_api.websocket_command({probatio.Required("type"): "lego/accounts"})
def websocket_accounts(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List the accounts this user may see, and which one opens by default."""
    visible = _visible_entries(hass, connection)
    connection.send_result(
        msg["id"],
        {
            "accounts": [
                {"entry_id": entry.entry_id, "name": entry.title} for entry in visible
            ],
            "selected": _selected(hass, connection, visible),
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
    """Make an account the one this user's panel opens on."""
    # websocket_api.ActiveConnection types user as always set; keep the guard anyway, since a
    # write keyed on a missing user would land in another user's slot.
    if (user := cast("User | None", connection.user)) is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "No signed-in user"
        )
        return

    entry_id = msg["config_entry_id"]
    if entry_id not in {entry.entry_id for entry in _visible_entries(hass, connection)}:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown LEGO entry"
        )
        return

    await hass.data[PANEL_STORE].async_set_account(user.id, entry_id)
    connection.send_result(msg["id"], {"selected": entry_id})


def _visible_entries(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection
) -> list[LegoConfigEntry]:
    """Return every loaded LEGO entry this user may see."""
    return [
        cast("LegoConfigEntry", item)
        for item in hass.config_entries.async_entries(DOMAIN)
        if item.state is ConfigEntryState.LOADED and can_view(item, connection.user)
    ]


def _selected(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    visible: list[LegoConfigEntry],
) -> str | None:
    """Return the account to show: this user's default, else one of their own."""
    if not visible:
        return None
    user = connection.user
    chosen = hass.data[PANEL_STORE].account(user.id if user else None)
    if any(entry.entry_id == chosen for entry in visible):
        return str(chosen)
    # Before a user picks a default, their own account beats a shared one.
    own = [entry for entry in visible if user and is_linked(entry, user)]
    return (own or visible)[0].entry_id


def _loaded_entry(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> LegoConfigEntry | None:
    """Resolve a loaded LEGO entry this user may see, reporting why not when it fails."""
    requested = msg.get("config_entry_id")
    if requested is None:
        # The panel is registered globally, so it names no entry until it has asked
        # which accounts exist. Falling back to this user's default keeps a browser
        # still running an older bundle working with several accounts.
        visible = _visible_entries(hass, connection)
        if not visible:
            connection.send_error(
                msg["id"], websocket_api.ERR_NOT_FOUND, "No LEGO account is loaded"
            )
            return None
        selected = _selected(hass, connection, visible)
        return next(entry for entry in visible if entry.entry_id == selected)

    entry = hass.config_entries.async_get_entry(requested)
    if entry is None or entry.domain != DOMAIN:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown LEGO entry"
        )
        return None
    # Checked before the entry's state, so a refusal gives away neither it nor the title.
    if not can_view(entry, connection.user):
        connection.send_error(
            msg["id"], websocket_api.ERR_UNAUTHORIZED, "Not your LEGO account"
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


def _known_sets(entry: LegoConfigEntry) -> dict[str, Any]:
    """Every set with a Brickset record: the collection and the feeds."""
    known: dict[str, Any] = {}
    if (feed := entry.runtime_data.feeds.data) is not None:
        for theme_sets in feed.themes.values():
            known.update({lego_set.number: lego_set for lego_set in theme_sets})
        known.update({lego_set.number: lego_set for lego_set in feed.releases or []})
    data = entry.runtime_data.collection.data
    known.update(data.all_sets)
    return known
