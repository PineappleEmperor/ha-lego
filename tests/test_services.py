"""Tests for the LEGO actions."""

from __future__ import annotations

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.lego.const import (
    CONF_CATALOGUE,
    DOMAIN,
    SERVICE_REFRESH_CATALOGUE,
    SERVICE_REFRESH_COLLECTION,
    SERVICE_SEARCH_SETS,
    SERVICE_SET_COLLECTION,
)

from .conftest import SETS_CSV_URL, BricksetServer, make_set, setup_integration


async def test_refresh_catalogue(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A manual refresh re-downloads the index without spending a Brickset call."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()
    before = len(brickset.get_sets_calls)

    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_REFRESH_CATALOGUE,
        {"config_entry_id": mock_config_entry.entry_id},
        blocking=True,
        return_response=True,
    )

    today = dt_util.now().date().isoformat()
    assert response == {"updated": True, "sets": 2, "fetched": today}
    assert len(brickset.get_sets_calls) == before


async def test_refresh_catalogue_ignores_the_interval(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Asking by hand refreshes a fresh index, which is the point of asking."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()
    assert mock_config_entry.runtime_data.catalogue.stale is False

    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_REFRESH_CATALOGUE,
        {"config_entry_id": mock_config_entry.entry_id},
        blocking=True,
        return_response=True,
    )

    assert response["updated"] is True


async def test_refresh_catalogue_needs_the_index_enabled(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Refreshing an index the user turned off is a validation error, not a crash."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry, options={**mock_config_entry.options, CONF_CATALOGUE: False}
    )
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_REFRESH_CATALOGUE,
            {"config_entry_id": mock_config_entry.entry_id},
            blocking=True,
        )

    assert err.value.translation_key == "catalogue_disabled"


async def test_refresh_catalogue_reports_a_failed_download(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An unreachable CDN with nothing cached is an error the user can act on."""
    aioclient_mock.get(SETS_CSV_URL, exc=aiohttp.ClientError("boom"))
    BricksetServer(aioclient_mock)
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()

    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_REFRESH_CATALOGUE,
            {"config_entry_id": mock_config_entry.entry_id},
            blocking=True,
        )

    assert err.value.translation_key == "catalogue_unavailable"


def _lookups(brickset: BricksetServer, since: int) -> list[str]:
    """Return the set numbers looked up by name since a given call count."""
    return [
        call["setNumber"]
        for call in brickset.get_sets_calls[since:]
        if "setNumber" in call
    ]


async def test_set_collection(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Marking a set owned reaches Brickset with the right set ID."""
    await setup_integration(hass, mock_config_entry)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "config_entry_id": mock_config_entry.entry_id,
            "set_number": "10497-1",
            "owned": True,
            "qty_owned": 3,
            "rating": 5,
        },
        blocking=True,
    )

    assert brickset.set_collection_calls == [
        {"setID": "1", "params": {"own": 1, "qtyOwned": 3, "rating": 5}}
    ]


async def test_set_collection_reuses_a_harvested_id(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A set seen in a theme feed is written without spending another call."""
    await setup_integration(hass, mock_config_entry)
    before = len(brickset.get_sets_calls)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "config_entry_id": mock_config_entry.entry_id,
            "set_number": "42200-1",
            "wanted": True,
        },
        blocking=True,
    )

    assert brickset.set_collection_calls[0]["setID"] == "5"
    assert _lookups(brickset, before) == []


async def test_set_collection_looks_up_an_unseen_set(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A set never returned by a poll costs one lookup to resolve."""
    brickset.theme_sets.append(make_set(7, "21034-1", "London", theme="Architecture"))
    await setup_integration(hass, mock_config_entry)
    before = len(brickset.get_sets_calls)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "config_entry_id": mock_config_entry.entry_id,
            "set_number": "21034-1",
            "wanted": True,
        },
        blocking=True,
    )

    assert brickset.set_collection_calls[0]["setID"] == "7"
    assert _lookups(brickset, before) == ["21034-1"]


