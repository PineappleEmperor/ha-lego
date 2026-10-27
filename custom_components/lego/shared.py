"""Whole-year reads shared between Brickset accounts."""

# Two accounts following releases across all themes read the same years, each on
# its own key. A year read by one is good for the others until it is as old as a
# poll interval, so whichever polls first pays and the rest spend nothing. A read
# never serves the account that made it, whose own polls are what keep it fresh.
# The sets are public; only each set's collection block is the reading account's
# own, so it is blanked here and every account lays its own collection back over
# the copies.

from dataclasses import dataclass, replace
from datetime import datetime, timedelta

from homeassistant.util import dt as dt_util
from homeassistant.util.hass_dict import HassKey

from .const import DOMAIN, RELEASES_INTERVAL_HOURS
from .models import CollectionStatus, LegoSet

SHARED_READ_AGE = timedelta(hours=RELEASES_INTERVAL_HOURS)


@dataclass(frozen=True, slots=True)
class YearRead:
    """One whole year as an account last read it."""

    reader: str
    fetched_at: datetime
    pages: int
    sets: tuple[LegoSet, ...]

    def copies(self, own: dict[str, LegoSet]) -> list[LegoSet]:
        """Return this account's own copies, carrying its own collection status."""
        # Each copy gets a status object of its own, since a write to the collection
        # updates the status in place.
        return [
            replace(
                lego_set,
                collection=(
                    own[lego_set.number].collection
                    if lego_set.number in own
                    else CollectionStatus()
                ),
            )
            for lego_set in self.sets
        ]


class YearReads:
    """The latest read of each whole year, by any account."""

    def __init__(self) -> None:
        """Start with nothing read."""
        self._reads: dict[int, YearRead] = {}

    def fresh(self, year: int, reader: str) -> YearRead | None:
        """Return another account's read of the year, if recent enough to use."""
        read = self._reads.get(year)
        if (
            read is None
            or read.reader == reader
            or dt_util.utcnow() - read.fetched_at >= SHARED_READ_AGE
        ):
            return None
        return read

    def remember(self, year: int, reader: str, pages: int, sets: list[LegoSet]) -> None:
        """Keep a year just read, without the reading account's collection."""
        self._reads[year] = YearRead(
            reader=reader,
            fetched_at=dt_util.utcnow(),
            pages=pages,
            sets=tuple(
                replace(lego_set, collection=CollectionStatus()) for lego_set in sets
            ),
        )


YEAR_READS: HassKey[YearReads] = HassKey(f"{DOMAIN}_year_reads")
