"""Data update coordinators for the LEGO integration."""

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
import logging
from typing import Any, cast, override

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_REGION
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers import device_registry as dr, issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import BricksetClient, pages_spent
from .catalogue import SetCatalogue
from .const import (
    CONF_RELEASES,
    CONF_THEMES,
    DEFAULT_REGION,
    DEFAULT_RELEASES,
    DOMAIN,
    EVENT_NEW_SET,
    EVENT_WANTED_CHANGED,
    FEEDS_RETRY_HOURS,
    MIN_COLLECTION_POLL_COST,
    MIN_TIME_BETWEEN_QUOTA_CHECKS,
    NEXT_YEAR_FROM_MONTH,
    RELEASES_PAGES_ESTIMATE,
    YEAR_MAX_PAGES,
)
from .exceptions import (
    BricksetAuthError,
    BricksetError,
    BricksetQuotaError,
    BricksetUserHashError,
)
from .models import CollectionSummary, LegoSet, ThemeSpan
from .quota import (
    QuotaManager,
    collection_interval,
    feed_years,
    feeds_calls_per_day,
    feeds_interval,
    feeds_poll_estimate,
    poll_window_years,
)
from .shared import YEAR_READS, YearReads

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
    # Owned and wanted are one call each until a list fills a page.
    if data is None:
        return MIN_COLLECTION_POLL_COST
    pages = pages_spent(len(data.owned)) + pages_spent(len(data.wanted))
    return max(pages, MIN_COLLECTION_POLL_COST)


def _collection_interval(
    config_entry: LegoConfigEntry, quota: QuotaManager, poll_cost: int
) -> timedelta:
    """Return the collection interval left over by the entry's other polls."""
    options = config_entry.options
    # Runtime data is set after the first collection poll, which uses the estimate.
    runtime: LegoRuntimeData | None = getattr(config_entry, "runtime_data", None)
    feeds_calls = feeds_calls_per_day(
        bool(options.get(CONF_THEMES)),
        bool(options.get(CONF_RELEASES, DEFAULT_RELEASES)),
        dt_util.now().date(),
        runtime.feeds.measured_cost if runtime is not None else None,
    )
    return collection_interval(quota.budget, poll_cost, feeds_calls)


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
        update_interval: timedelta | None,
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


@dataclass(slots=True)
class FeedsData:
    """Everything the feeds poll produced."""

    # The followed themes' sets, the newest year first.
    themes: dict[str, list[LegoSet]] = field(default_factory=dict)
    # Every set of each year fetched, while following releases across all themes.
    releases: list[LegoSet] | None = None


def year_query(year: int) -> dict[str, Any]:
    """Return the getSets query that reads one whole year."""
    # Ascending, so if the page cap ever bites it drops gear numbered in the
    # millions rather than the sets the rows are for. The live API tests run this
    # same query, so the two cannot drift apart.
    return {"year": year, "orderBy": "Number"}


def theme_query(themes: list[str], year: int) -> dict[str, Any]:
    """Return the getSets query for one year of the followed themes."""
    # Brickset accepts a comma-separated theme, turning one call per theme into
    # one call for them all.
    return {"theme": ",".join(themes), "year": year, "orderBy": "NumberDESC"}


def newest_first(sets: list[LegoSet], region: str, today: date) -> list[LegoSet]:
    """Order a theme's sets so the most recently released comes first."""
    # Then the dated ones still to come, soonest first, and the announced sets
    # with no date last, since they are furthest away. Within a day the higher
    # set number, the later one, goes first: the sort keeps that order.

    def key(item: LegoSet) -> tuple[int, int]:
        released = item.release_date(region)
        if released is None:
            return (2, 0)
        if released <= today:
            return (0, -released.toordinal())
        return (1, released.toordinal())

    by_number = sorted(sets, key=lambda item: item.number_key, reverse=True)
    return sorted(by_number, key=key)


def paging_issue_id(entry_id: str) -> str:
    """Return the id of the Repair raised while the followed themes need paging."""
    return f"theme_feed_paging_{entry_id}"


