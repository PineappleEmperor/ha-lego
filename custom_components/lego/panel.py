"""The optional sidebar panel and dashboard cards: registration and per-user layout."""

from datetime import date, timedelta
from pathlib import Path
from typing import TYPE_CHECKING, Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util
from homeassistant.util.hass_dict import HassKey

from .const import (
    CONF_PANEL,
    DEFAULT_PANEL,
    DOMAIN,
    PANEL_COMPONENT,
    PANEL_DEFAULT_COLLAPSED,
    PANEL_DEFAULT_HIDDEN,
    PANEL_ICON_URL,
    PANEL_MODULE_URL,
    PANEL_ROWS,
    PANEL_STORAGE_KEY,
    PANEL_URL_PATH,
    REBRICKABLE_THUMBNAIL_URL,
    REGION_CURRENCY,
    RELEASE_MODES,
    RELEASE_ROWS,
    RELEASES_WINDOW_DAYS,
    STORAGE_VERSION,
)

if TYPE_CHECKING:
    from .catalogue import CatalogueEntry
    from .coordinator import FeedsData, LegoConfigEntry
    from .models import LegoSet

# "Past 3 months" and "Next 3 months": thirteen weeks.
QUARTER_DAYS = 91

REGISTERED: HassKey[bool] = HassKey(f"{DOMAIN}_panel_registered")


class PanelStore:
    """Remembers each user's panel layout, release filters and chosen account."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialise an empty store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, PANEL_STORAGE_KEY
        )
        self._rows: dict[str, list[str]] = {}
        self._hidden: dict[str, list[str]] = {}
        self._collapsed: dict[str, list[str]] = {}
        self._release_mode: dict[str, str] = {}
        self._release_filters: dict[str, dict[str, dict[str, Any]]] = {}
        self._collection_prices: dict[str, bool] = {}
        self._accounts: dict[str, str] = {}

    async def async_load(self) -> None:
        """Read everything stored, each user's settings under one key."""
        stored = await self._store.async_load() or {}
        self._rows = {k: list(v) for k, v in stored.get("rows", {}).items()}
        self._hidden = {k: list(v) for k, v in stored.get("hidden", {}).items()}
        self._collapsed = {k: list(v) for k, v in stored.get("collapsed", {}).items()}
        self._release_mode = dict(stored.get("release_mode", {}))
        self._release_filters = {
            k: dict(v) for k, v in stored.get("release_filters", {}).items()
        }
        self._collection_prices = {
            k: bool(v) for k, v in stored.get("collection_prices", {}).items()
        }
        self._accounts = {k: str(v) for k, v in stored.get("accounts", {}).items()}

    async def async_remove(self) -> None:
        """Forget every user's settings and delete the file, once no account is left."""
        await self._store.async_remove()
        await self.async_load()

    async def _async_save(self) -> None:
        """Write every map, since they share one storage key."""
        await self._store.async_save(
            {
                "rows": self._rows,
                "hidden": self._hidden,
                "collapsed": self._collapsed,
                "release_mode": self._release_mode,
                "release_filters": self._release_filters,
                "collection_prices": self._collection_prices,
                "accounts": self._accounts,
            }
        )

    def rows(self, user_id: str | None) -> list[str]:
        """Return a user's row order, falling back to the default."""
        saved = self._rows.get(user_id or "")
        if not saved:
            return list(PANEL_ROWS)
        kept = [row for row in saved if row in PANEL_ROWS]
        missing = [row for row in PANEL_ROWS if row not in kept]
        if "releases" in missing:
            # The combined row replaces the release rows a user already placed, so
            # it takes their position rather than sinking to the bottom.
            missing.remove("releases")
            at = next(
                (i for i, row in enumerate(kept) if row in RELEASE_ROWS), len(kept)
            )
            kept.insert(at, "releases")
        # Any other row added by a later version goes last rather than disappearing.
        return kept + missing

    def hidden(self, user_id: str | None) -> list[str]:
        """Return the rows a user has taken off their panel."""
        saved = self._hidden.get(user_id or "")
        if saved is None:
            return list(PANEL_DEFAULT_HIDDEN)
        return [row for row in saved if row in PANEL_ROWS]

    def collapsed(self, user_id: str | None) -> list[str]:
        """Return the rows that open folded to their header for this user."""
        saved = self._collapsed.get(user_id or "")
        if saved is None:
            return list(PANEL_DEFAULT_COLLAPSED)
        return [row for row in saved if row in PANEL_ROWS]

    def settings(self, user_id: str | None) -> dict[str, Any]:
        """Return everything the panel lays itself out from, for one user."""
        key = user_id or ""
        return {
            "rows": self.rows(user_id),
            "hidden": self.hidden(user_id),
            "collapsed": self.collapsed(user_id),
            "release_mode": self._release_mode.get(key, RELEASE_MODES[0]),
            "release_filters": {
                row: dict(value)
                for row, value in self._release_filters.get(key, {}).items()
                if row in RELEASE_ROWS
            },
            "collection_prices": self._collection_prices.get(key, True),
        }

    async def async_update(
        self,
        user_id: str,
        *,
        rows: list[str] | None = None,
        hidden: list[str] | None = None,
        collapsed: list[str] | None = None,
        release_mode: str | None = None,
        release_filters: dict[str, dict[str, Any]] | None = None,
        collection_prices: bool | None = None,
    ) -> dict[str, Any]:
        """Save whichever settings were sent, ignoring rows this version lacks."""
        if rows is not None:
            self._rows[user_id] = [row for row in rows if row in PANEL_ROWS]
        if hidden is not None:
            self._hidden[user_id] = [row for row in hidden if row in PANEL_ROWS]
        if collapsed is not None:
            self._collapsed[user_id] = [row for row in collapsed if row in PANEL_ROWS]
        if release_mode is not None:
            self._release_mode[user_id] = release_mode
        if release_filters is not None:
            merged = self._release_filters.setdefault(user_id, {})
            merged.update(
                {
                    row: value
                    for row, value in release_filters.items()
                    if row in RELEASE_ROWS
                }
            )
        if collection_prices is not None:
            self._collection_prices[user_id] = collection_prices
        await self._async_save()
        return self.settings(user_id)

    def account(self, user_id: str | None) -> str | None:
        """Return the entry id this user last looked at, if any."""
        return self._accounts.get(user_id or "")

    async def async_set_account(self, user_id: str, entry_id: str) -> None:
        """Remember which account this user's panel is showing."""
        self._accounts[user_id] = entry_id
        await self._async_save()


