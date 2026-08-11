"""Tests for the local set catalogue."""

from __future__ import annotations

from datetime import timedelta

import aiohttp
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

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
    await hass.async_block_till_done()
    return entry.runtime_data.catalogue


async def test_seed_downloads_and_filters_gear(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
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


async def test_entry_carries_name_and_theme(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A rich index answers with enough to render a search result."""
    catalogue = await _seed(hass, mock_config_entry)

    listed = catalogue.entry("10497-1")
    assert listed is not None
    assert listed.name == "Galaxy Explorer"
    assert listed.year == 2022
    assert listed.theme == "Icons"


async def test_search_matches_number_and_name(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Search covers both what people type: a number or a name."""
    catalogue = await _seed(hass, mock_config_entry)

    assert [s.number for s in catalogue.search("10497")] == ["10497-1"]
    assert [s.number for s in catalogue.search("galaxy")] == ["10497-1"]
    assert catalogue.search("") == []


async def test_brickset_ids_are_harvested_from_polls(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Rebrickable has no Brickset ID, so it is learned from records already fetched."""
    catalogue = await _seed(hass, mock_config_entry)

    assert catalogue.set_id("10497-1") == 1
    assert catalogue.set_id("10294-1") == 4
    assert catalogue.set_id("00000-1") is None


async def test_slim_index_holds_numbers_only(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
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


async def test_catalogue_can_be_turned_off(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Opting out leaves the integration working without an index."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        options={**mock_config_entry.options, CONF_CATALOGUE: False},
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

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


async def test_refresh_is_skipped_while_fresh(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """A weekly index does not re-download on every restart."""
    catalogue = await _seed(hass, mock_config_entry)
    assert catalogue.stale is False

    freezer.tick(timedelta(days=8))
    assert catalogue.stale is True


async def test_the_index_refreshes_without_a_restart(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    freezer: FrozenDateTimeFactory,
) -> None:
    """An interval in days needs a tick; setup alone would only refresh on restart."""
    catalogue = await _seed(hass, mock_config_entry)
    downloads = _csv_requests(aioclient_mock)

    freezer.tick(timedelta(days=8))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert _csv_requests(aioclient_mock) > downloads
    assert catalogue.stale is False


async def test_refresh_interval_is_configurable(
    hass: HomeAssistant,
    brickset: BricksetServer,
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
