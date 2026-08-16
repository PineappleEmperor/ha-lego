"""Tests for the Brickset payload parsers."""

from __future__ import annotations

from datetime import date

from custom_components.lego.models import CollectionSummary, LegoSet

from .conftest import OWNED_SETS, WANTED_SETS, make_set


def test_parses_a_full_record() -> None:
    """Every field the integration relies on survives parsing."""
    lego_set = LegoSet.from_api(OWNED_SETS[0])

    assert lego_set.set_id == 1
    assert lego_set.number == "10497-1"
    assert lego_set.name == "Galaxy Explorer"
    assert lego_set.pieces == 1254
    assert lego_set.minifigs == 4
    assert lego_set.collection.owned is True
    assert lego_set.collection.qty_owned == 2
    assert lego_set.price("UK") == 90.0
    assert lego_set.retirement_date("UK") == date(2099, 12, 31)
    assert lego_set.release_date("UK") == date(2024, 1, 1)
    assert lego_set.brickset_url == "https://brickset.com/sets/10497-1"


def test_number_is_combined_with_its_variant() -> None:
    """Brickset splits number and variant; everything else wants them joined."""
    lego_set = LegoSet.from_api(
        {"setID": 1, "number": "10497", "numberVariant": 1, "name": "Galaxy Explorer"}
    )

    assert lego_set.number == "10497-1"


def test_number_variant_other_than_one() -> None:
    """A re-release keeps its own variant rather than being forced to -1."""
    lego_set = LegoSet.from_api({"setID": 2, "number": "6876", "numberVariant": 2})

    assert lego_set.number == "6876-2"


def test_already_combined_number_is_left_alone() -> None:
    """A number that arrives combined is not given a second suffix."""
    lego_set = LegoSet.from_api({"setID": 3, "number": "10497-1", "numberVariant": 1})

    assert lego_set.number == "10497-1"


def test_number_without_a_variant() -> None:
    """A record with no variant field keeps the number as given."""
    lego_set = LegoSet.from_api({"setID": 4, "number": "10497"})

    assert lego_set.number == "10497"


def test_missing_fields_do_not_raise() -> None:
    """Sparse records parse to None rather than blowing up the coordinator."""
    lego_set = LegoSet.from_api({"setID": 9, "number": "1234-1", "name": "Sparse"})

    assert lego_set.pieces is None
    assert lego_set.minifigs is None
    assert lego_set.year is None
    assert lego_set.price("UK") is None
    assert lego_set.retirement_date("UK") is None
    assert lego_set.collection.owned is False


def test_junk_numeric_fields_are_ignored() -> None:
    """Empty strings and nulls in numeric fields become None, not exceptions."""
    lego_set = LegoSet.from_api(
        {
            "setID": 9,
            "number": "1234-1",
            "name": "Odd",
            "pieces": "",
            "minifigs": None,
            "rating": "not a number",
            "LEGOCom": {"UK": {"retailPrice": ""}},
        }
    )

    assert lego_set.pieces is None
    assert lego_set.minifigs is None
    assert lego_set.rating is None
    assert lego_set.price("UK") is None


def test_summary_totals() -> None:
    """Totals multiply by quantity and flag unpriced sets."""
    owned = [LegoSet.from_api(item) for item in OWNED_SETS]
    wanted = [LegoSet.from_api(item) for item in WANTED_SETS]

    summary = CollectionSummary.from_sets(owned, wanted, "UK")

    # 2 copies of 10497-1, 1 each of the others.
    assert summary.sets_owned == 4
    assert summary.sets_distinct == 3
    assert summary.pieces_owned == 1254 * 2 + 4514 + 100
    assert summary.minifigs_owned == 4 * 2 + 22 + 1
    assert summary.sets_wanted == 1
    assert summary.value == round(90.0 * 2 + 344.99, 2)
    # The 1990 set has no published RRP.
    assert summary.sets_missing_price == 1


def test_summary_counts_a_zero_quantity_set_once() -> None:
    """Brickset can mark a set owned with qtyOwned 0; that still counts as one."""
    owned = [LegoSet.from_api(make_set(1, "1-1", "Odd", owned=True, qty_owned=0))]

    summary = CollectionSummary.from_sets(owned, [], "UK")

    assert summary.sets_owned == 1
    assert summary.pieces_owned == 1000


def test_summary_of_an_empty_collection() -> None:
    """An empty collection produces zeroes, not errors."""
    summary = CollectionSummary.from_sets([], [], "UK")

    assert summary.sets_owned == 0
    assert summary.value == 0.0
    assert summary.sets_missing_price == 0


def test_dates_fall_back_to_the_set_wide_window() -> None:
    """A set still on sale carries no regional exit date, only a projected one."""
    # Shaped like a real getSets record: LEGOCom prices the set per region and
    # gives a launch date, while only the top level says when it leaves sale.
    record = make_set(
        50740,
        "10343-1",
        "Mini Orchid",
        first_available="2024-11-14T00:00:00Z",
        last_available=None,
        launch_date="2025-01-01T00:00:00Z",
        exit_date="2027-12-31T00:00:00Z",
    )
    lego_set = LegoSet.from_api(record)

    assert lego_set.retirement_date("UK") == date(2027, 12, 31)
    # The region knows when it arrived, so that wins over the set-wide launch.
    assert lego_set.release_date("UK") == date(2024, 11, 14)


def test_a_regional_exit_date_wins_over_the_set_wide_one() -> None:
    """Where a region publishes its own exit date, that is the accurate one."""
    lego_set = LegoSet.from_api(
        make_set(
            1,
            "10497-1",
            "Galaxy Explorer",
            last_available="2026-06-30T00:00:00Z",
            exit_date="2027-12-31T00:00:00Z",
        )
    )

    assert lego_set.retirement_date("UK") == date(2026, 6, 30)


def test_no_dates_anywhere_stays_none() -> None:
    """An old set with nothing published must not invent a date."""
    lego_set = LegoSet.from_api(
        make_set(3, "6876-1", "Alienator", first_available=None, last_available=None)
    )

    assert lego_set.retirement_date("UK") is None
    assert lego_set.release_date("UK") is None


def test_parses_the_whole_collection_block() -> None:
    """Brickset sends more than owned and wanted, and the extras are useful."""
    record = make_set(4, "10294-1", "Titanic", wanted=True, qty_owned=0, priority=3)
    status = LegoSet.from_api(record).collection

    assert status.wanted is True
    assert status.qty_wanted == 1
    assert status.wanted_priority == 3
    assert status.qty_owned_new == 0
    assert status.qty_owned_used == 0