PANEL_STORE: HassKey[PanelStore] = HassKey(f"{DOMAIN}_panel_store")


def _module_url(version: Any) -> str:
    """Return the bundle's URL, versioned so a browser drops an old copy."""
    return f"{PANEL_MODULE_URL}?v={version}"


async def async_setup_panel_static(hass: HomeAssistant) -> None:
    """Serve the bundle and brand icon, and load the bundle's cards on every page."""
    here = Path(__file__).parent
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                PANEL_MODULE_URL, str(here / "panel" / "lego-panel.js"), False
            ),
            StaticPathConfig(PANEL_ICON_URL, str(here / "brand" / "icon.png"), True),
        ]
    )
    integration = await async_get_integration(hass, DOMAIN)
    # The panel loads this exact URL too, and a browser evaluates a module once per
    # URL, so the panel page does not define the cards twice.
    frontend.add_extra_js_url(hass, _module_url(integration.version))


def panel_wanted(hass: HomeAssistant) -> bool:
    """Whether any set-up config entry asks for the sidebar panel."""
    # An entry being unloaded or disabled still exists, so counting every entry
    # left the panel in the sidebar with nothing behind it.
    return any(
        entry.options.get(CONF_PANEL, DEFAULT_PANEL)
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state in (ConfigEntryState.LOADED, ConfigEntryState.SETUP_IN_PROGRESS)
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
            module_url=_module_url(integration.version),
            sidebar_title="LEGO",
            sidebar_icon="mdi:toy-brick",
            require_admin=False,
            handle_safe_area=False,  # the panel sets no insets, so keep HA's padding
        )
    elif registered and not want:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
        hass.data[REGISTERED] = False


def summarise(lego_set: Any, region: str) -> dict[str, Any]:
    """Reduce a set to what the panel draws."""
    pricing = lego_set.pricing.get(region)
    released = lego_set.release_date(region)
    retires = lego_set.retirement_date(region)
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
        # The region's own dates, else Brickset's set-wide ones, as the rows sort by.
        "available_from": released.isoformat() if released else None,
        "available_until": retires.isoformat() if retires else None,
    }


def summarise_entry(entry: CatalogueEntry, owned: bool) -> dict[str, Any]:
    """Give a set known only to the local index the shape summarise() returns."""
    # The index holds number, name, year and theme only, so a card shows those,
    # Rebrickable's picture of the number, and the plain Brickset page for the rest.
    return {
        "set_number": entry.number,
        "name": entry.name,
        "year": entry.year,
        "theme": entry.theme,
        "pieces": None,
        "minifigs": None,
        "image": REBRICKABLE_THUMBNAIL_URL.format(number=entry.number.lower()),
        "url": f"https://brickset.com/sets/{entry.number}",
        "owned": owned,
        "wanted": False,
        "qty_owned": 1 if owned else 0,
        "retail_price": None,
        "released": False,
        "available_from": None,
        "available_until": None,
    }


