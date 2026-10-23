"""Daily call budget tracking for the Brickset API."""

# Brickset allows 100 getSets calls per key per day and counts no other method,
# so the tally kept between polls is reconciled against the authoritative
# server-side figure from getKeyUsageStats. The day is Brickset's, which rolls
# over at midnight UTC whatever the Home Assistant time zone.

from datetime import UTC, date, datetime, time, timedelta
import math

from homeassistant.util import dt as dt_util

from .const import (
    BRICKSET_DAILY_CALL_LIMIT,
    COLLECTION_INTERVAL_STEPS_HOURS,
    FEEDS_INTERVAL_HOURS,
    POLL_SHARE_OF_BUDGET,
)
from .exceptions import BricksetQuotaError


def feeds_calls_per_day(watching_themes: bool) -> int:
    """Return the billed calls the theme feeds spend a day."""
    # Every watched theme rides in one comma-joined call, so the cost does not grow
    # with the theme count.
    return math.ceil(24 / FEEDS_INTERVAL_HOURS) if watching_themes else 0


def collection_interval(
    budget: int, poll_cost: int, watching_themes: bool
) -> timedelta:
    """Return the shortest collection interval whose polls fit the budget."""
    available = budget * POLL_SHARE_OF_BUDGET - feeds_calls_per_day(watching_themes)
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

    def reserve(self, count: int = 1) -> None:
        """Raise if making count more calls would exceed the budget."""
        self._roll_day()
        if self._calls_today + count > self._budget:
            raise BricksetQuotaError(
                f"Daily Brickset call budget spent ({self._calls_today}/{self._budget})"
            )

    def record(self, count: int = 1) -> None:
        """Record that billed calls were made."""
        self._roll_day()
        self._calls_today += count
