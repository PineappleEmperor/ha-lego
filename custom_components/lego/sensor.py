"""Sensor platform for the LEGO integration."""

from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime
from typing import TYPE_CHECKING, Any, override

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import CONF_REGION, EntityCategory, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DEFAULT_REGION, REGION_CURRENCY
from .coordinator import FeedsData, LegoCollectionCoordinator, LegoFeedsCoordinator
from .entity import LegoCollectionEntity, LegoEntity
from .models import CollectionSummary, LegoSet

if TYPE_CHECKING:
    from .coordinator import LegoConfigEntry

PARALLEL_UPDATES = 0


@dataclass(frozen=True, kw_only=True)
class LegoSummaryEntityDescription(SensorEntityDescription):
    """Describes a sensor derived from the collection summary."""

    value_fn: Callable[[CollectionSummary], int | float]
    items_fn: Callable[[list[LegoSet], str], list[dict[str, Any]]] | None = None


def _set_number_key(number: str) -> tuple[int, int, str]:
    """Sort set numbers by their numeric parts, so 6876-1 precedes 10294-1."""
    base, _, variant = number.partition("-")
    if not base.isdigit():
        return (1, 0, number)
    return (0, int(base), variant.zfill(3))


def _wishlist_items(sets: list[LegoSet], region: str) -> list[dict[str, Any]]:
    """Return a lean record per wanted set, soonest to retire first."""
    today = dt_util.now().date().isoformat()
    # The full per-set payload is 16 fields, which a long wishlist would push to
    # every connected browser on each update. These are what a card needs.
    items: list[dict[str, Any]] = [
        {
            "set_number": lego_set.number,
            "set_name": lego_set.name,
            "theme": lego_set.theme,
            "year": lego_set.year,
            "retail_price": lego_set.price(region),
            "retirement_date": (
                retirement.isoformat()
                if (retirement := lego_set.retirement_date(region))
                else None
            ),
            "priority": lego_set.collection.wanted_priority,
            "image_url": lego_set.image_url,
            "brickset_url": lego_set.brickset_url,
        }
        for lego_set in sets
    ]
    for item in items:
        retires = item["retirement_date"]
        item["retired"] = retires is not None and retires < today
    # A retired set is the least actionable thing on a wishlist, so it sinks
    # rather than floats. Brickset exposes no date a set was added, so set
    # number breaks the remaining ties.
    return sorted(
        items,
        key=lambda item: (
            item["retired"],
            item["retirement_date"] is None,
            item["retirement_date"] or "",
            _set_number_key(item["set_number"]),
        ),
    )


