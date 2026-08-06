"""Data update coordinators for the LEGO integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import BricksetClient
from .const import (
    CONF_COLLECTION_INTERVAL,
    CONF_FEEDS_INTERVAL,
    CONF_REGION,
    CONF_THEMES,
    CONF_WATCHLIST,
    DEFAULT_COLLECTION_INTERVAL_HOURS,
    DEFAULT_FEEDS_INTERVAL_HOURS,
    DEFAULT_REGION,
    DOMAIN,
    EVENT_NEW_SET,
    EVENT_WANTED_CHANGED,
    MIN_TIME_BETWEEN_QUOTA_CHECKS,
)
from .exceptions import (
    BricksetAuthError,
    BricksetError,
    BricksetQuotaError,
    BricksetUserHashError,
)
from .models import CollectionSummary, LegoSet
from .quota import QuotaManager

if TYPE_CHECKING:
    from . import LegoConfigEntry

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class CollectionData:
    """Everything the collection poll produced."""

    owned: list[LegoSet] = field(default_factory=list)
    wanted: list[LegoSet] = field(default_factory=list)
    watched: dict[str, LegoSet] = field(default_factory=dict)
    summary: CollectionSummary = field(default_factory=CollectionSummary)

    @property
    def all_sets(self) -> dict[str, LegoSet]:
        """Return every known set keyed by set number."""
        merged: dict[str, LegoSet] = {}
        for lego_set in (*self.owned, *self.wanted, *self.watched.values()):
            merged[lego_set.number] = lego_set
        return merged


class LegoBaseCoordinator[DataT](DataUpdateCoordinator[DataT]):
    """Shared error handling for the LEGO coordinators."""

    config_entry: LegoConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
        name: str,
        update_interval: timedelta,
    ) -> None:
        """Initialise the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=config_entry,
            name=name,
            update_interval=update_interval,
            always_update=False,
        )
        self.client = client
        self.quota = quota
        self._quota_warned = False
        self._last_quota_sync: datetime | None = None

    async def _sync_quota(self) -> None:
        """Refresh the unbilled server-side call count, rate limited separately."""
        now = dt_util.utcnow()
        if (
            self._last_quota_sync is not None
            and now - self._last_quota_sync < MIN_TIME_BETWEEN_QUOTA_CHECKS
        ):
            return
        try:
            usage = await self.client.get_key_usage()
        except BricksetError as err:
            _LOGGER.debug("Could not refresh Brickset quota stats: %s", err)
            return
        self._last_quota_sync = now
        self.quota.sync(usage)

    def _handle_quota_exhausted(self, err: BricksetQuotaError) -> DataT:
        """Keep serving the last poll's data instead of going unavailable."""
        if not self._quota_warned:
            _LOGGER.warning(
                "Brickset daily call budget spent (%s of %s used); "
                "serving cached data until it resets: %s",
                self.quota.calls_today,
                self.quota.budget,
                err,
            )
            self._quota_warned = True
        if self.data is None:
            raise UpdateFailed(str(err)) from err
        return self.data

    async def _async_update_data(self) -> DataT:
        """Poll Brickset, mapping API failures onto coordinator semantics."""
        try:
            await self._sync_quota()
            data = await self._fetch()
        except BricksetQuotaError as err:
            return self._handle_quota_exhausted(err)
        except (BricksetAuthError, BricksetUserHashError) as err:
            raise ConfigEntryAuthFailed(str(err)) from err
        except BricksetError as err:
            raise UpdateFailed(str(err)) from err
        self._quota_warned = False
        return data

    async def _fetch(self) -> DataT:
        """Fetch this coordinator's data."""
        raise NotImplementedError