class LegoFeedsCoordinator(LegoBaseCoordinator[FeedsData]):
    """Poll new sets in the followed themes, and in every theme if asked to."""

    # Following releases across all themes reads each year the release window
    # touches whole, and cuts the followed themes from that, so one poll serves
    # both. Otherwise only the followed themes are asked for. Either way next year
    # costs a call only once getThemes, which is free, says it has sets.

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: LegoConfigEntry,
        client: BricksetClient,
        quota: QuotaManager,
        catalogue: SetCatalogue | None = None,
        collection: LegoCollectionCoordinator | None = None,
    ) -> None:
        """Initialise the feeds coordinator."""
        # Whose sets are owned or wanted, for copies of another account's read.
        self._collection = collection
        self._year_reads = hass.data.setdefault(YEAR_READS, YearReads())
        options = config_entry.options
        releases = bool(options.get(CONF_RELEASES, DEFAULT_RELEASES))
        active = releases or bool(options.get(CONF_THEMES))
        super().__init__(
            hass,
            config_entry,
            client,
            quota,
            catalogue,
            name=f"{DOMAIN} feeds",
            # With nothing to follow there is nothing to poll, even though the
            # release calendar still listens.
            update_interval=feeds_interval(releases) if active else None,
        )
        self._batching_warned = False
        # Billed pages each year took the last time a poll fetched it.
        self._pages: dict[int, int] = {}
        self._measured: int | None = None
        # getThemes' last good answer, so one failure does not drop next year
        # from a poll and bring it back, as new sets, in the one after.
        self._theme_years: dict[str, ThemeSpan] | None = None
        # getThemes can file a theme under next year while getSets returns nothing
        # for it yet. What it claimed when next year last came back empty, so the
        # call is skipped until the claim changes: a new set filed in the theme, or
        # a later year.
        self._empty_claim: frozenset[tuple[str, ThemeSpan]] | None = None
        self._claim: frozenset[tuple[str, ThemeSpan]] | None = None
        # Sets each year returned at the last poll that fetched it.
        self._found: dict[int, int] = {}
        if releases or not options.get(CONF_THEMES):
            # Only a theme-only feed can page, and nothing else would clear it.
            ir.async_delete_issue(hass, DOMAIN, paging_issue_id(config_entry.entry_id))

    @property
    def themes(self) -> list[str]:
        """Return the themes being watched for new releases."""
        return list(self.config_entry.options.get(CONF_THEMES, []))

    @property
    def releases(self) -> bool:
        """Whether releases across all themes are followed."""
        return bool(self.config_entry.options.get(CONF_RELEASES, DEFAULT_RELEASES))

    @property
    def active(self) -> bool:
        """Whether there is anything for the feeds to poll."""
        return self.releases or bool(self.themes)

    @property
    def follow_cost(self) -> int:
        """Return the billed calls following one more theme spends at once."""
        if self.releases:
            # The theme is cut from the years already read.
            return 0
        # Every theme rides in the same batched call, so it costs one poll, less
        # any year another account has just read whole.
        today = dt_util.now().date()
        years = feed_years(today, False, today.month >= NEXT_YEAR_FROM_MONTH)
        return self._planned_cost(years, today)

    async def async_themes_changed(self) -> bool:
        """Follow the themes the options now name, without reloading the entry."""
        # True once every followed theme's sets are in hand, False while they wait
        # on the next poll.
        self.update_interval = feeds_interval(self.releases) if self.active else None
        previous = self._previous
        today = dt_util.now().date()
        if self.releases:
            if previous is None or previous.releases is None:
                # The first read of the year is still to come, and will cut them.
                return False
            themes = self._cut_themes(previous.releases)
        elif previous is not None and set(self.themes) <= previous.themes.keys():
            # Only unfollowed: what is left was fetched already.
            themes = {theme: previous.themes[theme] for theme in self.themes}
        else:
            await self.async_refresh()
            return self.last_update_success and set(self.themes) <= (
                self.data.themes.keys() if self.data else set()
            )
        self.async_set_updated_data(
            FeedsData(
                themes={
                    theme: newest_first(sets, self.region, today)
                    for theme, sets in themes.items()
                },
                releases=previous.releases if previous else None,
            )
        )
        return True

    @property
    def measured_cost(self) -> int | None:
        """Return what the last poll's reads cost, or None before one has run."""
        # Counted whether this account paid or another's read of the year served it,
        # so the budget still holds if the other account goes.
        return self._measured

    @property
    @override
    def poll_cost(self) -> int:
        """Return the billed calls one refresh would spend."""
        if self._measured is not None:
            return self._measured
        return feeds_poll_estimate(
            dt_util.now().date(), bool(self.themes), self.releases
        )

    @override
    async def _async_update_data(self) -> FeedsData:
        """Poll on schedule, or retry sooner while there is nothing to show yet."""
        try:
            data = await super()._async_update_data()
        except UpdateFailed:
            if self._previous is None and self.active:
                self.update_interval = timedelta(hours=FEEDS_RETRY_HOURS)
            raise
        self.update_interval = feeds_interval(self.releases) if self.active else None
        return data

    async def _next_year_wanted(self, today: date) -> bool:
        """Ask getThemes, unbilled, whether next year has sets these feeds want."""
        next_year = today.year + 1
        try:
            self._theme_years = await self.client.get_theme_years()
        except BricksetError as err:
            _LOGGER.debug("Could not ask Brickset which years have sets: %s", err)
            if self._theme_years is None:
                return today.month >= NEXT_YEAR_FROM_MONTH
        claims = {
            theme: span
            for theme, span in self._theme_years.items()
            if span.year_to >= next_year
        }
        followed = {theme.casefold() for theme in self.themes}
        watched = {
            theme: span
            for theme, span in claims.items()
            if theme.casefold() in followed
        }
        if watched:
            claim = frozenset(watched.items())
        elif self.releases and next_year in poll_window_years(today) and claims:
            # The release rows want next year only once the window reaches it.
            claim = frozenset(claims.items())
        else:
            return False
        self._claim = claim
        return claim != self._empty_claim

    def _planned_cost(self, years: list[int], today: date) -> int:
        """Return what fetching these years should cost, by the last poll's pages."""
        return sum(
            self._pages.get(
                year,
                RELEASES_PAGES_ESTIMATE if self.releases and year <= today.year else 1,
            )
            for year in years
            if self._year_reads.fresh(year, self.config_entry.entry_id) is None
        )

    def _own_sets(self) -> dict[str, LegoSet]:
        """Return this account's owned and wanted sets, by number."""
        if self._collection is None or self._collection.data is None:
            return {}
        return self._collection.data.all_sets

    @override
    async def _fetch(self) -> FeedsData:
        """Fetch the years these feeds need, and cut the followed themes from them."""
        if not self.active:
            return FeedsData()
        today = dt_util.now().date()
        years = feed_years(today, self.releases, await self._next_year_wanted(today))
        # Every page is reserved up front: a poll that ran out of budget part way
        # would spend its pages and keep none of them.
        self.quota.reserve(self._planned_cost(years, today))
        if self.releases:
            data = await self._fetch_years(years)
        else:
            data = FeedsData(themes=await self._fetch_themes(years, today))
        # Neither query returns the sets in release order, so they are put in it.
        data.themes = {
            theme: newest_first(sets, self.region, today)
            for theme, sets in data.themes.items()
        }
        self._measured = sum(self._pages[year] for year in years)
        if today.year + 1 in years:
            # Remembered only when it came back empty, so a later poll skips it.
            self._empty_claim = None if self._found[today.year + 1] else self._claim
        if self.catalogue is not None:
            fetched = data.releases or [
                s for sets in data.themes.values() for s in sets
            ]
            self.catalogue.remember(fetched)
            await self.catalogue.async_save_if_dirty()
        self._fire_new_set_events(data.themes)
        return data

    async def _fetch_years(self, years: list[int]) -> FeedsData:
        """Read whole years, then pick the followed themes out of them."""
        sets: list[LegoSet] = []
        for year in years:
            if (
                read := self._year_reads.fresh(year, self.config_entry.entry_id)
            ) is not None:
                fetched = read.copies(self._own_sets())
                self._pages[year] = read.pages
            else:
                fetched = await self.client.get_all_sets(
                    year_query(year), max_pages=YEAR_MAX_PAGES
                )
                self._pages[year] = pages_spent(len(fetched), YEAR_MAX_PAGES)
                self._year_reads.remember(
                    year, self.config_entry.entry_id, self._pages[year], fetched
                )
            self._found[year] = len(fetched)
            sets.extend(fetched)
        # Reading every theme costs the same however many are followed.
        self._clear_paging_issue()
        return FeedsData(themes=self._cut_themes(sets), releases=sets)

    def _cut_themes(self, sets: list[LegoSet]) -> dict[str, list[LegoSet]]:
        """Pick each followed theme's sets out of a read of whole years."""
        themes: dict[str, list[LegoSet]] = {theme: [] for theme in self.themes}
        # A theme typed by hand need not match Brickset's capitals, which its own
        # theme filter forgives.
        followed = {theme.casefold(): theme for theme in self.themes}
        for lego_set in sets:
            if (theme := followed.get((lego_set.theme or "").casefold())) is not None:
                themes[theme].append(lego_set)
        return themes

    async def _fetch_themes(
        self, years: list[int], today: date
    ) -> dict[str, list[LegoSet]]:
        """Ask for the followed themes alone, one batched query per year."""
        themes = self.themes
        feeds: dict[str, list[LegoSet]] = {theme: [] for theme in themes}
        for year in years:
            if (
                read := self._year_reads.fresh(year, self.config_entry.entry_id)
            ) is not None:
                # Another account read the whole year, so the themes come free.
                found = self._cut_themes(read.copies(self._own_sets()))
                self._pages.setdefault(year, 1)
                self._found[year] = sum(len(sets) for sets in found.values())
            else:
                found = await self._theme_year(themes, year, today)
            for theme in themes:
                feeds[theme] += found[theme]
        return feeds

    async def _theme_year(
        self, themes: list[str], year: int, today: date
    ) -> dict[str, list[LegoSet]]:
        """Fetch one year of the followed themes, counting the pages it took."""
        batched = await self.client.get_all_sets(
            theme_query(themes, year), max_pages=YEAR_MAX_PAGES
        )
        found: dict[str, list[LegoSet]] = {theme: [] for theme in themes}
        for lego_set in batched:
            if lego_set.theme in found:
                found[lego_set.theme].append(lego_set)
        pages = pages_spent(len(batched), YEAR_MAX_PAGES)
        if year == today.year:
            self._update_paging_issue(pages)
            # The comma-joined theme is undocumented, so a theme it returned
            # nothing for this year is asked for on its own rather than silently
            # dropped. Next year is skipped: most themes have nothing there yet.
            missing = [theme for theme in themes if not found[theme]]
            if len(themes) > 1 and len(missing) == len(themes):
                self._warn_batching_lost(themes)
            for theme in missing if len(themes) > 1 else []:
                alone = await self.client.get_all_sets(
                    theme_query([theme], year), max_pages=YEAR_MAX_PAGES
                )
                pages += pages_spent(len(alone), YEAR_MAX_PAGES)
                found[theme] = alone
        self._pages[year] = pages
        self._found[year] = sum(len(sets) for sets in found.values())
        return found

    @property
    def _paging_issue_id(self) -> str:
        return paging_issue_id(self.config_entry.entry_id)

    def _update_paging_issue(self, pages: int) -> None:
        """Tell the user once the followed themes no longer fit one call."""
        if pages <= 1:
            self._clear_paging_issue()
            return
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            self._paging_issue_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="theme_feed_paging",
            translation_placeholders={
                "name": self.config_entry.title,
                "themes": str(len(self.themes)),
                "pages": str(pages),
                "calls": str(
                    feeds_calls_per_day(True, False, dt_util.now().date(), pages)
                ),
            },
        )

    def _clear_paging_issue(self) -> None:
        ir.async_delete_issue(self.hass, DOMAIN, self._paging_issue_id)

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

    def _fire_new_set_events(self, feeds: dict[str, list[LegoSet]]) -> None:
        """Fire an event per set new since the previous poll, baselining the first."""
        if (previous := self._previous) is None:
            return
        region = self.region
        device_id = self.device_id
        for theme, sets in feeds.items():
            if (before := previous.themes.get(theme)) is None:
                # A theme followed since the last poll is baselined like the first.
                continue
            seen = {lego_set.number for lego_set in before}
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


@dataclass(slots=True)
class LegoRuntimeData:
    """Everything a config entry needs at runtime."""

    client: BricksetClient
    quota: QuotaManager
    collection: LegoCollectionCoordinator
    feeds: LegoFeedsCoordinator
    catalogue: SetCatalogue | None
    # Brickset's records for sets someone asked about from a search, so the cards
    # show them in full and marking one costs nothing more. Kept until a restart.
    looked_up: dict[str, LegoSet] = field(default_factory=dict)


type LegoConfigEntry = ConfigEntry[LegoRuntimeData]
