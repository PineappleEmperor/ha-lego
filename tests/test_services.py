"""Tests for the LEGO actions."""

from datetime import date

import aiohttp
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import (
    HomeAssistantError,
    ServiceValidationError,
    Unauthorized,
)
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
from custom_components.lego.coordinator import FeedsData

from .conftest import (
    SETS_CSV_URL,
    BricksetServer,
    lego_device_id,
    make_set,
    setup_integration,
)


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
        {"device_id": lego_device_id(hass, mock_config_entry)},
        blocking=True,
        return_response=True,
    )

    today = dt_util.now().date().isoformat()
    assert response == {"updated": True, "sets": 2, "fetched": today}
    assert len(brickset.get_sets_calls) == before


@pytest.mark.usefixtures("brickset")
async def test_refresh_catalogue_ignores_the_interval(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Asking by hand refreshes a fresh index, which is the point of asking."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()
    assert mock_config_entry.runtime_data.catalogue.stale is False

    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_REFRESH_CATALOGUE,
        {"device_id": lego_device_id(hass, mock_config_entry)},
        blocking=True,
        return_response=True,
    )

    assert response["updated"] is True


@pytest.mark.usefixtures("brickset")
async def test_refresh_catalogue_needs_the_index_enabled(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
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
            {"device_id": lego_device_id(hass, mock_config_entry)},
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
            {"device_id": lego_device_id(hass, mock_config_entry)},
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
            "device_id": lego_device_id(hass, mock_config_entry),
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
    kept = mock_config_entry.runtime_data.collection.data.all_sets["10497-1"]
    assert (kept.collection.qty_owned, kept.collection.rating) == (3, 5)
    assert mock_config_entry.runtime_data.collection.data.summary.sets_owned == 5


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
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "42200-1",
            "wanted": True,
        },
        blocking=True,
    )

    assert brickset.set_collection_calls[0]["setID"] == "5"
    assert _lookups(brickset, before) == []
    # The feed's own record is what the collection keeps, picture and all.
    kept = mock_config_entry.runtime_data.collection.data.all_sets["42200-1"]
    assert kept.theme == "Technic"
    assert kept.image_url
    assert kept.collection.wanted is True


async def test_set_collection_fills_a_set_known_only_to_the_index(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A set seen once but in no feed now keeps what the index holds, free."""
    await setup_integration(hass, mock_config_entry)
    mock_config_entry.runtime_data.feeds.async_set_updated_data(FeedsData())
    before = len(brickset.get_sets_calls)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "42200-1",
            "owned": True,
        },
        blocking=True,
    )

    assert _lookups(brickset, before) == []
    kept = mock_config_entry.runtime_data.collection.data.all_sets["42200-1"]
    assert (kept.name, kept.theme, kept.year) == ("New Technic Thing", "Technic", 2026)
    assert kept.thumbnail_url == (
        "https://cdn.rebrickable.com/media/thumbs/sets/42200-1.jpg/230x230p.jpg"
    )


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
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "21034-1",
            "wanted": True,
        },
        blocking=True,
    )

    assert brickset.set_collection_calls[0]["setID"] == "7"
    assert _lookups(brickset, before) == ["21034-1"]
    # The lookup's own record is what the wishlist keeps, picture and dates included.
    data = mock_config_entry.runtime_data.collection.data
    kept = data.wanted_by_number["21034-1"]
    assert (kept.name, kept.theme) == ("London", "Architecture")
    assert kept.thumbnail_url == "https://images.brickset.com/sets/small/21034-1.jpg"
    assert kept.retirement_date("UK") == date(2099, 12, 31)
    assert kept.collection.wanted is True


@pytest.mark.usefixtures("brickset")
async def test_set_collection_unknown_set_raises(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """An unknown set number is a validation error, not a crash."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "device_id": lego_device_id(hass, mock_config_entry),
                "set_number": "00000-1",
                "owned": True,
            },
            blocking=True,
        )

    assert err.value.translation_key == "set_not_found"


async def test_set_collection_with_nothing_to_change_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A call naming a set but no change is refused before reaching Brickset."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "device_id": lego_device_id(hass, mock_config_entry),
                "set_number": "10497-1",
            },
            blocking=True,
        )

    assert err.value.translation_key == "no_changes"
    assert brickset.set_collection_calls == []


async def test_set_collection_lookup_failure_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Brickset failing the billed lookup of an unseen set is an API error."""
    await setup_integration(hass, mock_config_entry)
    brickset.get_sets_error = "Service temporarily unavailable"

    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "device_id": lego_device_id(hass, mock_config_entry),
                "set_number": "77777-1",
                "owned": True,
            },
            blocking=True,
        )

    assert err.value.translation_key == "api_error"


async def test_search_failure_raises(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Brickset failing a search is an API error, not an empty answer."""
    await setup_integration(hass, mock_config_entry)
    brickset.get_sets_error = "Service temporarily unavailable"

    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SEARCH_SETS,
            {"device_id": lego_device_id(hass, mock_config_entry), "query": "castle"},
            blocking=True,
            return_response=True,
        )

    assert err.value.translation_key == "api_error"


