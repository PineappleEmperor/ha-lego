"""Actions for the LEGO integration."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .const import (
    ATTR_CONFIG_ENTRY_ID,
    ATTR_LIMIT,
    ATTR_NOTES,
    ATTR_OWNED,
    ATTR_QTY_OWNED,
    ATTR_QUERY,
    ATTR_RATING,
    ATTR_SET_NUMBER,
    ATTR_THEME,
    ATTR_WANTED,
    ATTR_YEAR,
    CONF_WATCHLIST,
    DOMAIN,
    SERVICE_ADD_WATCH,
    SERVICE_REMOVE_WATCH,
    SERVICE_SEARCH_SETS,
    SERVICE_SET_COLLECTION,
)
from .exceptions import BricksetError, BricksetUserHashError
from .models import LegoSet

if TYPE_CHECKING:
    from . import LegoConfigEntry

ENTRY_SCHEMA = {vol.Required(ATTR_CONFIG_ENTRY_ID): cv.string}

SET_COLLECTION_SCHEMA = vol.Schema(
    {
        **ENTRY_SCHEMA,
        vol.Required(ATTR_SET_NUMBER): cv.string,
        vol.Optional(ATTR_OWNED): cv.boolean,
        vol.Optional(ATTR_WANTED): cv.boolean,
        vol.Optional(ATTR_QTY_OWNED): vol.All(
            vol.Coerce(int), vol.Range(min=0, max=999)
        ),
        vol.Optional(ATTR_RATING): vol.All(vol.Coerce(int), vol.Range(min=1, max=5)),
        vol.Optional(ATTR_NOTES): vol.All(cv.string, vol.Length(max=1000)),
    }
)

WATCH_SCHEMA = vol.Schema({**ENTRY_SCHEMA, vol.Required(ATTR_SET_NUMBER): cv.string})

SEARCH_SCHEMA = vol.Schema(
    {
        **ENTRY_SCHEMA,
        vol.Optional(ATTR_QUERY): cv.string,
        vol.Optional(ATTR_THEME): cv.string,
        vol.Optional(ATTR_YEAR): vol.All(
            vol.Coerce(int), vol.Range(min=1949, max=2100)
        ),
        vol.Optional(ATTR_LIMIT, default=10): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=50)
        ),
    }
)


def _get_entry(hass: HomeAssistant, call: ServiceCall) -> LegoConfigEntry:
    """Resolve and validate the targeted config entry."""
    entry_id = call.data[ATTR_CONFIG_ENTRY_ID]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="entry_not_found",
            translation_placeholders={"entry_id": entry_id},
        )
    if entry.state is not ConfigEntryState.LOADED:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="entry_not_loaded",
            translation_placeholders={"title": entry.title},
        )
    return cast("LegoConfigEntry", entry)


def _summarise(lego_set: LegoSet) -> dict[str, Any]:
    """Reduce a set to the fields worth returning from an action."""
    return {
        "set_number": lego_set.number,
        "name": lego_set.name,
        "year": lego_set.year,
        "theme": lego_set.theme,
        "subtheme": lego_set.subtheme,
        "pieces": lego_set.pieces,
        "minifigs": lego_set.minifigs,
        "owned": lego_set.collection.owned,
        "qty_owned": lego_set.collection.qty_owned,
        "wanted": lego_set.collection.wanted,
        "image_url": lego_set.image_url,
        "brickset_url": lego_set.brickset_url,
    }


async def _async_resolve_set(entry: LegoConfigEntry, number: str) -> LegoSet:
    """Find a set by number, falling back to a billed lookup."""
    known = entry.runtime_data.collection.data
    if known is not None and (lego_set := known.all_sets.get(number)) is not None:
        return lego_set

    catalogue = entry.runtime_data.catalogue
    if catalogue is not None and (set_id := catalogue.set_id(number)) is not None:
        listed = catalogue.entry(number)
        return LegoSet(set_id=set_id, number=number, name=listed.name if listed else "")

    try:
        matches = await entry.runtime_data.client.get_sets({"setNumber": number})
    except BricksetError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="api_error",
            translation_placeholders={"error": str(err)},
        ) from err

    if not matches:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="set_not_found",
            translation_placeholders={"set_number": number},
        )
    return matches[0]


def _updated_watchlist(
    entry: ConfigEntry, number: str, *, add: bool
) -> list[str] | None:
    """Return the new watchlist, or None when nothing would change."""
    current: list[str] = list(entry.options.get(CONF_WATCHLIST, []))
    if add:
        if number in current:
            return None
        return [*current, number]
    if number not in current:
        return None
    return [item for item in current if item != number]


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the LEGO actions."""

    async def async_set_collection(call: ServiceCall) -> None:
        """Update a set's ownership record on Brickset."""
        entry = _get_entry(hass, call)
        lego_set = await _async_resolve_set(entry, call.data[ATTR_SET_NUMBER])

        try:
            await entry.runtime_data.client.set_collection(
                lego_set.set_id,
                own=call.data.get(ATTR_OWNED),
                want=call.data.get(ATTR_WANTED),
                qty_owned=call.data.get(ATTR_QTY_OWNED),
                rating=call.data.get(ATTR_RATING),
                notes=call.data.get(ATTR_NOTES),
            )
        except BricksetUserHashError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN, translation_key="auth_expired"
            ) from err
        except BricksetError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="api_error",
                translation_placeholders={"error": str(err)},
            ) from err
        except ValueError as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN, translation_key="no_changes"
            ) from err

        await entry.runtime_data.collection.async_request_refresh()

    async def async_add_watch(call: ServiceCall) -> None:
        """Add a set to the watchlist."""
        entry = _get_entry(hass, call)
        number = call.data[ATTR_SET_NUMBER]
        await _async_resolve_set(entry, number)
        if (watchlist := _updated_watchlist(entry, number, add=True)) is not None:
            hass.config_entries.async_update_entry(
                entry, options={**entry.options, CONF_WATCHLIST: watchlist}
            )

    async def async_remove_watch(call: ServiceCall) -> None:
        """Remove a set from the watchlist."""
        entry = _get_entry(hass, call)
        number = call.data[ATTR_SET_NUMBER]
        if (watchlist := _updated_watchlist(entry, number, add=False)) is not None:
            hass.config_entries.async_update_entry(
                entry, options={**entry.options, CONF_WATCHLIST: watchlist}
            )

    async def async_search_sets(call: ServiceCall) -> ServiceResponse:
        """Search the Brickset catalogue and return the matches."""
        entry = _get_entry(hass, call)
        params: dict[str, Any] = {"pageSize": call.data[ATTR_LIMIT]}
        if query := call.data.get(ATTR_QUERY):
            params["query"] = query
        if theme := call.data.get(ATTR_THEME):
            params["theme"] = theme
        if year := call.data.get(ATTR_YEAR):
            params["year"] = year
        if len(params) == 1:
            raise ServiceValidationError(
                translation_domain=DOMAIN, translation_key="search_needs_criteria"
            )

        try:
            matches = await entry.runtime_data.client.get_sets(params)
        except BricksetError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="api_error",
                translation_placeholders={"error": str(err)},
            ) from err

        return {"sets": [_summarise(lego_set) for lego_set in matches]}

    hass.services.async_register(
        DOMAIN, SERVICE_SET_COLLECTION, async_set_collection, SET_COLLECTION_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ADD_WATCH, async_add_watch, WATCH_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_WATCH, async_remove_watch, WATCH_SCHEMA
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_SEARCH_SETS,
        async_search_sets,
        SEARCH_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
