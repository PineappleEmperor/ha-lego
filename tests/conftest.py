"""Fixtures for the integration's tests."""

from collections.abc import Awaitable, Callable
from copy import deepcopy
import gzip
import json
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.const import CONF_API_KEY, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import (
    AiohttpClientMocker,
    AiohttpClientMockResponse,
)

# Without this import, setup fails with "Integration not found".
import custom_components  # noqa: F401
from custom_components.lego.const import CONF_THEMES, CONF_USER_HASH, DOMAIN

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let Home Assistant load integrations from custom_components/ in every test."""


@pytest.fixture
def spring(freezer: FrozenDateTimeFactory) -> None:
    """Freeze the clock on a spring day, for a test whose answer depends on it.

    Only tests that count calls or read a fixed date ask for this; the rest run
    on the real clock. A spring day is neither end of the release window nor
    past the month next year's sets are assumed announced.
    """
    freezer.move_to("2026-05-15 12:00:00+00:00")


SETS_CSV_URL = "https://cdn.rebrickable.com/media/downloads/sets.csv.gz"
THEMES_CSV_URL = "https://cdn.rebrickable.com/media/downloads/themes.csv.gz"

# id,name,parent_id — 100 is a real theme, 500 is Gear and must be filtered out.
THEMES_CSV = (
    "id,name,parent_id\n100,Icons,\n101,Technic,\n500,Gear,\n501,Key Chain,500\n"
)
SETS_CSV = (
    "set_num,name,year,theme_id,num_parts,img_url\n"
    "10497-1,Galaxy Explorer,2022,100,1254,https://img/10497-1.jpg\n"
    "42200-1,New Technic Thing,2026,101,900,https://img/42200-1.jpg\n"
    "99999-1,Brick Keyring,2019,501,1,https://img/99999-1.jpg\n"
)

API_BASE = "https://brickset.com/api/v3.asmx"

USER_HASH = "hash-abc123"
API_KEY = "key-xyz789"
USERNAME = "brickfan"


def make_set(
    set_id: int,
    number: str,
    name: str,
    *,
    theme: str = "Icons",
    year: int = 2024,
    pieces: int = 1000,
    minifigs: int = 3,
    owned: bool = False,
    wanted: bool = False,
    qty_owned: int = 0,
    price: float | None = 99.99,
    first_available: str | None = "2024-01-01T00:00:00Z",
    last_available: str | None = "2099-12-31T00:00:00Z",
    launch_date: str | None = None,
    exit_date: str | None = None,
    priority: int = 1,
    released: bool = True,
    category: str = "Normal",
) -> dict[str, Any]:
    """Build a getSets record shaped like Brickset's own payloads."""
    uk: dict[str, Any] = {}
    if price is not None:
        uk["retailPrice"] = price
    if first_available is not None:
        uk["dateFirstAvailable"] = first_available
    if last_available is not None:
        uk["dateLastAvailable"] = last_available

    base, _, variant = number.partition("-")
    dates = {}
    if launch_date is not None:
        dates["launchDate"] = launch_date
    if exit_date is not None:
        dates["exitDate"] = exit_date
    return {
        **dates,
        "setID": set_id,
        "number": base,
        "numberVariant": int(variant or 1),
        "name": name,
        "year": year,
        "theme": theme,
        "themeGroup": "Model making",
        "subtheme": "",
        "category": category,
        "released": released,
        "pieces": pieces,
        "minifigs": minifigs,
        "image": {
            "thumbnailURL": f"https://images.brickset.com/sets/small/{number}.jpg",
            "imageURL": f"https://images.brickset.com/sets/images/{number}.jpg",
        },
        "bricksetURL": f"https://brickset.com/sets/{number}",
        "collection": {
            "owned": owned,
            "wanted": wanted,
            "qtyOwned": qty_owned,
            "qtyWanted": 1 if wanted else 0,
            "qtyOwnedNew": qty_owned,
            "qtyOwnedUsed": 0,
            "wantedPriority": priority,
            "notes": "",
        },
        "collections": {"ownedBy": 100, "wantedBy": 50},
        "LEGOCom": {"UK": uk} if uk else {},
        "rating": 4.5,
        "reviewCount": 10,
        "packagingType": "Box",
        "availability": "Retail",
        "instructionsCount": 1,
        "additionalImageCount": 2,
        "ageRange": {"min": 18},
        "dimensions": {},
        "barcode": {},
        "lastUpdated": "2026-01-01T00:00:00Z",
    }


