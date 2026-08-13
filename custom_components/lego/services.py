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
from homeassistant.helpers import config_validation as cv, issue_registry as ir
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
    CONF_CATALOGUE_RICH,
    DEFAULT_CATALOGUE_RICH,
    DOMAIN,
    SERVICE_REFRESH_CATALOGUE,
    SERVICE_REFRESH_COLLECTION,
    SERVICE_SEARCH_SETS,
    SERVICE_SET_COLLECTION,
)
from .exceptions import BricksetError, BricksetQuotaError, BricksetUserHashError
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

ENTRY_ONLY = vol.Schema(ENTRY_SCHEMA)

NONE = SupportsResponse.NONE
ONLY = SupportsResponse.ONLY
OPTIONAL = SupportsResponse.OPTIONAL

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


async def async_refresh_catalogue(call: ServiceCall) -> ServiceResponse:
    """Re-download the local set index, ignoring how recently it was fetched."""
    entry = _get_entry(call.hass, call)
    catalogue = entry.runtime_data.catalogue
    if catalogue is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="catalogue_disabled"
        )

    rich = entry.options.get(CONF_CATALOGUE_RICH, DEFAULT_CATALOGUE_RICH)
    updated = await catalogue.async_refresh(rich=rich)
    if not updated and not catalogue.loaded:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="catalogue_unavailable"
        )

    return {
        "updated": updated,
        "sets": catalogue.size,
        "fetched": catalogue.fetched.isoformat() if catalogue.fetched else None,
    }


async def async_refresh_collection(call: ServiceCall) -> ServiceResponse:
    """Poll Brickset now rather than waiting for the interval."""
    entry = _get_entry(call.hass, call)
    collection = entry.runtime_data.collection
    cost = collection.poll_cost
    try:
        collection.quota.reserve(cost)
    except BricksetQuotaError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key="quota_spent",
            translation_placeholders={
                "calls_today": str(collection.quota.calls_today),
                "budget": str(collection.quota.budget),
                "cost": str(cost),
            },
        ) from err

    await collection.async_refresh()
    return {
        "cost": cost,
        "calls_today": collection.quota.calls_today,
        "remaining": collection.quota.remaining,
        "updated": collection.last_update_success,
    }


def _write_issue_id(entry: ConfigEntry) -> str:
    """Identify the repair issue for a rejected collection write."""
    return f"collection_write_failed_{entry.entry_id}"


@callback
def _async_report_write_failure(
    hass: HomeAssistant, entry: ConfigEntry, error: str
) -> None:
    """Record a rejected write where a user will see it."""
    ir.async_create_issue(
        hass,
        DOMAIN,
        _write_issue_id(entry),
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="collection_write_failed",
        translation_placeholders={"name": entry.title, "error": error},
    )


@callback
def _async_write_succeeded(
    hass: HomeAssistant, entry: LegoConfigEntry, lego_set: LegoSet, call: ServiceCall
) -> None:
    """Clear any past rejection and fold the change into the cached collection."""
    ir.async_delete_issue(hass, DOMAIN, _write_issue_id(entry))
    entry.runtime_data.collection.apply_collection_change(
        lego_set,
        own=call.data.get(ATTR_OWNED),
        want=call.data.get(ATTR_WANTED),
        qty_owned=call.data.get(ATTR_QTY_OWNED),
        rating=call.data.get(ATTR_RATING),
        notes=call.data.get(ATTR_NOTES),
    )


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
            # A UI call shows the raise; a call from an automation only reaches the log.
            _async_report_write_failure(hass, entry, str(err))
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="api_error",
                translation_placeholders={"error": str(err)},
            ) from err
        except ValueError as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN, translation_key="no_changes"
            ) from err

        _async_write_succeeded(hass, entry, lego_set, call)

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

    for name, handler, schema, response in (
        (SERVICE_SET_COLLECTION, async_set_collection, SET_COLLECTION_SCHEMA, NONE),
        (SERVICE_SEARCH_SETS, async_search_sets, SEARCH_SCHEMA, ONLY),
        (SERVICE_REFRESH_CATALOGUE, async_refresh_catalogue, ENTRY_ONLY, OPTIONAL),
        (SERVICE_REFRESH_COLLECTION, async_refresh_collection, ENTRY_ONLY, OPTIONAL),
    ):
        hass.services.async_register(
            DOMAIN, name, handler, schema, supports_response=response
        )