class LegoCollectionCoordinator(LegoBaseCoordinator[CollectionData]):
    """Poll the signed-in user's owned, wanted and watched sets."""

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
    ) -> None:
        """Initialise the collection coordinator."""
        hours = config_entry.options.get(
            CONF_COLLECTION_INTERVAL, DEFAULT_COLLECTION_INTERVAL_HOURS
        )
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            name=f"{DOMAIN} collection",
            update_interval=timedelta(hours=hours),
        )

    @property
    def region(self) -> str:
        """Return the pricing region chosen at setup."""
        return self.config_entry.options.get(CONF_REGION, DEFAULT_REGION)

    @property
    def watchlist(self) -> list[str]:
        """Return the set numbers the user asked to track individually."""
        return list(self.config_entry.options.get(CONF_WATCHLIST, []))

    async def _fetch(self) -> CollectionData:
        """Fetch owned, wanted and watched sets."""
        owned = await self.client.get_all_sets({"owned": 1, "extendedData": 1})
        wanted = await self.client.get_all_sets({"wanted": 1, "extendedData": 1})

        known = {lego_set.number: lego_set for lego_set in (*owned, *wanted)}
        watched = {
            number: known[number] for number in self.watchlist if number in known
        }
        missing = [number for number in self.watchlist if number not in known]
        if missing:
            for lego_set in await self.client.get_sets(
                {"setNumber": ",".join(missing), "extendedData": 1}
            ):
                watched[lego_set.number] = lego_set

        data = CollectionData(
            owned=owned,
            wanted=wanted,
            watched=watched,
            summary=CollectionSummary.from_sets(owned, wanted, self.region),
        )
        self._fire_wanted_events(data)
        return data

    def _fire_wanted_events(self, new_data: CollectionData) -> None:
        """Fire an event when a wanted set's availability or price changes."""
        if self.data is None:
            return
        previous = {lego_set.number: lego_set for lego_set in self.data.wanted}
        region = self.region
        for lego_set in new_data.wanted:
            before = previous.get(lego_set.number)
            if before is None:
                continue
            changes: dict[str, Any] = {}
            if before.price(region) != lego_set.price(region):
                changes["price"] = lego_set.price(region)
            if before.retirement_date(region) != lego_set.retirement_date(region):
                retires = lego_set.retirement_date(region)
                changes["retirement_date"] = retires.isoformat() if retires else None
            if before.availability != lego_set.availability:
                changes["availability"] = lego_set.availability
            if changes:
                self.hass.bus.async_fire(
                    EVENT_WANTED_CHANGED,
                    {
                        "entry_id": self.config_entry.entry_id,
                        "set_number": lego_set.number,
                        "name": lego_set.name,
                        "brickset_url": lego_set.brickset_url,
                        **changes,
                    },
                )


class LegoFeedsCoordinator(LegoBaseCoordinator[dict[str, list[LegoSet]]]):
    """Poll new releases for each watched theme."""

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
    ) -> None:
        """Initialise the feeds coordinator."""
        hours = config_entry.options.get(
            CONF_FEEDS_INTERVAL, DEFAULT_FEEDS_INTERVAL_HOURS
        )
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            name=f"{DOMAIN} feeds",
            update_interval=timedelta(hours=hours),
        )

    @property
    def themes(self) -> list[str]:
        """Return the themes being watched for new releases."""
        return list(self.config_entry.options.get(CONF_THEMES, []))

    async def _fetch(self) -> dict[str, list[LegoSet]]:
        """Fetch this year's sets for each watched theme."""
        year = dt_util.now().year
        feeds: dict[str, list[LegoSet]] = {}
        for theme in self.themes:
            sets = await self.client.get_sets(
                {
                    "theme": theme,
                    "year": year,
                    "orderBy": "NumberDESC",
                    "pageSize": 50,
                }
            )
            feeds[theme] = sets
        self._fire_new_set_events(feeds)
        return feeds

    def _fire_new_set_events(self, feeds: dict[str, list[LegoSet]]) -> None:
        """Fire an event per set added since the previous poll.

        The first poll only sets a baseline, or a restart would replay the year.
        """
        if self.data is None:
            return
        for theme, sets in feeds.items():
            seen = {lego_set.number for lego_set in self.data.get(theme, [])}
            for lego_set in sets:
                if lego_set.number in seen:
                    continue
                self.hass.bus.async_fire(
                    EVENT_NEW_SET,
                    {
                        "entry_id": self.config_entry.entry_id,
                        "theme": theme,
                        "set_number": lego_set.number,
                        "name": lego_set.name,
                        "year": lego_set.year,
                        "pieces": lego_set.pieces,
                        "minifigs": lego_set.minifigs,
                        "image_url": lego_set.image_url,
                        "brickset_url": lego_set.brickset_url,
                    },
                )