def _wishlist_key(
    item: LegoSet, region: str, today: date
) -> tuple[bool, bool, date, str, str]:
    """Sort a wishlist soonest to retire first, as the wishlist sensor does."""
    retires = item.retirement_date(region)
    # A retired set is the least actionable thing on a wishlist, so it sinks.
    return (
        retires is not None and retires < today,
        retires is None,
        retires or date.max,
        item.name,
        item.number,
    )


def span_window(span: str, today: date) -> tuple[date, date]:
    """Return the first and last release day a span covers."""
    month = timedelta(days=RELEASES_WINDOW_DAYS)
    quarter = timedelta(days=QUARTER_DAYS)
    tomorrow = today + timedelta(days=1)
    windows = {
        "around": (today - quarter, today + quarter),
        "year": (date(today.year, 1, 1), date(today.year, 12, 31)),
        "past3": (today - quarter, today),
        "past1": (today - month, today),
        "next1": (tomorrow, today + month),
        "next3": (tomorrow, today + quarter),
    }
    return windows.get(span, (tomorrow, date.max))


def _is_set(item: LegoSet) -> bool:
    """Whether an entry is a set, not a keyring, magnet or book filed beside it."""
    return item.category in ("", "Normal")


def release_sets(
    sets: list[LegoSet], region: str, span: str, today: date
) -> list[LegoSet]:
    """Pick the sets within a span: newest first behind today, soonest ahead."""
    start, end = span_window(span, today)
    dated: list[tuple[date, LegoSet]] = []
    undated: list[LegoSet] = []
    for item in filter(_is_set, sets):
        released = item.release_date(region)
        if released is None:
            # Announced without a date is still to come; out without one is not news.
            if span == "coming" and not item.released:
                undated.append(item)
            continue
        if start <= released <= end:
            dated.append((released, item))
    out = sorted(
        (pair for pair in dated if pair[0] <= today),
        key=lambda pair: (-pair[0].toordinal(), pair[1].number),
    )
    ahead = sorted(
        (pair for pair in dated if pair[0] > today),
        key=lambda pair: (pair[0], pair[1].number),
    )
    # A span either side of today leads with what just came out, then what is next.
    return [item for _, item in out + ahead] + sorted(
        undated, key=lambda item: item.number
    )


def release_timeline(
    sets: list[LegoSet], region: str, today: date
) -> list[dict[str, str]]:
    """Every dated set from 1 January to the end of next March, oldest first."""
    start, end = date(today.year, 1, 1), date(today.year + 1, 3, 31)
    points = [
        (released, item.theme, item.number, item.name)
        for item in filter(_is_set, sets)
        if (released := item.release_date(region)) is not None
        and start <= released <= end
    ]
    # Named, so hovering a stack of dots can say which sets they are.
    return [
        {"date": day.isoformat(), "theme": theme, "number": number, "name": name}
        for day, theme, number, name in sorted(points)
    ]


def _release_status(entry: LegoConfigEntry, scope: str) -> str | None:
    """Say whether a scope's sets are in, still coming, failed, or not followed."""
    feeds = entry.runtime_data.feeds
    feed = feeds.data
    if scope == "all" and not feeds.releases:
        return None
    if scope == "mine" and not feeds.themes:
        return None
    have = feed is not None and (scope == "mine" or feed.releases is not None)
    # Fetched in the background after setup, so empty may only mean not yet.
    if have:
        return "ready"
    return "fetching" if feeds.last_update_success else "failed"


def _scope_sets(entry: LegoConfigEntry, scope: str, themes: list[str]) -> list[LegoSet]:
    """Return every set a scope covers: all of LEGO, or the followed themes picked."""
    # Typed as always present, but None until the first poll lands.
    feed: FeedsData | None = entry.runtime_data.feeds.data
    if feed is None:
        return []
    if scope == "all":
        return list(feed.releases or [])
    picked = {theme.casefold() for theme in themes}
    found: dict[str, LegoSet] = {}
    for theme, theme_sets in feed.themes.items():
        if not picked or theme.casefold() in picked:
            found.update({item.number: item for item in theme_sets})
    return list(found.values())


