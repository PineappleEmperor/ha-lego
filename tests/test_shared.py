"""Tests for whole-year reads shared between Brickset accounts."""

from datetime import date
from typing import Any

from homeassistant.const import CONF_API_KEY, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lego.const import (
    CONF_RELEASES,
    CONF_THEMES,
    CONF_USER_HASH,
    DOMAIN,
)
from custom_components.lego.models import LegoSet
from custom_components.lego.shared import YearRead

from .conftest import API_KEY, USER_HASH, BricksetServer, make_set, setup_integration


async def _account(hass: HomeAssistant, name: str, **options: Any) -> MockConfigEntry:
    """Set up an account with these feed options, and let its first reads finish."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=name,
        unique_id=name,
        version=2,
        minor_version=2,
        data={CONF_API_KEY: API_KEY, CONF_USERNAME: name, CONF_USER_HASH: USER_HASH},
        options={CONF_REGION: "UK", CONF_THEMES: [], **options},
    )
    await setup_integration(hass, entry)
    await hass.async_block_till_done(wait_background_tasks=True)
    return entry


def _feed_calls(brickset: BricksetServer) -> list[dict[str, Any]]:
    """Return the billed calls that read a year or a theme, not a collection."""
    return [call for call in brickset.get_sets_calls if "year" in call]


@pytest.fixture
def this_year(brickset: BricksetServer) -> None:
    """File a Technic set under this year, owned by whoever reads it."""
    brickset.year_sets[:] = [
        make_set(
            9,
            "42301-1",
            "Shared Technic",
            theme="Technic",
            year=dt_util.now().year,
            owned=True,
            qty_owned=1,
        )
    ]


@pytest.mark.usefixtures("this_year")
async def test_a_second_account_reads_no_year_the_first_just_read(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
    """Whichever account polls first pays; the other spends nothing on those years."""
    first = await _account(hass, "first", **{CONF_RELEASES: True})
    paid = len(_feed_calls(brickset))
    assert paid > 0

    second = await _account(hass, "second", **{CONF_RELEASES: True})

    assert len(_feed_calls(brickset)) == paid
    releases = second.runtime_data.feeds.data.releases
    assert [item.number for item in releases or []] == ["42301-1"]
    # The reader owned the set; the second account's copy carries its own status.
    assert first.runtime_data.feeds.data.releases[0].collection.owned is True
    assert releases[0].collection.owned is False
    # Only the status is the second account's own; the record itself is shared.
    copy = releases[0]
    assert (copy.name, copy.theme) == ("Shared Technic", "Technic")
    assert copy.price("UK") == 99.99
    assert copy.retirement_date("UK") == date(2099, 12, 31)
    assert copy.thumbnail_url == "https://images.brickset.com/sets/small/42301-1.jpg"


@pytest.mark.usefixtures("this_year")
async def test_a_theme_only_account_cuts_from_a_shared_year(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
    """Followed themes come free from another account's read of the whole year."""
    await _account(hass, "first", **{CONF_RELEASES: True})
    before = len(_feed_calls(brickset))

    second = await _account(hass, "second", **{CONF_THEMES: ["Technic"]})

    this_year_calls = [
        call
        for call in _feed_calls(brickset)[before:]
        if call["year"] == dt_util.now().year
    ]
    assert this_year_calls == []
    technic = second.runtime_data.feeds.data.themes["Technic"]
    assert [item.number for item in technic] == ["42301-1"]


def test_copies_carry_the_accounts_own_status() -> None:
    """Each copy has a status of its own, taken from the account's collection."""
    owned = LegoSet.from_api(make_set(1, "10497-1", "Owned", owned=True))
    other = LegoSet.from_api(make_set(2, "10498-1", "Not owned"))
    read = YearRead(
        reader="first", fetched_at=dt_util.utcnow(), pages=1, sets=(owned, other)
    )

    copies = read.copies({"10497-1": owned})
    again = read.copies({})

    assert [item.collection.owned for item in copies] == [True, False]
    # A write to one account's copy must not reach another account's.
    assert copies[1].collection is not again[1].collection
