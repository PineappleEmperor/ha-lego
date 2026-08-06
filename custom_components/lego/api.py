"""Thin async client for the Brickset API v3."""

from __future__ import annotations

from datetime import date
import json
import logging
from typing import Any

import aiohttp
from yarl import URL

from .const import PAGE_SIZE
from .exceptions import (
    BricksetAuthError,
    BricksetConnectionError,
    BricksetError,
    BricksetQuotaError,
    BricksetUserHashError,
)
from .models import LegoSet
from .quota import QuotaManager

_LOGGER = logging.getLogger(__name__)

API_BASE = URL("https://brickset.com/api/v3.asmx/")
REQUEST_TIMEOUT = aiohttp.ClientTimeout(total=30)

# Brickset signals every failure as status "error"; only the message distinguishes them.
_INVALID_KEY_FRAGMENTS = ("invalid api key", "api key not valid", "invalid key")
_INVALID_HASH_FRAGMENTS = ("invalid userhash", "invalid user hash", "not logged in")
_QUOTA_FRAGMENTS = ("exceeded", "too many", "limit reached")


class BricksetClient:
    """Call the Brickset API v3 over Home Assistant's shared session."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        api_key: str,
        user_hash: str = "",
        quota: QuotaManager | None = None,
    ) -> None:
        """Initialise the client."""
        self._session = session
        self._api_key = api_key
        self._user_hash = user_hash
        self._quota = quota

    @property
    def user_hash(self) -> str:
        """Return the user hash currently in use."""
        return self._user_hash

    @user_hash.setter
    def user_hash(self, value: str) -> None:
        """Replace the user hash, e.g. after a reauth."""
        self._user_hash = value

    async def _request(self, method: str, data: dict[str, str]) -> dict[str, Any]:
        """POST to a Brickset method and return the decoded payload."""
        payload = {"apiKey": self._api_key, **data}
        try:
            async with self._session.post(
                API_BASE / method, data=payload, timeout=REQUEST_TIMEOUT
            ) as response:
                response.raise_for_status()
                # Brickset serves JSON as text/plain, so content type is not enforced.
                result = await response.json(content_type=None)
        except TimeoutError as err:
            raise BricksetConnectionError(f"Timeout calling {method}") from err
        except aiohttp.ClientError as err:
            raise BricksetConnectionError(f"Error calling {method}: {err}") from err
        except (ValueError, json.JSONDecodeError) as err:
            raise BricksetError(f"Malformed response from {method}") from err

        if not isinstance(result, dict):
            raise BricksetError(f"Unexpected response from {method}")

        if result.get("status") != "success":
            message = str(result.get("message", "unknown error"))
            lowered = message.lower()
            if any(fragment in lowered for fragment in _INVALID_KEY_FRAGMENTS):
                raise BricksetAuthError(message)
            if any(fragment in lowered for fragment in _INVALID_HASH_FRAGMENTS):
                raise BricksetUserHashError(message)
            if any(fragment in lowered for fragment in _QUOTA_FRAGMENTS):
                raise BricksetQuotaError(message)
            raise BricksetError(message)

        return result

    async def check_key(self) -> None:
        """Validate the API key, raising BricksetAuthError if it is rejected."""
        await self._request("checkKey", {})

    async def login(self, username: str, password: str) -> str:
        """Exchange credentials for a long-lived user hash."""
        result = await self._request(
            "login", {"username": username, "password": password}
        )
        user_hash = result.get("hash")
        if not user_hash:
            raise BricksetUserHashError("Brickset returned no user hash")
        self._user_hash = str(user_hash)
        return self._user_hash

    async def check_user_hash(self) -> None:
        """Validate the stored user hash."""
        await self._request("checkUserHash", {"userHash": self._user_hash})

    async def get_key_usage(self) -> dict[date, int]:
        """Return getSets call counts per day for the last 30 days."""
        result = await self._request("getKeyUsageStats", {})
        usage: dict[date, int] = {}
        for entry in result.get("apiKeyUsage") or []:
            stamp = entry.get("dateStamp")
            if not isinstance(stamp, str):
                continue
            try:
                parsed = date.fromisoformat(stamp[:10])
            except ValueError:
                continue
            usage[parsed] = int(entry.get("count") or 0)
        return usage

    async def get_themes(self) -> list[str]:
        """Return every theme name Brickset knows about."""
        result = await self._request("getThemes", {})
        return [
            str(theme["theme"])
            for theme in result.get("themes") or []
            if theme.get("theme")
        ]

    async def get_sets(self, params: dict[str, Any]) -> list[LegoSet]:
        """Run a getSets query, the only method billed against the daily allowance."""
        if self._quota is not None:
            self._quota.reserve()
        result = await self._request(
            "getSets",
            {"userHash": self._user_hash, "params": json.dumps(params)},
        )
        if self._quota is not None:
            self._quota.record()
        return [LegoSet.from_api(item) for item in result.get("sets") or []]

    async def get_all_sets(
        self, params: dict[str, Any], max_pages: int = 10
    ) -> list[LegoSet]:
        """Page through getSets; each page is billed, so max_pages caps the cost."""
        collected: list[LegoSet] = []
        for page in range(1, max_pages + 1):
            page_params = {**params, "pageSize": PAGE_SIZE, "pageNumber": page}
            batch = await self.get_sets(page_params)
            collected.extend(batch)
            if len(batch) < PAGE_SIZE:
                break
        else:
            _LOGGER.warning(
                "Stopped paginating Brickset results after %s pages; "
                "some sets may be missing",
                max_pages,
            )
        return collected

    async def set_collection(
        self,
        set_id: int,
        *,
        own: bool | None = None,
        want: bool | None = None,
        qty_owned: int | None = None,
        rating: int | None = None,
        notes: str | None = None,
    ) -> None:
        """Update the signed-in user's collection record for a set."""
        params: dict[str, Any] = {}
        if own is not None:
            params["own"] = 1 if own else 0
        if want is not None:
            params["want"] = 1 if want else 0
        if qty_owned is not None:
            params["qtyOwned"] = qty_owned
        if rating is not None:
            params["rating"] = rating
        if notes is not None:
            params["notes"] = notes
        if not params:
            raise ValueError("set_collection requires at least one field to change")

        await self._request(
            "setCollection",
            {
                "userHash": self._user_hash,
                "setID": str(set_id),
                "params": json.dumps(params),
            },
        )
