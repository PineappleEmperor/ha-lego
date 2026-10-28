"""The last data each account's polls returned, kept across restarts."""

# Without it a restart cost a full refresh, and on a day the budget was spent it left
# the account with nothing to show until midnight UTC.

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN

POLL_CACHE_VERSION = 1
# Polls land hours apart, so the delay only gathers a write from the panel with the
# poll that may follow it.
SAVE_DELAY = 10


def poll_cache_key(entry_id: str) -> str:
    """Return the storage key of one account's saved polls."""
    return f"{DOMAIN}_cache.{entry_id}"


@dataclass(slots=True)
class Snapshot:
    """One coordinator's data as it stood after its last poll."""

    synced: datetime
    data: dict[str, Any]


class PollCache:
    """One account's saved polls, a snapshot per coordinator."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Initialise the cache for an entry; async_load reads it."""
        self._store: Store[dict[str, Any]] = Store(
            hass, POLL_CACHE_VERSION, poll_cache_key(entry_id)
        )
        self._saved: dict[str, Any] = {}
        self._dirty = False

    async def async_load(self) -> None:
        """Read what the last run saved."""
        self._saved = await self._store.async_load() or {}

    def get(self, name: str) -> Snapshot | None:
        """Return a coordinator's saved data, or None if there is none to trust."""
        saved = self._saved.get(name)
        if not isinstance(saved, dict) or not isinstance(saved.get("data"), dict):
            return None
        synced = dt_util.parse_datetime(str(saved.get("synced") or ""))
        if synced is None:
            return None
        return Snapshot(synced=synced, data=saved["data"])

    def put(self, name: str, synced: datetime, data: dict[str, Any]) -> None:
        """Save a coordinator's data, written shortly after."""
        self._saved[name] = {"synced": synced.isoformat(), "data": data}
        self._dirty = True
        self._store.async_delay_save(self._written, SAVE_DELAY)

    def _written(self) -> dict[str, Any]:
        self._dirty = False
        return self._saved

    async def async_flush(self) -> None:
        """Write now, so a reload reads what was saved rather than the run before."""
        if self._dirty:
            await self._store.async_save(self._written())

    async def async_remove(self) -> None:
        """Delete the saved polls, when the account is removed."""
        await self._store.async_remove()
