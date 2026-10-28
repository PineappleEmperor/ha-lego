"""Tests for the local set catalogue."""

from datetime import timedelta
import gzip

import aiohttp
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.lego.catalogue import _parse
from custom_components.lego.const import (
    CONF_CATALOGUE,
    CONF_CATALOGUE_INTERVAL,
    CONF_CATALOGUE_RICH,
)

from .conftest import SETS_CSV_URL, BricksetServer, setup_integration


def _csv_requests(aioclient_mock: AiohttpClientMocker) -> int:
    """Count how many times the Rebrickable set list has been fetched."""
    return sum(1 for call in aioclient_mock.mock_calls if str(call[1]) == SETS_CSV_URL)


async def _seed(hass: HomeAssistant, entry: MockConfigEntry):
    """Set the entry up and wait for the background seed to finish."""
    await setup_integration(hass, entry)
    await hass.async_block_till_done(wait_background_tasks=True)
    return entry.runtime_data.catalogue


@pytest.mark.usefixtures("brickset")
async def test_seed_downloads_and_filters_gear(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Keyrings are numbered like sets, so the index drops the Gear theme."""
    catalogue = await _seed(hass, mock_config_entry)

    assert catalogue is not None
    assert catalogue.knows("10497-1")
    assert catalogue.knows("42200-1")
    assert not catalogue.knows("99999-1")
    assert catalogue.size == 2


async def test_seed_costs_no_brickset_calls(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The catalogue comes from a public CSV, not the billed API."""
    before = len(brickset.get_sets_calls)
    await _seed(hass, mock_config_entry)

    billed = [c for c in brickset.get_sets_calls[before:] if "setNumber" not in c]
    assert len(billed) == 3  # owned, wanted, one theme feed


@pytest.mark.usefixtures("brickset")
async def test_entry_carries_name_and_theme(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """A rich index answers with enough to render a search result."""
    catalogue = await _seed(hass, mock_config_entry)

    listed = catalogue.entry("10497-1")
    assert listed is not None
    assert listed.name == "Galaxy Explorer"
    assert listed.year == 2022
    assert listed.theme == "Icons"


@pytest.mark.usefixtures("brickset")
async def test_search_matches_number_and_name(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Search covers both what people type: a number or a name."""
    catalogue = await _seed(hass, mock_config_entry)

    assert [s.number for s in catalogue.search("10497")] == ["10497-1"]
    assert [s.number for s in catalogue.search("galaxy")] == ["10497-1"]
    assert catalogue.search("") == []


@pytest.mark.usefixtures("brickset")
async def test_brickset_ids_are_harvested_from_polls(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Rebrickable has no Brickset ID, so it is learned from records already fetched."""
    catalogue = await _seed(hass, mock_config_entry)

    assert catalogue.set_id("10497-1") == 1
    assert catalogue.set_id("10294-1") == 4
    assert catalogue.set_id("00000-1") is None


@pytest.mark.usefixtures("brickset")
async def test_slim_index_holds_numbers_only(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Turning names off keeps validation working and drops name search."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_CATALOGUE_RICH: False},
    )
    catalogue = await _seed(hass, mock_config_entry)

    assert catalogue.knows("10497-1")
    assert catalogue.entry("10497-1").name == ""
    assert catalogue.search("galaxy") == []
    assert [s.number for s in catalogue.search("10497")] == ["10497-1"]


@pytest.mark.usefixtures("brickset")
async def test_catalogue_can_be_turned_off(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Opting out leaves the integration working without an index."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_CATALOGUE: False},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)

    assert mock_config_entry.runtime_data.catalogue is None


async def test_a_download_failure_is_not_fatal(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Rebrickable being unreachable leaves the integration on the billed path."""
    aioclient_mock.get(SETS_CSV_URL, exc=aiohttp.ClientError("boom"))
    BricksetServer(aioclient_mock)

    catalogue = await _seed(hass, mock_config_entry)

    assert catalogue is not None
    assert not catalogue.loaded
    assert mock_config_entry.state is ConfigEntryState.LOADED


@pytest.mark.usefixtures("brickset")
async def test_refresh_is_skipped_while_fresh(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A monthly index does not re-download on every restart, or every week."""
    catalogue = await _seed(hass, mock_config_entry)
    assert catalogue.stale is False

    freezer.tick(timedelta(days=8))
    assert catalogue.stale is False

    freezer.tick(timedelta(days=23))
    assert catalogue.stale is True


@pytest.mark.usefixtures("brickset")
async def test_the_index_refreshes_without_a_restart(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """An interval in days needs a tick; setup alone would only refresh on restart."""
    catalogue = await _seed(hass, mock_config_entry)
    downloads = _csv_requests(aioclient_mock)

    freezer.tick(timedelta(days=31))
    async_fire_time_changed(hass)
    await hass.async_block_till_done(wait_background_tasks=True)

    assert _csv_requests(aioclient_mock) > downloads
    assert catalogue.stale is False


@pytest.mark.usefixtures("brickset")
async def test_refresh_interval_is_configurable(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A shorter interval makes the index stale sooner than the weekly default."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_CATALOGUE_INTERVAL: 2},
    )
    catalogue = await _seed(hass, mock_config_entry)

    freezer.tick(timedelta(days=1))
    assert catalogue.stale is False

    freezer.tick(timedelta(days=1))
    assert catalogue.stale is True


PARTS_THEMES_CSV = (
    "id,name,parent_id\n"
    "1,System,\n2,Supplemental,1\n3,Bulk Bricks,\n4,Racers,\n5,Promotional,\n"
)
PARTS_SETS_CSV = (
    "set_num,name,year,theme_id,num_parts,img_url\n"
    "10003-1,1 x 2 Sand Red Bricks,2001,3,100,x\n"
    "6129-1,Red Bricks,1990,2,40,x\n"
    "8650-1,Red Racer,2005,4,30,x\n"
    "8195-1,Red Turbo Racer,2010,4,300,x\n"
    "REDSOX-1,Red Sox Minifigure,2012,5,40,x\n"
)


@pytest.mark.usefixtures("brickset")
async def test_parts_packs_answer_to_their_number_only(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """A colour finds the models, newest first; a pack's number still finds it."""
    catalogue = await _seed(hass, mock_config_entry)
    catalogue._sets = _parse(
        gzip.compress(PARTS_SETS_CSV.encode()),
        gzip.compress(PARTS_THEMES_CSV.encode()),
        rich=True,
    )

    # Supplemental sits under System, so the whole theme chain is checked.
    assert catalogue.entry("6129-1").parts is True
    assert catalogue.entry("10003-1").parts is True
    assert catalogue.entry("8650-1").parts is False

    # "red" is a word, so REDSOX-1 is found by its name, among the others by year.
    assert [s.number for s in catalogue.search("red")] == [
        "REDSOX-1",
        "8195-1",
        "8650-1",
    ]
    assert [s.number for s in catalogue.search("10003")] == ["10003-1"]
    assert [s.number for s in catalogue.search("1000")] == ["10003-1"]
    assert [s.number for s in catalogue.search("redsox")] == ["REDSOX-1"]


@pytest.mark.usefixtures("brickset")
async def test_an_index_stored_before_parts_packs_is_fetched_again(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The old three-field rows have no parts flag, so the next check refreshes."""
    catalogue = await _seed(hass, mock_config_entry)
    catalogue._sets = {"6129-1": ["Red Bricks", 1990, "System"]}
    await catalogue.async_save()

    await catalogue.async_load(rich=True)

    assert catalogue.stale is True
    assert catalogue.entry("6129-1").name == "Red Bricks"
