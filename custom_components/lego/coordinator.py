"""Data update coordinators for the LEGO integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
import math
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import BricksetClient
from .catalogue import SetCatalogue
from .const import (
    CONF_COLLECTION_INTERVAL,
    CONF_FEEDS_INTERVAL,
    CONF_REGION,
    CONF_THEMES,
    DEFAULT_COLLECTION_INTERVAL_HOURS,
    DEFAULT_FEEDS_INTERVAL_HOURS,
    DEFAULT_REGION,
    DOMAIN,
    EVENT_NEW_SET,
    EVENT_WANTED_CHANGED,
    MIN_TIME_BETWEEN_QUOTA_CHECKS,
    PAGE_SIZE,
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
    summary: CollectionSummary = field(default_factory=CollectionSummary)

    @property
    def wanted_by_number(self) -> dict[str, LegoSet]:
        """Return the wishlist keyed by set number."""
        return {lego_set.number: lego_set for lego_set in self.wanted}

    @property
    def all_sets(self) -> dict[str, LegoSet]:
        """Return every known set keyed by set number."""
        merged: dict[str, LegoSet] = {}
        for lego_set in (*self.owned, *self.wanted):
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
        catalogue: SetCatalogue | None,
        *,
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
        self.catalogue = catalogue
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

    @property
    def region(self) -> str:
        """Return the pricing region chosen at setup."""
        return self.config_entry.options.get(CONF_REGION, DEFAULT_REGION)

    async def _fetch(self) -> DataT:
        """Fetch this coordinator's data."""
        raise NotImplementedError


class LegoCollectionCoordinator(LegoBaseCoordinator[CollectionData]):
    """Poll the signed-in user's owned and wanted sets."""

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
        catalogue: SetCatalogue | None = None,
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
            catalogue,
            name=f"{DOMAIN} collection",
            update_interval=timedelta(hours=hours),
        )

    @property
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        # Owned and wanted are one call each until a list passes a page.
        if self.data is None:
            return 2
        pages = math.ceil(len(self.data.owned) / PAGE_SIZE) + math.ceil(
            len(self.data.wanted) / PAGE_SIZE
        )
        return max(pages, 2)

    def apply_collection_change(
        self,
        lego_set: LegoSet,
        *,
        own: bool | None = None,
        want: bool | None = None,
        qty_owned: int | None = None,
        rating: int | None = None,
        notes: str | None = None,
    ) -> None:
        """Fold a write into the cached data instead of re-polling."""
        # Re-polling costs two of the hundred daily calls to learn what we just
        # sent, so correct the cache and let the next scheduled poll reconcile.
        if self.data is None:
            return

        status = lego_set.collection
        if own is not None:
            status.owned = own
        if want is not None:
            status.wanted = want
        if qty_owned is not None:
            status.qty_owned = qty_owned
            status.owned = status.owned or qty_owned > 0
        if rating is not None:
            status.rating = rating
        if notes is not None:
            status.notes = notes

        owned = [item for item in self.data.owned if item.number != lego_set.number]
        wanted = [item for item in self.data.wanted if item.number != lego_set.number]
        if status.owned:
            owned.append(lego_set)
        if status.wanted:
            wanted.append(lego_set)

        self.async_set_updated_data(
            CollectionData(
                owned=owned,
                wanted=wanted,
                summary=CollectionSummary.from_sets(owned, wanted, self.region),
            )
        )

    async def _fetch(self) -> CollectionData:
        """Fetch owned and wanted sets."""
        owned = await self.client.get_all_sets({"owned": 1, "extendedData": 1})
        wanted = await self.client.get_all_sets({"wanted": 1, "extendedData": 1})

        if self.catalogue is not None:
            self.catalogue.remember([*owned, *wanted])
            await self.catalogue.async_save_if_dirty()

        data = CollectionData(
            owned=owned,
            wanted=wanted,
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
        catalogue: SetCatalogue | None = None,
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
            catalogue,
            name=f"{DOMAIN} feeds",
            update_interval=timedelta(hours=hours),
        )
        self._batching_warned = False

    @property
    def themes(self) -> list[str]:
        """Return the themes being watched for new releases."""
        return list(self.config_entry.options.get(CONF_THEMES, []))

    def _warn_batching_lost(self, themes: list[str]) -> None:
        """Say once that the batched theme query stopped working."""
        if self._batching_warned:
            return
        self._batching_warned = True
        _LOGGER.warning(
            "Brickset returned nothing for the combined theme query (%s); "
            "falling back to one call per theme, which costs %s calls a poll",
            ", ".join(themes),
            len(themes),
        )

    async def _theme_query(self, theme: str, year: int) -> list[LegoSet]:
        """Ask Brickset for this year's sets in one theme, or several comma joined."""
        # This path does not paginate, and a call costs the same whatever the page
        # size, so ask for the maximum rather than risk dropping sets off the end.
        sets = await self.client.get_sets(
            {
                "theme": theme,
                "year": year,
                "orderBy": "NumberDESC",
                "pageSize": PAGE_SIZE,
            }
        )
        if len(sets) == PAGE_SIZE:
            _LOGGER.warning(
                "Theme query for %s filled a page of %s sets, so some may be missing",
                theme,
                PAGE_SIZE,
            )
        return sets

    async def _fetch(self) -> dict[str, list[LegoSet]]:
        """Fetch this year's sets for each watched theme."""
        year = dt_util.now().year
        themes = self.themes
        feeds: dict[str, list[LegoSet]] = {theme: [] for theme in themes}

        if len(themes) > 1:
            # Brickset accepts a comma-separated theme, turning one call per theme
            # into one call. Undocumented, so anything it does not return is asked
            # for individually rather than silently dropped from the feed.
            for lego_set in await self._theme_query(",".join(themes), year):
                if lego_set.theme in feeds:
                    feeds[lego_set.theme].append(lego_set)
            missing = [theme for theme in themes if not feeds[theme]]
            if len(missing) == len(themes):
                self._warn_batching_lost(themes)
        else:
            missing = themes

        for theme in missing:
            feeds[theme] = await self._theme_query(theme, year)
        if self.catalogue is not None:
            self.catalogue.remember([s for sets in feeds.values() for s in sets])
            await self.catalogue.async_save_if_dirty()
        self._fire_new_set_events(feeds)
        return feeds

    def _fire_new_set_events(self, feeds: dict[str, list[LegoSet]]) -> None:
        """Fire an event per set new since the previous poll, baselining the first."""
        if self.data is None:
            return
        region = self.region
        for theme, sets in feeds.items():
            seen = {lego_set.number for lego_set in self.data.get(theme, [])}
            for lego_set in sets:
                if lego_set.number in seen:
                    continue
                launch = lego_set.release_date(region)
                exit_date = lego_set.retirement_date(region)
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
                        "released": lego_set.released,
                        "release_date": launch.isoformat() if launch else None,
                        "retirement_date": exit_date.isoformat() if exit_date else None,
                        "retail_price": lego_set.price(region),
                        "region": region,
                    },
                )