async def test_set_collection_unknown_set_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """An unknown set number is a validation error, not a crash."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "config_entry_id": mock_config_entry.entry_id,
                "set_number": "00000-1",
                "owned": True,
            },
            blocking=True,
        )

    assert err.value.translation_key == "set_not_found"


async def test_set_collection_expired_token_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A rejected token surfaces a translated error telling the user to reconnect."""
    await setup_integration(hass, mock_config_entry)
    brickset.hash_valid = False

    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "config_entry_id": mock_config_entry.entry_id,
                "set_number": "10497-1",
                "owned": True,
            },
            blocking=True,
        )

    assert err.value.translation_key == "auth_expired"


async def test_set_collection_folds_the_change_into_the_cache(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A write must not spend billed calls re-learning what it just sent."""
    await setup_integration(hass, mock_config_entry)
    billed = len(brickset.get_sets_calls)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "config_entry_id": mock_config_entry.entry_id,
            "set_number": "10294-1",
            "owned": True,
            "qty_owned": 1,
        },
        blocking=True,
    )
    await hass.async_block_till_done(wait_background_tasks=True)

    assert len(brickset.get_sets_calls) == billed
    data = mock_config_entry.runtime_data.collection.data
    assert data is not None
    owned = {lego_set.number for lego_set in data.owned}
    assert "10294-1" in owned
    assert data.summary.sets_distinct == len(owned)


async def test_set_collection_rejection_raises_a_repair_issue(
    hass: HomeAssistant,
    brickset: BricksetServer,
    mock_config_entry: MockConfigEntry,
    issue_registry: ir.IssueRegistry,
) -> None:
    """A rejected write is visible even when nobody is watching the action fail."""
    await setup_integration(hass, mock_config_entry)
    brickset.set_collection_error = "Set not found"
    issue_id = f"collection_write_failed_{mock_config_entry.entry_id}"

    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "config_entry_id": mock_config_entry.entry_id,
                "set_number": "10497-1",
                "owned": True,
            },
            blocking=True,
        )

    issue = issue_registry.async_get_issue(DOMAIN, issue_id)
    assert issue is not None
    assert issue.translation_key == "collection_write_failed"

    brickset.set_collection_error = None
    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "config_entry_id": mock_config_entry.entry_id,
            "set_number": "10497-1",
            "owned": True,
        },
        blocking=True,
    )

    assert issue_registry.async_get_issue(DOMAIN, issue_id) is None


async def test_unknown_entry_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Targeting a non-existent entry is a validation error."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {"config_entry_id": "does-not-exist", "set_number": "10497-1"},
            blocking=True,
        )

    assert err.value.translation_key == "entry_not_found"


async def test_search_sets_returns_matches(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The search action returns a response payload."""
    await setup_integration(hass, mock_config_entry)

    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_SEARCH_SETS,
        {"config_entry_id": mock_config_entry.entry_id, "query": "castle"},
        blocking=True,
        return_response=True,
    )

    assert [item["set_number"] for item in response["sets"]] == ["10305-1"]
    assert response["sets"][0]["name"] == "Lion Knights' Castle"


async def test_search_without_criteria_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """An unbounded search is refused rather than pulling the whole catalogue."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SEARCH_SETS,
            {"config_entry_id": mock_config_entry.entry_id},
            blocking=True,
            return_response=True,
        )

    assert err.value.translation_key == "search_needs_criteria"


async def test_refresh_collection_polls_now(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A manual refresh polls immediately and reports what it spent."""
    await setup_integration(hass, mock_config_entry)
    billed = len(brickset.get_sets_calls)

    result = await hass.services.async_call(
        DOMAIN,
        SERVICE_REFRESH_COLLECTION,
        {"config_entry_id": mock_config_entry.entry_id},
        blocking=True,
        return_response=True,
    )

    assert len(brickset.get_sets_calls) > billed
    assert result["cost"] == 2
    assert result["updated"] is True


async def test_refresh_collection_refuses_when_the_budget_is_spent(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The manual path must not be the way a user blows through the daily limit."""
    await setup_integration(hass, mock_config_entry)
    quota = mock_config_entry.runtime_data.collection.quota
    quota.record(quota.remaining)
    billed = len(brickset.get_sets_calls)

    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_REFRESH_COLLECTION,
            {"config_entry_id": mock_config_entry.entry_id},
            blocking=True,
        )

    assert err.value.translation_key == "quota_spent"
    assert len(brickset.get_sets_calls) == billed
