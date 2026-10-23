"""Data update coordinators for the LEGO integration."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
import math
from typing import Any, cast, override

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_REGION
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import BricksetClient
from .catalogue import SetCatalogue
from .const import (
    CONF_RELEASES,
    CONF_THEMES,
    DEFAULT_REGION,
    DEFAULT_RELEASES,
    DOMAIN,
    EVENT_NEW_SET,
    EVENT_WANTED_CHANGED,
    FEEDS_INTERVAL_HOURS,
    MIN_COLLECTION_POLL_COST,
    MIN_TIME_BETWEEN_QUOTA_CHECKS,
    NEXT_YEAR_FROM_MONTH,
    PAGE_SIZE,
    RELEASES_INTERVAL_HOURS,
    RELEASES_MAX_PAGES,
    RELEASES_RETRY_HOURS,
)
from .exceptions import (
    BricksetAuthError,
    BricksetError,
    BricksetQuotaError,
    BricksetUserHashError,
)
from .models import CollectionSummary, LegoSet
from .quota import (
    QuotaManager,
    collection_interval,
    feeds_poll_cost,
    releases_calls_per_day,
    releases_poll_cost,
)

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


def _collection_poll_cost(data: CollectionData | None) -> int:
    """Return the billed calls a collection poll spends, given the last result."""
    # Owned and wanted are one call each until a list passes a page.
    if data is None:
        return MIN_COLLECTION_POLL_COST
    pages = math.ceil(len(data.owned) / PAGE_SIZE) + math.ceil(
        len(data.wanted) / PAGE_SIZE
    )
    return max(pages, MIN_COLLECTION_POLL_COST)


def _collection_interval(
    config_entry: LegoConfigEntry, quota: QuotaManager, poll_cost: int
) -> timedelta:
    """Return the collection interval left over by the entry's other polls."""
    options = config_entry.options
    today = dt_util.now().date()
    # Runtime data is set after the first collection poll, which uses the estimate.
    runtime: LegoRuntimeData | None = getattr(config_entry, "runtime_data", None)
    releases = runtime.releases if runtime is not None else None
    return collection_interval(
        quota.budget,
        poll_cost,
        bool(options.get(CONF_THEMES)),
        today,
        releases_calls_per_day(
            options.get(CONF_RELEASES, DEFAULT_RELEASES),
            today,
            releases.measured_cost if releases is not None else None,
        ),
    )


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
        self._last_quota_sync: datetime | None = None
        # When Brickset last answered a poll, so a dashboard can show how old the
        # data is while the budget is spent.
        self.last_synced: datetime | None = None
        self._quota_paused = False

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

    @override
    async def _async_update_data(self) -> DataT:
        """Poll Brickset, mapping API failures onto coordinator semantics."""
        try:
            await self._sync_quota()
            data = await self._fetch()
        except BricksetQuotaError as err:
            return self._serve_cached(err)
        except (BricksetAuthError, BricksetUserHashError) as err:
            raise ConfigEntryAuthFailed(
                translation_domain=DOMAIN, translation_key="auth_expired"
            ) from err
        except BricksetError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_error",
                translation_placeholders={"error": str(err)},
            ) from err
        if self._quota_paused:
            _LOGGER.info("Brickset call budget reset; %s is polling again", self.name)
            self._quota_paused = False
        self.last_synced = dt_util.utcnow()
        # Listeners hear only about changed data, and most polls change nothing, so
        # the sync time goes out on its own signal.
        async_dispatcher_send(self.hass, self.signal_synced)
        return data

    @property
    def device_id(self) -> str | None:
        """Return the id of the account's Brickset device, which actions target."""
        device = dr.async_get(self.hass).async_get_device_by_identifier(
            (DOMAIN, self.config_entry.entry_id), self.config_entry.entry_id
        )
        return device.id if device else None

    @property
    def signal_synced(self) -> str:
        """Return the dispatcher signal sent after every successful poll."""
        return f"{DOMAIN}_{self.config_entry.entry_id}_{self.name}_synced"

    def _serve_cached(self, err: BricksetQuotaError) -> DataT:
        """Keep the last poll's data while the budget is spent, saying so once."""
        # Going unavailable would blank every dashboard for the rest of the day over
        # a self-imposed limit; last_synced tells anyone who asks how old it is.
        if (previous := self._previous) is None:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="quota_spent",
                translation_placeholders={
                    "cost": str(self.poll_cost),
                    "calls_today": str(self.quota.calls_today),
                    "budget": str(self.quota.budget),
                },
            ) from err
        if not self._quota_paused:
            _LOGGER.warning(
                "Brickset daily call budget spent (%s of %s used); %s is serving "
                "data last synced at %s until it resets at midnight UTC",
                self.quota.calls_today,
                self.quota.budget,
                self.name,
                self.last_synced,
            )
            self._quota_paused = True
        return previous

    @property
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        return 1

    @property
    def _previous(self) -> DataT | None:
        """Return the last refresh's data, or None while the first is running."""
        # DataUpdateCoordinator types data as always set, but it stays None until
        # the first refresh returns, which is when these hooks first run.
        return cast("DataT | None", self.data)

    @property
    def region(self) -> str:
        """Return the pricing region chosen at setup."""
        return str(self.config_entry.options.get(CONF_REGION, DEFAULT_REGION))

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
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            catalogue,
            name=f"{DOMAIN} collection",
            update_interval=_collection_interval(
                config_entry, quota, MIN_COLLECTION_POLL_COST
            ),
        )

    @property
    @override
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        return _collection_poll_cost(self._previous)

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
        if (data := self._previous) is None:
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

        owned = [item for item in data.owned if item.number != lego_set.number]
        wanted = [item for item in data.wanted if item.number != lego_set.number]
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

    @override
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
        # A collection that grows past a page costs more per poll, so the interval
        # stretches to keep the polls inside the budget.
        self.update_interval = _collection_interval(
            self.config_entry, self.quota, _collection_poll_cost(data)
        )
        return data

    def _fire_wanted_events(self, new_data: CollectionData) -> None:
        """Fire an event when a wanted set's availability or price changes."""
        if (data := self._previous) is None:
            return
        previous = {lego_set.number: lego_set for lego_set in data.wanted}
        region = self.region
        device_id = self.device_id
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
                        "device_id": device_id,
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
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            catalogue,
            name=f"{DOMAIN} feeds",
            update_interval=timedelta(hours=FEEDS_INTERVAL_HOURS),
        )
        self._batching_warned = False

    @property
    @override
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        return feeds_poll_cost(dt_util.now().date())

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

    @override
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
        if dt_util.now().month >= NEXT_YEAR_FROM_MONTH:
            await self._add_next_year(feeds, year + 1)
        if self.catalogue is not None:
            self.catalogue.remember([s for sets in feeds.values() for s in sets])
            await self.catalogue.async_save_if_dirty()
        self._fire_new_set_events(feeds)
        return feeds

    async def _add_next_year(self, feeds: dict[str, list[LegoSet]], year: int) -> None:
        """Put next year's announced sets ahead of this year's, newest first."""
        # One batched call, with no per-theme fallback: most themes have nothing
        # announced for next year yet, which is not a sign that batching broke.
        upcoming: dict[str, list[LegoSet]] = {theme: [] for theme in feeds}
        for lego_set in await self._theme_query(",".join(feeds), year):
            if lego_set.theme in upcoming:
                upcoming[lego_set.theme].append(lego_set)
        for theme, sets in upcoming.items():
            known = {lego_set.number for lego_set in feeds[theme]}
            feeds[theme] = [s for s in sets if s.number not in known] + feeds[theme]

    def _fire_new_set_events(self, feeds: dict[str, list[LegoSet]]) -> None:
        """Fire an event per set new since the previous poll, baselining the first."""
        if (previous := self._previous) is None:
            return
        region = self.region
        device_id = self.device_id
        for theme, sets in feeds.items():
            seen = {lego_set.number for lego_set in previous.get(theme, [])}
            for lego_set in sets:
                if lego_set.number in seen:
                    continue
                launch = lego_set.release_date(region)
                exit_date = lego_set.retirement_date(region)
                self.hass.bus.async_fire(
                    EVENT_NEW_SET,
                    {
                        "entry_id": self.config_entry.entry_id,
                        "device_id": device_id,
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


def releases_query(year: int) -> dict[str, Any]:
    """Return the getSets query the release feed pages through for a year."""
    # Ascending, so if the page cap ever bites it drops gear numbered in the
    # millions rather than the sets the rows are for. The live API tests run this
    # same query, so the two cannot drift apart.
    return {"year": year, "orderBy": "Number"}


class LegoReleasesCoordinator(LegoBaseCoordinator[list[LegoSet]]):
    """Poll every set of the year for the panel's all-themes release rows."""

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
        catalogue: SetCatalogue | None = None,
    ) -> None:
        """Initialise the releases coordinator."""
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            catalogue,
            name=f"{DOMAIN} releases",
            update_interval=timedelta(hours=RELEASES_INTERVAL_HOURS),
        )
        # Pages each year took at the last poll; None until one has measured them.
        self._pages_this_year: int | None = None
        self._pages_next_year = 1

    @property
    def measured_cost(self) -> int | None:
        """Return what a poll costs by the last one's page counts, if it ran."""
        if self._pages_this_year is None:
            return None
        autumn = dt_util.now().month >= NEXT_YEAR_FROM_MONTH
        return self._pages_this_year + (self._pages_next_year if autumn else 0)

    @property
    @override
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        measured = self.measured_cost
        return (
            measured
            if measured is not None
            else releases_poll_cost(dt_util.now().date())
        )

    async def _year(self, year: int) -> tuple[list[LegoSet], int]:
        """Fetch every set Brickset lists for a year and the pages it took."""
        sets = await self.client.get_all_sets(
            releases_query(year), max_pages=RELEASES_MAX_PAGES
        )
        # Paging stops at the first short page, so a full last page costs one more.
        return sets, min(len(sets) // PAGE_SIZE + 1, RELEASES_MAX_PAGES)

    @override
    async def _async_update_data(self) -> list[LegoSet]:
        """Poll daily, or retry sooner while there is nothing to show yet."""
        try:
            data = await super()._async_update_data()
        except UpdateFailed:
            if self._previous is None:
                self.update_interval = timedelta(hours=RELEASES_RETRY_HOURS)
            raise
        self.update_interval = timedelta(hours=RELEASES_INTERVAL_HOURS)
        return data

    @override
    async def _fetch(self) -> list[LegoSet]:
        """Fetch this year's sets, and next year's once LEGO starts announcing them."""
        # Every page is reserved up front: a poll that ran out of budget part way
        # would spend its pages and keep none of them.
        self.quota.reserve(self.poll_cost)
        # getSets has no date filter, so the window either side of today is cut
        # when the panel asks. In early January last December's sets are missed,
        # which a second year of pages every day would cost too much to cover.
        now = dt_util.now()
        sets, self._pages_this_year = await self._year(now.year)
        if now.month >= NEXT_YEAR_FROM_MONTH:
            known = {lego_set.number for lego_set in sets}
            upcoming, self._pages_next_year = await self._year(now.year + 1)
            sets += [s for s in upcoming if s.number not in known]
        if self.catalogue is not None:
            self.catalogue.remember(sets)
            await self.catalogue.async_save_if_dirty()
        return sets


@dataclass(slots=True)
class LegoRuntimeData:
    """Everything a config entry needs at runtime."""

    client: BricksetClient
    quota: QuotaManager
    collection: LegoCollectionCoordinator
    feeds: LegoFeedsCoordinator
    catalogue: SetCatalogue | None
    # Only while the all-themes release rows are switched on.
    releases: LegoReleasesCoordinator | None = None


type LegoConfigEntry = ConfigEntry[LegoRuntimeData]
