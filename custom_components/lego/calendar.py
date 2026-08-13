"""Calendar platform for the LEGO integration."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import CONF_REGION, DEFAULT_REGION
from .coordinator import LegoCollectionCoordinator, LegoFeedsCoordinator
from .entity import LegoCollectionEntity
from .models import LegoSet

if TYPE_CHECKING:
    from . import LegoConfigEntry

PARALLEL_UPDATES = 0

LOOKAHEAD = timedelta(days=730)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: LegoConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up LEGO calendars."""
    runtime = entry.runtime_data
    async_add_entities(
        [
            LegoRetirementCalendar(runtime.collection),
            LegoReleaseCalendar(runtime.collection, runtime.feeds),
            LegoAnniversaryCalendar(runtime.collection),
        ]
    )


def _all_day(summary: str, day: date, lego_set: LegoSet) -> CalendarEvent:
    """Build an all-day event for a set."""
    return CalendarEvent(
        summary=summary,
        start=day,
        end=day + timedelta(days=1),
        description=lego_set.brickset_url or "",
        uid=f"{lego_set.set_id}-{day.isoformat()}",
    )


class LegoCalendarBase(LegoCollectionEntity, CalendarEntity):
    """Shared range handling for the LEGO calendars."""

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the calendar."""
        super().__init__(coordinator)
        self._collection = coordinator

    @property
    def region(self) -> str:
        """Return the configured pricing region."""
        return self._collection.config_entry.options.get(CONF_REGION, DEFAULT_REGION)

    def _build_events(self, start: date, end: date) -> list[CalendarEvent]:
        """Build every event falling inside the range."""
        raise NotImplementedError

    @property
    def event(self) -> CalendarEvent | None:
        """Return the next upcoming event."""
        today = dt_util.now().date()
        events = self._build_events(today, today + LOOKAHEAD)
        if not events:
            return None
        return min(events, key=lambda item: item.start)

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Return events in a range."""
        events = self._build_events(start_date.date(), end_date.date())
        return sorted(events, key=lambda item: item.start)


class LegoRetirementCalendar(LegoCalendarBase):
    """LEGO.com exit dates for the sets you own or want."""

    _attr_translation_key = "retirements"

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the calendar."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_retirements"

    def _build_events(self, start: date, end: date) -> list[CalendarEvent]:
        """Build a retirement event per set with a published exit date."""
        if self.coordinator.data is None:
            return []
        region = self.region
        events: list[CalendarEvent] = []
        for lego_set in self.coordinator.data.all_sets.values():
            retires = lego_set.retirement_date(region)
            if retires is None or not start <= retires <= end:
                continue
            events.append(
                _all_day(
                    f"{lego_set.number} {lego_set.name} retires", retires, lego_set
                )
            )
        return events


class LegoReleaseCalendar(LegoCalendarBase):
    """LEGO.com launch dates for wanted sets and followed themes."""

    _attr_translation_key = "releases"

    def __init__(
        self, coordinator: LegoCollectionCoordinator, feeds: LegoFeedsCoordinator
    ) -> None:
        """Initialise the calendar."""
        super().__init__(coordinator)
        self._feeds = feeds
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_releases"

    def _build_events(self, start: date, end: date) -> list[CalendarEvent]:
        """Build a release event per wanted or followed-theme set."""
        region = self.region
        candidates: dict[str, LegoSet] = {}
        if self.coordinator.data is not None:
            for lego_set in self.coordinator.data.wanted:
                candidates[lego_set.number] = lego_set
        for theme_sets in (self._feeds.data or {}).values():
            for lego_set in theme_sets:
                candidates.setdefault(lego_set.number, lego_set)

        events: list[CalendarEvent] = []
        for lego_set in candidates.values():
            released = lego_set.release_date(region)
            if released is None or not start <= released <= end:
                continue
            events.append(
                _all_day(
                    f"{lego_set.number} {lego_set.name} released", released, lego_set
                )
            )
        return events


class LegoAnniversaryCalendar(LegoCalendarBase):
    """Yearly anniversaries of the sets you own."""

    _attr_translation_key = "anniversaries"

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the calendar."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_anniversaries"

    def _build_events(self, start: date, end: date) -> list[CalendarEvent]:
        """Build an anniversary per owned set, per year in the range."""
        if self.coordinator.data is None:
            return []
        region = self.region
        events: list[CalendarEvent] = []
        for lego_set in self.coordinator.data.owned:
            launch = lego_set.release_date(region)
            if launch is None:
                if lego_set.year is None:
                    continue
                launch = date(lego_set.year, 1, 1)
            for year in range(start.year, end.year + 1):
                try:
                    occurrence = launch.replace(year=year)
                except ValueError:
                    # 29 February in a non-leap year.
                    occurrence = launch.replace(year=year, day=28)
                age = year - launch.year
                if age <= 0 or not start <= occurrence <= end:
                    continue
                events.append(
                    _all_day(
                        f"{lego_set.name} turns {age}",
                        occurrence,
                        lego_set,
                    )
                )
        return events
