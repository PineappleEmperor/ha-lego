"""Daily call budget tracking for the Brickset API."""

# Brickset allows 100 getSets calls per key per day and counts no other method,
# so the tally kept between polls is reconciled against the authoritative
# server-side figure from getKeyUsageStats. The day is Brickset's, which rolls
# over at midnight UTC whatever the Home Assistant time zone.

from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from datetime import UTC, date, datetime, time, timedelta
import math

from homeassistant.util import dt as dt_util

from .const import (
    BRICKSET_DAILY_CALL_LIMIT,
    COLLECTION_INTERVAL_STEPS_HOURS,
    FEEDS_INTERVAL_HOURS,
    KEEPALIVE_INTERVAL,
    NEXT_YEAR_FROM_MONTH,
    POLL_SHARE_OF_BUDGET,
    RELEASES_INTERVAL_HOURS,
    RELEASES_PAGES_ESTIMATE,
    RELEASES_WINDOW_DAYS,
)
from .exceptions import BricksetQuotaError

# The calls between the budget and Brickset's 100 are held back for keeping an
# account showing anything at all: never for a scheduled poll.
_DRAWING_RESERVE: ContextVar[bool] = ContextVar("lego_drawing_reserve", default=False)


def window_years(today: date) -> list[int]:
    """Return the years the release window either side of today touches."""
    # Most of the year that is this year alone; it reaches back into last year
    # through most of January and on into next year through most of December.
    window = timedelta(days=RELEASES_WINDOW_DAYS)
    return sorted({(today - window).year, today.year, (today + window).year})


def poll_window_years(today: date) -> list[int]:
    """Return the years the window touches before the next daily poll comes round."""
    # The panel cuts the window when it is viewed, up to a day after the poll, so
    # 3 December's poll already reads the January wave 4 December's window holds.
    ahead = today + timedelta(hours=RELEASES_INTERVAL_HOURS)
    return sorted(set(window_years(today)) | set(window_years(ahead)))


def feed_years(today: date, releases: bool, next_year: bool) -> list[int]:
    """Return the years a feeds poll asks Brickset for."""
    # next_year says whether next year is worth a call: whether it has sets filed
    # under it that the feeds want. A year the window touches is fetched whole while
    # following releases across all themes; otherwise only this year is.
    years = set(poll_window_years(today)) if releases else {today.year}
    years.discard(today.year + 1)
    if next_year:
        years.add(today.year + 1)
    return sorted(years)


def feeds_poll_estimate(today: date, watching_themes: bool, releases: bool) -> int:
    """Estimate one feeds poll's billed calls before any poll has measured them."""
    # Assumes next year is announced from the usual month, as getThemes may not
    # have been asked yet.
    if not (watching_themes or releases):
        return 0
    years = feed_years(today, releases, today.month >= NEXT_YEAR_FROM_MONTH)
    if not releases:
        # Every watched theme rides in one comma-joined call per year.
        return len(years)
    return sum(RELEASES_PAGES_ESTIMATE if year <= today.year else 1 for year in years)


def feeds_interval(releases: bool) -> timedelta:
    """Return how often the feeds poll."""
    # A poll reading whole years costs a few calls, so it runs daily.
    return timedelta(
        hours=RELEASES_INTERVAL_HOURS if releases else FEEDS_INTERVAL_HOURS
    )


def feeds_calls_per_day(
    watching_themes: bool,
    releases: bool,
    today: date,
    measured: int | None = None,
) -> int:
    """Return the billed calls the feeds spend a day, measured once a poll has run."""
    if not (watching_themes or releases):
        return 0
    cost = (
        measured
        if measured is not None
        else feeds_poll_estimate(today, watching_themes, releases)
    )
    polls = math.ceil(timedelta(days=1) / feeds_interval(releases))
    return polls * cost


def reserve_calls_per_day(budget: int, poll_cost: int) -> int:
    """Return the most the collection draws above the budget once it is spent."""
    # A poll every KEEPALIVE_INTERVAL, never past Brickset's own limit.
    keepalive = math.ceil(timedelta(days=1) / KEEPALIVE_INTERVAL) * poll_cost
    return min(keepalive, max(BRICKSET_DAILY_CALL_LIMIT - budget, 0))


def collection_interval(budget: int, poll_cost: int, feeds_calls: int) -> timedelta:
    """Return the shortest collection interval whose polls fit the budget."""
    available = budget * POLL_SHARE_OF_BUDGET - feeds_calls
    for hours in COLLECTION_INTERVAL_STEPS_HOURS:
        if math.ceil(24 / hours) * poll_cost <= available:
            return timedelta(hours=hours)
    return timedelta(hours=COLLECTION_INTERVAL_STEPS_HOURS[-1])


class QuotaManager:
    """Track getSets usage against the configured daily budget."""

    def __init__(self, budget: int) -> None:
        """Initialise the manager with a daily call budget."""
        self._budget = min(budget, BRICKSET_DAILY_CALL_LIMIT)
        self._day: date = dt_util.utcnow().date()
        self._calls_today = 0
        self._server_usage: dict[date, int] = {}

    @property
    def budget(self) -> int:
        """Return the configured daily budget."""
        return self._budget

    @property
    def limit(self) -> int:
        """Return Brickset's own daily limit, which the reserve may reach."""
        return BRICKSET_DAILY_CALL_LIMIT

    @property
    def calls_today(self) -> int:
        """Return the best known number of billed calls made today."""
        self._roll_day()
        return self._calls_today

    @property
    def remaining(self) -> int:
        """Return how many calls are left before the budget is spent."""
        return max(self._budget - self.calls_today, 0)

    @property
    def server_usage(self) -> dict[date, int]:
        """Return the last known per-day usage reported by Brickset."""
        return dict(self._server_usage)

    @property
    def resets_at(self) -> datetime:
        """Return when the budget next resets, at midnight UTC."""
        tomorrow = dt_util.utcnow().date() + timedelta(days=1)
        return datetime.combine(tomorrow, time(), UTC)

    def _roll_day(self) -> None:
        """Reset the tally when Brickset's day changes."""
        today = dt_util.utcnow().date()
        if today != self._day:
            self._day = today
            self._calls_today = 0

    def sync(self, usage: dict[date, int]) -> None:
        """Reconcile with Brickset's count, higher if another client shares the key."""
        self._roll_day()
        self._server_usage = usage
        reported = usage.get(self._day)
        if reported is not None and reported > self._calls_today:
            self._calls_today = reported

    def fits(self, count: int) -> bool:
        """Whether count more calls fit the budget, the reserve left untouched."""
        return self.calls_today + count <= self._budget

    @contextmanager
    def drawing_reserve(self, draw: bool = True) -> Iterator[None]:
        """Let the calls inside spend past the budget, up to Brickset's own limit."""
        # A context variable rather than a flag, so the other coordinator's poll,
        # running alongside in its own task, cannot draw on it too.
        token = _DRAWING_RESERVE.set(draw or _DRAWING_RESERVE.get())
        try:
            yield
        finally:
            _DRAWING_RESERVE.reset(token)

    def reserve(self, count: int = 1) -> None:
        """Raise if making count more calls would exceed the budget."""
        self._roll_day()
        cap = BRICKSET_DAILY_CALL_LIMIT if _DRAWING_RESERVE.get() else self._budget
        if self._calls_today + count > cap:
            raise BricksetQuotaError(
                f"Daily Brickset call budget spent ({self._calls_today}/{cap})"
            )

    def record(self, count: int = 1) -> None:
        """Record that billed calls were made."""
        self._roll_day()
        self._calls_today += count