@pytest.mark.usefixtures("brickset")
async def test_a_deleted_user_cannot_act(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """A call carrying a user Home Assistant no longer knows is refused."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {
                "device_id": lego_device_id(hass, mock_config_entry),
                "set_number": "10497-1",
                "owned": True,
            },
            blocking=True,
            context=Context(user_id="deleted-user"),
        )


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
                "device_id": lego_device_id(hass, mock_config_entry),
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
            "device_id": lego_device_id(hass, mock_config_entry),
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
    owned = {lego_set.number: lego_set for lego_set in data.owned}
    assert owned["10294-1"].collection.qty_owned == 1
    assert data.summary.sets_distinct == len(owned)
    # Owning and wanting are separate on Brickset, so the wish stands until unticked.
    assert "10294-1" in data.wanted_by_number


async def test_unticking_owned_removes_the_set(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The panel's toggle in the off direction: sent as own=0, and dropped locally."""
    await setup_integration(hass, mock_config_entry)
    assert hass.states.get("sensor.brickset_brickfan_sets_owned").state == "4"

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "10305-1",
            "owned": False,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    assert brickset.set_collection_calls == [{"setID": "2", "params": {"own": 0}}]
    data = mock_config_entry.runtime_data.collection.data
    assert "10305-1" not in {lego_set.number for lego_set in data.owned}
    assert hass.states.get("sensor.brickset_brickfan_sets_owned").state == "3"


async def test_unticking_wanted_removes_the_set(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Taking a set off the wishlist is sent as want=0, and dropped locally."""
    await setup_integration(hass, mock_config_entry)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "10294-1",
            "wanted": False,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    assert brickset.set_collection_calls == [{"setID": "4", "params": {"want": 0}}]
    assert mock_config_entry.runtime_data.collection.data.wanted == []
    assert hass.states.get("sensor.brickset_brickfan_sets_wanted").state == "0"


@pytest.mark.usefixtures("brickset")
async def test_owning_a_wanted_set_keeps_its_full_record(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The cached record is reused, so its pieces and price count at once."""
    await setup_integration(hass, mock_config_entry)
    collection = mock_config_entry.runtime_data.collection
    wanted = collection.data.wanted_by_number["10294-1"]
    pieces_before = collection.data.summary.pieces_owned
    value_before = collection.data.summary.value

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        {
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "10294-1",
            "owned": True,
            "qty_owned": 1,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    owned = {item.number: item for item in collection.data.owned}
    kept = owned["10294-1"]
    assert kept.pieces == wanted.pieces
    assert collection.data.summary.pieces_owned == pieces_before + wanted.pieces
    assert kept.thumbnail_url == wanted.thumbnail_url is not None
    assert kept.price("UK") == wanted.price("UK") is not None
    assert kept.retirement_date("UK") == wanted.retirement_date("UK") is not None
    assert collection.data.summary.value == pytest.approx(
        value_before + wanted.price("UK")
    )


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
                "device_id": lego_device_id(hass, mock_config_entry),
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
            "device_id": lego_device_id(hass, mock_config_entry),
            "set_number": "10497-1",
            "owned": True,
        },
        blocking=True,
    )

    assert issue_registry.async_get_issue(DOMAIN, issue_id) is None


@pytest.mark.usefixtures("brickset")
async def test_unknown_device_raises(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Targeting a device that is not a Brickset device is a validation error."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {"device_id": "does-not-exist", "set_number": "10497-1"},
            blocking=True,
        )

    assert err.value.translation_key == "device_not_found"


@pytest.mark.usefixtures("brickset")
async def test_search_sets_returns_matches(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The search action returns a response payload."""
    await setup_integration(hass, mock_config_entry)

    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_SEARCH_SETS,
        {"device_id": lego_device_id(hass, mock_config_entry), "query": "castle"},
        blocking=True,
        return_response=True,
    )

    assert [item["set_number"] for item in response["sets"]] == ["10305-1"]
    [found] = response["sets"]
    assert found["name"] == "Lion Knights' Castle"
    assert (found["theme"], found["year"]) == ("Icons", 2024)
    assert (found["pieces"], found["minifigs"]) == (4514, 22)
    assert (found["owned"], found["qty_owned"], found["wanted"]) == (True, 1, False)
    assert found["image_url"] == "https://images.brickset.com/sets/images/10305-1.jpg"
    assert found["brickset_url"] == "https://brickset.com/sets/10305-1"


@pytest.mark.usefixtures("brickset")
async def test_search_without_criteria_raises(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """An unbounded search is refused rather than pulling the whole catalogue."""
    await setup_integration(hass, mock_config_entry)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SEARCH_SETS,
            {"device_id": lego_device_id(hass, mock_config_entry)},
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
        {"device_id": lego_device_id(hass, mock_config_entry)},
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
            {"device_id": lego_device_id(hass, mock_config_entry)},
            blocking=True,
        )

    assert err.value.translation_key == "quota_spent"
    assert len(brickset.get_sets_calls) == billed


@pytest.mark.usefixtures("brickset")
async def test_unloaded_account_raises(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The device of an unloaded account is refused with a reason."""
    await setup_integration(hass, mock_config_entry)
    device_id = lego_device_id(hass, mock_config_entry)
    await hass.config_entries.async_unload(mock_config_entry.entry_id)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            {"device_id": device_id, "set_number": "10497-1"},
            blocking=True,
        )

    assert err.value.translation_key == "entry_not_loaded"
