"""Daily call budget tracking for the Brickset API."""

# Brickset allows 100 getSets calls per key per day and counts no other method,
# so the tally kept between polls is reconciled against the authoritative
# server-side figure from getKeyUsageStats.

from __future__ import annotations

from datetime import date

from homeassistant.util import dt as dt_util

from .const import BRICKSET_DAILY_CALL_LIMIT
from .exceptions import BricksetQuotaError


class QuotaManager:
    """Track getSets usage against the configured daily budget."""

    def __init__(self, budget: int) -> None:
        """Initialise the manager with a daily call budget."""
        self._budget = min(budget, BRICKSET_DAILY_CALL_LIMIT)
        self._day: date = dt_util.now().date()
        self._calls_today = 0
        self._server_usage: dict[date, int] = {}

    @property
    def budget(self) -> int:
        """Return the configured daily budget."""
        return self._budget

    @budget.setter
    def budget(self, value: int) -> None:
        """Update the budget, e.g. after an options change."""
        self._budget = min(value, BRICKSET_DAILY_CALL_LIMIT)

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

    def _roll_day(self) -> None:
        """Reset the local tally when the local day changes."""
        today = dt_util.now().date()
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
