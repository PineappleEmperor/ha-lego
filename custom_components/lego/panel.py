"""The optional sidebar panel: registration and its per-user row order."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.loader import async_get_integration

from .const import (
    CONF_PANEL,
    DEFAULT_PANEL,
    DOMAIN,
    PANEL_COMPONENT,
    PANEL_MODULE_URL,
    PANEL_ROWS,
    PANEL_STORAGE_KEY,
    PANEL_URL_PATH,
    STORAGE_VERSION,
)

if TYPE_CHECKING:
    from . import LegoConfigEntry

REGISTERED = f"{DOMAIN}_panel_registered"


class PanelStore:
    """Remembers each user's row order for the panel."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialise an empty store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, PANEL_STORAGE_KEY
        )
        self._rows: dict[str, list[str]] = {}

    async def async_load(self) -> None:
        """Read the stored orders."""
        stored = await self._store.async_load()
        self._rows = {k: list(v) for k, v in (stored or {}).get("rows", {}).items()}

    def rows(self, user_id: str | None) -> list[str]:
        """Return a user's row order, falling back to the default."""
        saved = self._rows.get(user_id or "")
        if not saved:
            return list(PANEL_ROWS)
        # A row added by a later version has no saved position, so it goes last
        # rather than disappearing.
        kept = [row for row in saved if row in PANEL_ROWS]
        return kept + [row for row in PANEL_ROWS if row not in kept]

    async def async_set_rows(self, user_id: str, rows: list[str]) -> list[str]:
        """Save a user's row order, ignoring anything unrecognised."""
        self._rows[user_id] = [row for row in rows if row in PANEL_ROWS]
        await self._store.async_save({"rows": self._rows})
        return self.rows(user_id)


async def async_setup_panel_static(hass: HomeAssistant) -> None:
    """Serve the built panel bundle."""
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                PANEL_MODULE_URL,
                str(Path(__file__).parent / "panel" / "lego-panel.js"),
                False,
            )
        ]
    )


def panel_wanted(hass: HomeAssistant) -> bool:
    """Whether any config entry asks for the sidebar panel."""
    return any(
        entry.options.get(CONF_PANEL, DEFAULT_PANEL)
        for entry in hass.config_entries.async_entries(DOMAIN)
    )


async def async_refresh_panel(hass: HomeAssistant) -> None:
    """Add or remove the sidebar entry to match the option."""
    want = panel_wanted(hass)
    registered = hass.data.get(REGISTERED, False)
    if want and not registered:
        # Claimed before the await, so two entries setting up in parallel cannot
        # both register the panel.
        hass.data[REGISTERED] = True
        integration = await async_get_integration(hass, DOMAIN)
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name=PANEL_COMPONENT,
            module_url=f"{PANEL_MODULE_URL}?v={integration.version}",
            sidebar_title="LEGO",
            sidebar_icon="mdi:toy-brick",
            require_admin=False,
        )
    elif registered and not want:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
        hass.data[REGISTERED] = False


def summarise(lego_set: Any, region: str) -> dict[str, Any]:
    """Reduce a set to what the panel draws."""
    pricing = lego_set.pricing.get(region)
    return {
        "set_number": lego_set.number,
        "name": lego_set.name,
        "year": lego_set.year,
        "theme": lego_set.theme,
        "pieces": lego_set.pieces,
        "minifigs": lego_set.minifigs,
        "image": lego_set.thumbnail_url or lego_set.image_url,
        "url": lego_set.brickset_url,
        "owned": lego_set.collection.owned,
        "wanted": lego_set.collection.wanted,
        "qty_owned": lego_set.collection.qty_owned,
        "retail_price": pricing.retail_price if pricing else None,
        "released": lego_set.released,
        "available_from": (
            pricing.date_first_available.isoformat()
            if pricing and pricing.date_first_available
            else None
        ),
        "available_until": (
            pricing.date_last_available.isoformat()
            if pricing and pricing.date_last_available
            else None
        ),
    }


def dashboard_payload(entry: LegoConfigEntry, rows: list[str]) -> dict[str, Any]:
    """Build everything the panel's home view needs in one reply."""
    data = entry.runtime_data.collection.data
    region = entry.runtime_data.collection.region
    summary = data.summary if data else None
    return {
        "rows": rows,
        "region": region,
        "stats": {
            "sets_owned": summary.sets_owned if summary else 0,
            "sets_distinct": summary.sets_distinct if summary else 0,
            "pieces_owned": summary.pieces_owned if summary else 0,
            "minifigs_owned": summary.minifigs_owned if summary else 0,
            "sets_wanted": summary.sets_wanted if summary else 0,
            "value": summary.value if summary else 0.0,
            "sets_missing_price": summary.sets_missing_price if summary else 0,
        },
        "wishlist": [summarise(item, region) for item in (data.wanted if data else [])],
        "themes": {
            theme: [summarise(item, region) for item in sets]
            for theme, sets in (entry.runtime_data.feeds.data or {}).items()
        },
    }