SUMMARY_SENSORS: tuple[LegoSummaryEntityDescription, ...] = (
    LegoSummaryEntityDescription(
        key="sets_owned",
        translation_key="sets_owned",
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement="sets",
        value_fn=lambda summary: summary.sets_owned,
    ),
    LegoSummaryEntityDescription(
        key="sets_distinct",
        translation_key="sets_distinct",
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement="sets",
        value_fn=lambda summary: summary.sets_distinct,
    ),
    LegoSummaryEntityDescription(
        key="pieces_owned",
        translation_key="pieces_owned",
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement="pieces",
        value_fn=lambda summary: summary.pieces_owned,
    ),
    LegoSummaryEntityDescription(
        key="minifigs_owned",
        translation_key="minifigs_owned",
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement="minifigs",
        value_fn=lambda summary: summary.minifigs_owned,
    ),
    LegoSummaryEntityDescription(
        key="sets_wanted",
        translation_key="sets_wanted",
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement="sets",
        value_fn=lambda summary: summary.sets_wanted,
        items_fn=_wishlist_items,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: LegoConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up LEGO sensors."""
    runtime = entry.runtime_data
    collection = runtime.collection

    entities: list[SensorEntity] = [
        LegoSummarySensor(collection, description) for description in SUMMARY_SENSORS
    ]
    entities.append(LegoValueSensor(collection))
    entities.append(LegoQuotaSensor(collection))
    entities.append(LegoLastSyncedSensor(collection))
    entities.append(LegoNextRetirementSensor(collection))
    entities.extend(
        LegoLatestThemeSetSensor(runtime.feeds, theme) for theme in runtime.feeds.themes
    )

    async_add_entities(entities)


class LegoSummarySensor(LegoCollectionEntity, SensorEntity):
    """A whole-collection total."""

    entity_description: LegoSummaryEntityDescription
    # Recording the list would write the whole wishlist to the database on every
    # poll, and past 16 KB the recorder drops the attributes altogether.
    _unrecorded_attributes = frozenset({"sets"})

    def __init__(
        self,
        coordinator: LegoCollectionCoordinator,
        description: LegoSummaryEntityDescription,
    ) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_{description.key}"

    @property
    @override
    def native_value(self) -> int | float | None:
        """Return the total."""
        return self.entity_description.value_fn(self.coordinator.data.summary)

    @property
    @override
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the sets behind the total, for the sensors that carry them."""
        items_fn = self.entity_description.items_fn
        if items_fn is None:
            return None
        return {"sets": items_fn(self.coordinator.data.wanted, self.coordinator.region)}


class LegoValueSensor(LegoCollectionEntity, SensorEntity):
    """Total LEGO.com RRP of the owned collection, not market value."""

    _attr_translation_key = "collection_value"
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_state_class = SensorStateClass.TOTAL

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_collection_value"

    @property
    @override
    def native_unit_of_measurement(self) -> str | None:
        """Return the currency for the configured pricing region."""
        return REGION_CURRENCY.get(self.coordinator.region)

    @property
    @override
    def native_value(self) -> float | None:
        """Return the summed RRP."""
        return self.coordinator.data.summary.value

    @property
    @override
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return how much of the collection has no published price."""
        return {
            "region": self.coordinator.region,
            "sets_missing_price": self.coordinator.data.summary.sets_missing_price,
        }


class LegoQuotaSensor(LegoCollectionEntity, SensorEntity):
    """Billed Brickset calls made today."""

    _attr_translation_key = "api_calls_today"
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "calls"

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_api_calls_today"

    @property
    @override
    def available(self) -> bool:
        """Report quota even when a poll failed, since that is when it matters."""
        return True

    @property
    @override
    def native_value(self) -> int:
        """Return calls used today."""
        return self.coordinator.quota.calls_today

    @property
    @override
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return budget headroom and recent daily usage."""
        quota = self.coordinator.quota
        return {
            "budget": quota.budget,
            "remaining": quota.remaining,
            "daily_limit": 100,
            "recent_usage": {
                day.isoformat(): count
                for day, count in sorted(quota.server_usage.items(), reverse=True)
            },
        }


class LegoLastSyncedSensor(LegoCollectionEntity, SensorEntity):
    """When Brickset last answered a collection poll."""

    _attr_translation_key = "last_synced"
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_last_synced"

    @override
    async def async_added_to_hass(self) -> None:
        """Follow every successful poll, not only the ones that changed data."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, self.coordinator.signal_synced, self.async_write_ha_state
            )
        )

    @property
    @override
    def available(self) -> bool:
        """Stay up while polls fail, since that is when the age of the data matters."""
        return True

    @property
    @override
    def native_value(self) -> datetime | None:
        """Return when the collection was last synced."""
        return self.coordinator.last_synced


def _set_attributes(lego_set: LegoSet, region: str) -> dict[str, Any]:
    """Return the public attribute payload for a set."""
    retirement = lego_set.retirement_date(region)
    release = lego_set.release_date(region)
    return {
        "set_number": lego_set.number,
        "set_name": lego_set.name,
        "theme": lego_set.theme,
        "subtheme": lego_set.subtheme,
        "year": lego_set.year,
        "pieces": lego_set.pieces,
        "minifigs": lego_set.minifigs,
        "retail_price": lego_set.price(region),
        "availability": lego_set.availability,
        "release_date": release.isoformat() if release else None,
        "retirement_date": retirement.isoformat() if retirement else None,
        "owned": lego_set.collection.owned,
        "qty_owned": lego_set.collection.qty_owned,
        "wanted": lego_set.collection.wanted,
        "image_url": lego_set.image_url,
        "brickset_url": lego_set.brickset_url,
    }


class LegoNextRetirementSensor(LegoCollectionEntity, SensorEntity):
    """Days until the next set on the wishlist retires."""

    _attr_translation_key = "next_wishlist_retirement"
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.DAYS

    def __init__(self, coordinator: LegoCollectionCoordinator) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_next_retirement"

    @property
    def _next(self) -> tuple[date, LegoSet] | None:
        """Return the soonest wishlist retirement still to come."""
        today = dt_util.now().date()
        region = self.coordinator.region
        # Already-retired sets are excluded rather than reported as negative days;
        # the wishlist attribute on Sets wanted is where those still show up.
        upcoming = [
            (retires, lego_set)
            for lego_set in self.coordinator.data.wanted
            if (retires := lego_set.retirement_date(region)) is not None
            and retires >= today
        ]
        if not upcoming:
            return None
        return min(upcoming, key=lambda item: item[0])

    @property
    @override
    def native_value(self) -> int | None:
        """Return days remaining until that retirement."""
        soonest = self._next
        if soonest is None:
            return None
        return (soonest[0] - dt_util.now().date()).days

    @property
    @override
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the full record of the set that is retiring."""
        soonest = self._next
        if soonest is None:
            return None
        return _set_attributes(soonest[1], self.coordinator.region)


class LegoLatestThemeSetSensor(LegoEntity[FeedsData], SensorEntity):
    """The most recent set Brickset lists for a watched theme."""

    _attr_translation_key = "latest_theme_set"

    def __init__(self, coordinator: LegoFeedsCoordinator, theme: str) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._theme = theme
        slug = theme.lower().replace(" ", "_")
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_feed_{slug}"
        self._attr_translation_placeholders = {"theme": theme}

    @property
    def _lego_set(self) -> LegoSet | None:
        """Return the newest set for this theme."""
        if not self.coordinator.data:
            return None
        sets = self.coordinator.data.themes.get(self._theme) or []
        return sets[0] if sets else None

    @property
    @override
    def native_value(self) -> str | None:
        """Return the newest set's number."""
        lego_set = self._lego_set
        return lego_set.number if lego_set else None

    @property
    @override
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the newest set's details plus how many launched this year."""
        lego_set = self._lego_set
        if lego_set is None:
            return None
        region = self.coordinator.config_entry.options.get(CONF_REGION, DEFAULT_REGION)
        attributes = _set_attributes(lego_set, region)
        attributes["sets_this_year"] = len(
            (self.coordinator.data.themes if self.coordinator.data else {}).get(
                self._theme
            )
            or []
        )
        return attributes
