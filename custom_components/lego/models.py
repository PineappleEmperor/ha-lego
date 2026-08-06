"""Data models for the LEGO integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any

from homeassistant.util import dt as dt_util


def _parse_date(value: Any) -> date | None:
    """Parse a Brickset timestamp into a date."""
    if not isinstance(value, str) or not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is not None:
        return parsed.date()
    return dt_util.parse_date(value[:10])


def _parse_datetime(value: Any) -> datetime | None:
    """Parse a Brickset timestamp into a datetime."""
    if not isinstance(value, str) or not value:
        return None
    return dt_util.parse_datetime(value)


def _as_int(value: Any) -> int | None:
    """Coerce a Brickset numeric field to int, tolerating nulls and strings."""
    if isinstance(value, bool) or value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _as_float(value: Any) -> float | None:
    """Coerce a Brickset numeric field to float, tolerating nulls and strings."""
    if isinstance(value, bool) or value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


@dataclass(slots=True)
class RegionPricing:
    """LEGO.com availability and RRP for a single market."""

    retail_price: float | None = None
    date_first_available: date | None = None
    date_last_available: date | None = None

    @classmethod
    def from_api(cls, data: dict[str, Any]) -> RegionPricing:
        """Build pricing from a LEGOCom region payload."""
        return cls(
            retail_price=_as_float(data.get("retailPrice")),
            date_first_available=_parse_date(data.get("dateFirstAvailable")),
            date_last_available=_parse_date(data.get("dateLastAvailable")),
        )


@dataclass(slots=True)
class CollectionStatus:
    """The signed-in user's ownership status for a set."""

    owned: bool = False
    wanted: bool = False
    qty_owned: int = 0
    rating: int | None = None
    notes: str = ""

    @classmethod
    def from_api(cls, data: dict[str, Any]) -> CollectionStatus:
        """Build collection status from a set's collection payload."""
        return cls(
            owned=bool(data.get("owned")),
            wanted=bool(data.get("wanted")),
            qty_owned=_as_int(data.get("qtyOwned")) or 0,
            rating=_as_int(data.get("rating")),
            notes=data.get("notes") or "",
        )


@dataclass(slots=True)
class LegoSet:
    """A LEGO set as described by Brickset."""

    set_id: int
    number: str
    name: str
    year: int | None = None
    theme: str = ""
    theme_group: str = ""
    subtheme: str = ""
    category: str = ""
    released: bool = False
    pieces: int | None = None
    minifigs: int | None = None
    image_url: str | None = None
    thumbnail_url: str | None = None
    brickset_url: str | None = None
    rating: float | None = None
    availability: str = ""
    last_updated: datetime | None = None
    collection: CollectionStatus = field(default_factory=CollectionStatus)
    pricing: dict[str, RegionPricing] = field(default_factory=dict)

    @classmethod
    def from_api(cls, data: dict[str, Any]) -> LegoSet:
        """Build a set from a getSets record."""
        image = data.get("image") or {}
        lego_com = data.get("LEGOCom") or {}
        return cls(
            set_id=_as_int(data.get("setID")) or 0,
            number=str(data.get("number") or ""),
            name=str(data.get("name") or ""),
            year=_as_int(data.get("year")),
            theme=data.get("theme") or "",
            theme_group=data.get("themeGroup") or "",
            subtheme=data.get("subtheme") or "",
            category=data.get("category") or "",
            released=bool(data.get("released")),
            pieces=_as_int(data.get("pieces")),
            minifigs=_as_int(data.get("minifigs")),
            image_url=image.get("imageURL"),
            thumbnail_url=image.get("thumbnailURL"),
            brickset_url=data.get("bricksetURL"),
            rating=_as_float(data.get("rating")),
            availability=data.get("availability") or "",
            last_updated=_parse_datetime(data.get("lastUpdated")),
            collection=CollectionStatus.from_api(data.get("collection") or {}),
            pricing={
                region: RegionPricing.from_api(payload)
                for region, payload in lego_com.items()
                if isinstance(payload, dict)
            },
        )

    @property
    def full_number(self) -> str:
        """Return the set number as Brickset displays it."""
        return self.number

    def price(self, region: str) -> float | None:
        """Return the LEGO.com RRP for a region, if published."""
        pricing = self.pricing.get(region)
        return pricing.retail_price if pricing else None

    def retirement_date(self, region: str) -> date | None:
        """Return the LEGO.com exit date for a region, if published."""
        pricing = self.pricing.get(region)
        return pricing.date_last_available if pricing else None

    def release_date(self, region: str) -> date | None:
        """Return the LEGO.com launch date for a region, if published."""
        pricing = self.pricing.get(region)
        return pricing.date_first_available if pricing else None


@dataclass(slots=True)
class CollectionSummary:
    """Aggregated totals across an owned collection."""

    sets_owned: int = 0
    sets_distinct: int = 0
    pieces_owned: int = 0
    minifigs_owned: int = 0
    sets_wanted: int = 0
    value: float = 0.0
    sets_missing_price: int = 0

    @classmethod
    def from_sets(
        cls, owned: list[LegoSet], wanted: list[LegoSet], region: str
    ) -> CollectionSummary:
        """Aggregate owned sets into dashboard totals."""
        summary = cls(sets_distinct=len(owned), sets_wanted=len(wanted))
        for lego_set in owned:
            qty = max(lego_set.collection.qty_owned, 1)
            summary.sets_owned += qty
            summary.pieces_owned += (lego_set.pieces or 0) * qty
            summary.minifigs_owned += (lego_set.minifigs or 0) * qty
            price = lego_set.price(region)
            if price is None:
                summary.sets_missing_price += 1
            else:
                summary.value += price * qty
        summary.value = round(summary.value, 2)
        return summary