def releases_payload(
    entry: LegoConfigEntry, scope: str, themes: list[str], span: str
) -> dict[str, Any]:
    """Build one release row: its sets for the span and the year's timeline."""
    region = entry.runtime_data.collection.region
    today = dt_util.now().date()
    sets = _scope_sets(entry, scope, themes)
    start, end = span_window(span, today)
    return {
        "status": _release_status(entry, scope),
        "span": {
            "from": start.isoformat(),
            "to": None if end == date.max else end.isoformat(),
        },
        "sets": [
            summarise(item, region) for item in release_sets(sets, region, span, today)
        ],
        "timeline": release_timeline(sets, region, today),
    }


def _by_theme(owned: list[LegoSet], region: str) -> list[dict[str, Any]]:
    """Total the owned collection per theme, most valuable first."""
    themes: dict[str, dict[str, Any]] = {}
    for lego_set in owned:
        qty = max(lego_set.collection.qty_owned, 1)
        row = themes.setdefault(
            lego_set.theme or "Other",
            {
                "theme": lego_set.theme or "Other",
                "value": 0.0,
                "pieces": 0,
                "sets": 0,
                "set_numbers": [],
            },
        )
        row["value"] += (lego_set.price(region) or 0.0) * qty
        row["pieces"] += (lego_set.pieces or 0) * qty
        row["sets"] += qty
        row["set_numbers"].append(lego_set.number)
    for row in themes.values():
        row["set_numbers"].sort()
    return sorted(themes.values(), key=lambda row: (-row["value"], row["theme"]))


def _statistic_ids(
    hass: HomeAssistant, entry: LegoConfigEntry
) -> dict[str, str | None]:
    """Name the sensors whose long-term statistics the panel draws as history."""
    registry = er.async_get(hass)
    return {
        key: registry.async_get_entity_id(
            "sensor", DOMAIN, f"{entry.entry_id}_{unique_suffix}"
        )
        for key, unique_suffix in (
            ("value", "collection_value"),
            ("pieces", "pieces_owned"),
        )
    }


def dashboard_payload(
    entry: LegoConfigEntry, settings: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Build everything the panel's home view needs in one reply."""
    collection = entry.runtime_data.collection
    data = collection.data
    region = collection.region
    summary = data.summary if data else None
    quota = collection.quota
    # Actions target the account's device, so the panel needs its id to call them.
    device = dr.async_get(collection.hass).async_get_device_by_identifier(
        (DOMAIN, entry.entry_id), entry.entry_id
    )
    today = dt_util.now().date()
    wanted = sorted(
        data.wanted if data else [],
        key=lambda item: _wishlist_key(item, region, today),
    )
    settings = settings or {
        "rows": list(PANEL_ROWS),
        "hidden": list(PANEL_DEFAULT_HIDDEN),
        "collapsed": list(PANEL_DEFAULT_COLLAPSED),
        "release_mode": RELEASE_MODES[0],
        "release_filters": {},
        "collection_prices": True,
    }
    return {
        "entry_id": entry.entry_id,
        "device_id": device.id if device else None,
        **settings,
        # Current totals per theme, and the sensors whose recorded statistics
        # give the same totals over time.
        "by_theme": _by_theme(data.owned if data else [], region),
        "history": _statistic_ids(collection.hass, entry),
        "region": region,
        # Prices are LEGO.com RRP in the region's own currency.
        "currency": REGION_CURRENCY.get(region),
        "quota": {
            "calls_today": quota.calls_today,
            "budget": quota.budget,
            "remaining": quota.remaining,
            "refresh_cost": entry.runtime_data.collection.poll_cost,
            "resets_at": quota.resets_at.isoformat(),
        },
        # The panel shows how old the data is, which matters once the budget is spent
        # and polls keep serving the last sync.
        "last_synced": (
            collection.last_synced.isoformat() if collection.last_synced else None
        ),
        "stats": {
            "sets_owned": summary.sets_owned if summary else 0,
            "sets_distinct": summary.sets_distinct if summary else 0,
            "pieces_owned": summary.pieces_owned if summary else 0,
            "minifigs_owned": summary.minifigs_owned if summary else 0,
            "sets_wanted": summary.sets_wanted if summary else 0,
            "value": summary.value if summary else 0.0,
            "sets_missing_price": summary.sets_missing_price if summary else 0,
        },
        "wishlist": [summarise(item, region) for item in wanted],
        # The release rows fetch their own sets through lego/releases; the home view
        # says only which scopes exist and whether their data is in. None means off.
        "release_status": {
            "all": _release_status(entry, "all"),
            "mine": _release_status(entry, "mine"),
        },
        "followed": list(entry.runtime_data.feeds.themes),
    }
