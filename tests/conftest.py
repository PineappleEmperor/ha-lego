"""Shared fixtures for the LEGO integration tests."""

from __future__ import annotations

from copy import deepcopy
import json
from typing import Any
from unittest.mock import patch

from homeassistant.const import CONF_API_KEY, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import (
    AiohttpClientMocker,
    AiohttpClientMockResponse,
)

from custom_components.lego.const import (
    CONF_REGION,
    CONF_THEMES,
    CONF_USER_HASH,
    CONF_WATCHLIST,
    DOMAIN,
)

pytest_plugins = "pytest_homeassistant_custom_component"

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
) -> dict[str, Any]:
    """Build a getSets record shaped like Brickset's own payloads."""
    uk: dict[str, Any] = {}
    if price is not None:
        uk["retailPrice"] = price
    if first_available is not None:
        uk["dateFirstAvailable"] = first_available
    if last_available is not None:
        uk["dateLastAvailable"] = last_available

    return {
        "setID": set_id,
        "number": number,
        "numberVariant": 1,
        "name": name,
        "year": year,
        "theme": theme,
        "themeGroup": "Model making",
        "subtheme": "",
        "category": "Normal",
        "released": True,
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
        self.usage_today = 0
        self.get_sets_calls: list[dict[str, Any]] = []
        self.set_collection_calls: list[dict[str, Any]] = []
        self.key_valid = True
        self.credentials_valid = True
        self.hash_valid = True
        # When set, every getSets call fails with this message.
        self.get_sets_error: str | None = None

        for method, handler in (
            ("checkKey", self._check_key),
            ("checkUserHash", self._check_user_hash),
            ("login", self._login),
            ("getSets", self._get_sets),
            ("getThemes", self._get_themes),
            ("getKeyUsageStats", self._get_key_usage),
            ("setCollection", self._set_collection),
        ):
            mocker.post(f"{API_BASE}/{method}", side_effect=handler)

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
        if not self.hash_valid:
            return self._error("Invalid userHash")
        return self._ok({})

    async def _login(self, method: str, url: str, data: Any) -> Any:
        if not self.key_valid:
            return self._error("Invalid API key")
        if not self.credentials_valid:
            return self._error("Invalid userHash: login failed")
        return self._ok({"hash": USER_HASH})

    async def _get_themes(self, method: str, url: str, data: Any) -> Any:
        return self._ok(
            {
                "matches": 2,
                "themes": [
                    {"theme": "Technic", "setCount": 900},
                    {"theme": "Icons", "setCount": 200},
                ],
            }
        )

    async def _get_key_usage(self, method: str, url: str, data: Any) -> Any:
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

        if not self.hash_valid and (params.get("owned") or params.get("wanted")):
            return self._error("Invalid userHash")

        if params.get("owned"):
            sets = self.owned
        elif params.get("wanted"):
            sets = self.wanted
        elif "theme" in params:
            sets = [
                item for item in self.theme_sets if item["theme"] == params["theme"]
            ]
        elif "setNumber" in params:
            requested = str(params["setNumber"]).split(",")
            pool = [*self.owned, *self.wanted, *self.theme_sets]
            sets = [item for item in pool if item["number"] in requested]
        elif "query" in params:
            needle = str(params["query"]).lower()
            pool = [*self.owned, *self.wanted, *self.theme_sets]
            sets = [item for item in pool if needle in item["name"].lower()]
        else:
            sets = []

        return self._ok({"matches": len(sets), "sets": sets})

    async def _set_collection(self, method: str, url: str, data: Any) -> Any:
        if not self.hash_valid:
            return self._error("Invalid userHash")
        self.set_collection_calls.append(
            {"setID": data["setID"], "params": json.loads(data["params"])}
        )
        return self._ok({})


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Load custom_components in every test."""
    return


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
        data={
            CONF_API_KEY: API_KEY,
            CONF_USERNAME: USERNAME,
            CONF_USER_HASH: USER_HASH,
        },
        options={
            CONF_REGION: "UK",
            CONF_THEMES: ["Technic"],
            CONF_WATCHLIST: ["10497-1"],
        },
    )


async def setup_integration(
    hass: HomeAssistant, entry: MockConfigEntry
) -> MockConfigEntry:
    """Add and set up a config entry."""
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


@pytest.fixture
def no_platforms():
    """Set the entry up without loading entity platforms."""
    with patch("custom_components.lego.PLATFORMS", []):
        yield