OWNED_SETS = [
    make_set(
        1,
        "10497-1",
        "Galaxy Explorer",
        owned=True,
        qty_owned=2,
        pieces=1254,
        minifigs=4,
        price=90.0,
    ),
    make_set(
        2,
        "10305-1",
        "Lion Knights' Castle",
        owned=True,
        qty_owned=1,
        pieces=4514,
        minifigs=22,
        price=344.99,
    ),
    make_set(
        3,
        "6876-1",
        "Alienator",
        owned=True,
        qty_owned=1,
        pieces=100,
        minifigs=1,
        year=1990,
        price=None,
        first_available=None,
        last_available=None,
    ),
]

WANTED_SETS = [
    make_set(
        4,
        "10294-1",
        "Titanic",
        wanted=True,
        pieces=9090,
        minifigs=0,
        price=629.99,
    ),
]

THEME_SETS = [
    make_set(5, "42200-1", "New Technic Thing", theme="Technic", year=2026),
    make_set(6, "42199-1", "Older Technic Thing", theme="Technic", year=2026),
]


class BricksetServer:
    """A fake Brickset API v3, wired into the aiohttp boundary."""

    def __init__(self, mocker: AiohttpClientMocker) -> None:
        """Register every endpoint the integration uses."""
        # Deep copies, so a test that mutates a set record cannot leak into the next.
        self.owned = deepcopy(OWNED_SETS)
        self.wanted = deepcopy(WANTED_SETS)
        self.theme_sets = deepcopy(THEME_SETS)
        # Every set of a year, answered a page at a time to a year-only query.
        self.year_sets: list[dict[str, Any]] = []
        self.usage_today = 0
        self.usage_checks = 0
        self.get_sets_calls: list[dict[str, Any]] = []
        self.set_collection_calls: list[dict[str, Any]] = []
        # Like Brickset, every call must carry a key it issued, and the calls
        # reading or writing the user's collection the hash it handed out at login.
        self.api_keys = {API_KEY, "second-key"}
        self.user_hash = USER_HASH
        # The hashes Brickset would accept: the fixture's account, and the second
        # account the multi-account tests set up beside it.
        self.user_hashes = {USER_HASH, "second-hash"}
        self.key_valid = True
        self.credentials_valid = True
        self.hash_valid = True
        # When set, every getSets call fails with this message.
        self.get_sets_error: str | None = None
        # When set, every setCollection call fails with this message.
        self.set_collection_error: str | None = None
        # When set, every getThemes call fails with this message.
        self.themes_error: str | None = None
        # Clear this to act like a Brickset that stopped accepting comma-joined themes.
        self.themes_batchable = True
        # Set this to answer theme queries for the requested year only, as Brickset
        # does; most tests leave it off so their fixture sets match any year.
        self.filter_theme_year = False

        mocker.get(
            SETS_CSV_URL,
            content=gzip.compress(SETS_CSV.encode()),
            headers={"ETag": '"seed-1"'},
        )
        mocker.get(THEMES_CSV_URL, content=gzip.compress(THEMES_CSV.encode()))

        for method, handler in (
            ("checkKey", self._check_key),
            ("checkUserHash", self._check_user_hash),
            ("login", self._login),
            ("getSets", self._get_sets),
            ("getThemes", self._get_themes),
            ("getKeyUsageStats", self._get_key_usage),
            ("setCollection", self._set_collection),
        ):
            mocker.post(f"{API_BASE}/{method}", side_effect=self._authorised(handler))

    def _authorised(
        self, handler: Callable[[str, Any, Any], Awaitable[Any]]
    ) -> Callable[[str, Any, Any], Awaitable[Any]]:
        """Refuse a call without a valid key, as Brickset refuses it."""

        async def checked(method: str, url: Any, data: Any) -> Any:
            if not self.key_valid or data.get("apiKey") not in self.api_keys:
                return self._error("Invalid API key")
            return await handler(method, url, data)

        return checked

    def _hash_ok(self, data: Any) -> bool:
        """Whether a call carries the user hash login handed out, still valid."""
        return self.hash_valid and data.get("userHash") in self.user_hashes

    @staticmethod
    def _ok(payload: dict[str, Any]) -> AiohttpClientMockResponse:
        """Build a success response."""
        return AiohttpClientMockResponse(
            "post", API_BASE, json={"status": "success", **payload}
        )

    @staticmethod
    def _error(message: str) -> AiohttpClientMockResponse:
        """Build an error response."""
        return AiohttpClientMockResponse(
            "post", API_BASE, json={"status": "error", "message": message}
        )

    async def _check_key(self, method: str, url: str, data: Any) -> Any:
        if not self.key_valid:
            return self._error("Invalid API key")
        return self._ok({})

    async def _check_user_hash(self, method: str, url: str, data: Any) -> Any:
        if not self._hash_ok(data):
            return self._error("Invalid userHash")
        return self._ok({})

    async def _login(self, method: str, url: str, data: Any) -> Any:
        if not self.credentials_valid:
            return self._error("Invalid userHash: login failed")
        return self._ok({"hash": self.user_hash})

    async def _get_themes(self, method: str, url: str, data: Any) -> Any:
        if self.themes_error is not None:
            return self._error(self.themes_error)
        # yearTo follows the sets the fake holds, as Brickset's follows its catalogue.
        latest: dict[str, int] = {"Technic": 2024, "Icons": 2024}
        for item in [*self.theme_sets, *self.year_sets]:
            latest[item["theme"]] = max(latest.get(item["theme"], 0), item["year"])
        return self._ok(
            {
                "matches": len(latest),
                "themes": [
                    {"theme": theme, "setCount": 100, "yearFrom": 1977, "yearTo": year}
                    for theme, year in latest.items()
                ],
            }
        )

    async def _get_key_usage(self, method: str, url: str, data: Any) -> Any:
        self.usage_checks += 1
        return self._ok(
            {
                "matches": 1,
                "apiKeyUsage": [
                    {
                        "dateStamp": f"{dt_util.now().date().isoformat()}T00:00:00Z",
                        "count": self.usage_today,
                    }
                ],
            }
        )

    async def _get_sets(self, method: str, url: str, data: Any) -> Any:
        params = json.loads(data["params"])
        self.get_sets_calls.append(params)
        self.usage_today += 1

        if self.get_sets_error is not None:
            return self._error(self.get_sets_error)

        if (params.get("owned") or params.get("wanted")) and not self._hash_ok(data):
            return self._error("Invalid userHash")

        if params.get("owned"):
            sets = self.owned
        elif params.get("wanted"):
            sets = self.wanted
        elif "theme" in params:
            # Brickset accepts a comma-separated theme; verified against the live API.
            wanted_themes = str(params["theme"]).split(",")
            if not self.themes_batchable:
                wanted_themes = wanted_themes[:1] if len(wanted_themes) == 1 else []
            sets = [item for item in self.theme_sets if item["theme"] in wanted_themes]
            if self.filter_theme_year:
                sets = [item for item in sets if item["year"] == params.get("year")]
        elif "setNumber" in params:
            requested = str(params["setNumber"]).split(",")
            pool = [*self.owned, *self.wanted, *self.theme_sets]
            sets = [
                item
                for item in pool
                if f"{item['number']}-{item['numberVariant']}" in requested
            ]
        elif "query" in params:
            needle = str(params["query"]).lower()
            pool = [*self.owned, *self.wanted, *self.theme_sets]
            sets = [item for item in pool if needle in item["name"].lower()]
        elif "year" in params:
            sets = [item for item in self.year_sets if item["year"] == params["year"]]
        else:
            sets = []

        # Sorted as asked, so a test sees the order the integration requested and
        # cannot pass on the order it happened to list its sets in.
        order = str(params.get("orderBy", ""))
        if order.removesuffix("DESC") == "Number":
            sets = sorted(
                sets,
                key=lambda item: (int(item["number"]), item["numberVariant"]),
                reverse=order.endswith("DESC"),
            )
        # Every query pages as Brickset's does, 20 to a page unless asked for more.
        size = int(params.get("pageSize", 20))
        start = (int(params.get("pageNumber", 1)) - 1) * size
        return self._ok({"matches": len(sets), "sets": sets[start : start + size]})

    async def _set_collection(self, method: str, url: str, data: Any) -> Any:
        if not self._hash_ok(data):
            return self._error("Invalid userHash")
        if self.set_collection_error is not None:
            return self._error(self.set_collection_error)
        self.set_collection_calls.append(
            {"setID": data["setID"], "params": json.loads(data["params"])}
        )
        return self._ok({})


@pytest.fixture
def brickset(aioclient_mock: AiohttpClientMocker) -> BricksetServer:
    """Return the fake Brickset API."""
    return BricksetServer(aioclient_mock)


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Return a configured LEGO entry."""
    return MockConfigEntry(
        domain=DOMAIN,
        title=USERNAME,
        unique_id=USERNAME,
        version=2,
        data={
            CONF_API_KEY: API_KEY,
            CONF_USERNAME: USERNAME,
            CONF_USER_HASH: USER_HASH,
        },
        options={
            CONF_REGION: "UK",
            CONF_THEMES: ["Technic"],
        },
    )


async def setup_integration(
    hass: HomeAssistant, entry: MockConfigEntry
) -> MockConfigEntry:
    """Add and set up a config entry."""
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    # Setup seeds the catalogue in a background task that hops to an executor.
    await hass.async_block_till_done(wait_background_tasks=True)
    return entry


def lego_device_id(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    """Return the id of the Brickset device an entry creates."""
    return dr.async_get_device_id_by_identifier(
        hass, (DOMAIN, entry.entry_id), config_entry_id=entry.entry_id
    )
