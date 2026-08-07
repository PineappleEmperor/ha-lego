"""A local index of LEGO sets, so naming a set costs no Brickset calls."""

from __future__ import annotations

import csv
from dataclasses import dataclass
from datetime import date, timedelta
import gzip
from http import HTTPStatus
import io
import logging
from typing import TYPE_CHECKING, Any

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CATALOGUE_REFRESH_DAYS,
    EXCLUDED_ROOT_THEMES,
    SETS_CSV_URL,
    STORAGE_KEY,
    STORAGE_VERSION,
    THEMES_CSV_URL,
)

if TYPE_CHECKING:
    from .models import LegoSet

_LOGGER = logging.getLogger(__name__)

DOWNLOAD_TIMEOUT = aiohttp.ClientTimeout(total=180)


@dataclass(slots=True)
class CatalogueEntry:
    """A set as the local index knows it."""

    number: str
    name: str = ""
    year: int | None = None
    theme: str = ""


def _entry(number: str, row: list[Any]) -> CatalogueEntry:
    """Build a catalogue entry from a stored row, which is empty when slim."""
    if not row:
        return CatalogueEntry(number=number)
    return CatalogueEntry(number=number, name=row[0], year=row[1], theme=row[2])


def _root_theme(theme_id: str, themes: dict[str, dict[str, str]]) -> str:
    """Walk a Rebrickable theme up to its top-level parent."""
    theme = themes.get(theme_id)
    seen: set[str] = set()
    while theme is not None:
        parent = theme.get("parent_id") or ""
        if not parent or parent in seen:
            break
        seen.add(parent)
        theme = themes.get(parent)
    return theme["name"] if theme else ""


def _parse(sets_csv: bytes, themes_csv: bytes, rich: bool) -> dict[str, list[Any]]:
    """Decode both downloads into the stored index. Runs in an executor."""
    themes = {
        row["id"]: row
        for row in csv.DictReader(
            io.StringIO(gzip.decompress(themes_csv).decode("utf-8"))
        )
    }
    index: dict[str, list[Any]] = {}
    for row in csv.DictReader(io.StringIO(gzip.decompress(sets_csv).decode("utf-8"))):
        if _root_theme(row["theme_id"], themes) in EXCLUDED_ROOT_THEMES:
            continue
        number = row["set_num"]
        if not rich:
            index[number] = []
            continue
        year = row["year"]
        index[number] = [
            row["name"],
            int(year) if year.isdigit() else None,
            _root_theme(row["theme_id"], themes),
        ]
    return index


class SetCatalogue:
    """Rebrickable's set list plus the Brickset IDs seen so far."""

    def __init__(self, hass: HomeAssistant, session: aiohttp.ClientSession) -> None:
        """Initialise an empty catalogue."""
        self._hass = hass
        self._session = session
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._sets: dict[str, list[Any]] = {}
        self._ids: dict[str, int] = {}
        self._etag: str | None = None
        self._fetched: date | None = None
        self._rich = True
        self._dirty = False

    @property
    def loaded(self) -> bool:
        """Whether an index is available to answer questions."""
        return bool(self._sets)

    @property
    def size(self) -> int:
        """How many sets the index holds."""
        return len(self._sets)

    @property
    def known_ids(self) -> int:
        """How many Brickset IDs have been learned."""
        return len(self._ids)

    @property
    def fetched(self) -> date | None:
        """When the index was last downloaded."""
        return self._fetched

    async def async_load(self, *, rich: bool) -> None:
        """Read the stored index, discarding it if the detail level changed."""
        stored = await self._store.async_load()
        self._rich = rich
        if not stored:
            return
        self._ids = {k: int(v) for k, v in (stored.get("ids") or {}).items()}
        if stored.get("rich") != rich:
            return
        self._sets = stored.get("sets") or {}
        self._etag = stored.get("etag")
        fetched = stored.get("fetched")
        self._fetched = date.fromisoformat(fetched) if fetched else None

    async def async_save(self) -> None:
        """Persist the index and the learned IDs."""
        await self._store.async_save(
            {
                "rich": self._rich,
                "etag": self._etag,
                "fetched": self._fetched.isoformat() if self._fetched else None,
                "sets": self._sets,
                "ids": self._ids,
            }
        )
        self._dirty = False

    @property
    def stale(self) -> bool:
        """Whether the index is missing or older than the refresh interval."""
        if not self._sets or self._fetched is None:
            return True
        age = dt_util.now().date() - self._fetched
        return age >= timedelta(days=CATALOGUE_REFRESH_DAYS)

    async def async_refresh(self, *, rich: bool) -> bool:
        """Download the set list, returning whether the index changed."""
        headers = {}
        if self._etag and self._rich == rich and self._sets:
            headers["If-None-Match"] = self._etag
        try:
            async with self._session.get(
                SETS_CSV_URL, headers=headers, timeout=DOWNLOAD_TIMEOUT
            ) as response:
                if response.status == HTTPStatus.NOT_MODIFIED:
                    self._fetched = dt_util.now().date()
                    await self.async_save()
                    return False
                response.raise_for_status()
                sets_csv = await response.read()
                etag = response.headers.get("ETag")
            async with self._session.get(
                THEMES_CSV_URL, timeout=DOWNLOAD_TIMEOUT
            ) as response:
                response.raise_for_status()
                themes_csv = await response.read()
        except (TimeoutError, aiohttp.ClientError) as err:
            _LOGGER.debug("Could not refresh the set catalogue: %s", err)
            return False

        self._sets = await self._hass.async_add_executor_job(
            _parse, sets_csv, themes_csv, rich
        )
        self._rich = rich
        self._etag = etag
        self._fetched = dt_util.now().date()
        await self.async_save()
        _LOGGER.debug("Set catalogue refreshed: %s sets", len(self._sets))
        return True

    def knows(self, number: str) -> bool:
        """Whether the index carries a number; a miss must never reject."""
        return number in self._sets

    def entry(self, number: str) -> CatalogueEntry | None:
        """Return what the index knows about a set number."""
        row = self._sets.get(number)
        return None if row is None else _entry(number, row)

    def search(self, query: str, limit: int = 10) -> list[CatalogueEntry]:
        """Find sets whose number starts with, or name contains, the query."""
        needle = query.strip().lower()
        if not needle:
            return []
        starts: list[CatalogueEntry] = []
        contains: list[CatalogueEntry] = []
        for number, row in self._sets.items():
            if number.lower().startswith(needle):
                starts.append(_entry(number, row))
            elif row and needle in str(row[0]).lower():
                contains.append(_entry(number, row))
            if len(starts) >= limit:
                break
        return (starts + contains)[:limit]

    def remember(self, sets: list[LegoSet]) -> None:
        """Learn Brickset IDs from records already fetched for another reason."""
        for lego_set in sets:
            known = self._ids.get(lego_set.number)
            if lego_set.number and lego_set.set_id and known != lego_set.set_id:
                self._ids[lego_set.number] = lego_set.set_id
                self._dirty = True

    def set_id(self, number: str) -> int | None:
        """Return a Brickset ID learned earlier, if any."""
        return self._ids.get(number)

    async def async_save_if_dirty(self) -> None:
        """Persist newly learned IDs."""
        if self._dirty:
            await self.async_save()
