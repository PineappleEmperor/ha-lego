"""Tests for the LEGO config, reauth, reconfigure and options flows."""

from datetime import date, timedelta

import aiohttp
from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY, CONF_PASSWORD, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.lego.config_flow import estimated_daily_calls
from custom_components.lego.const import (
    CONF_DAILY_CALL_BUDGET,
    CONF_RELEASES,
    CONF_SHARED,
    CONF_THEMES,
    CONF_USER_HASH,
    CONF_USERS,
    DOMAIN,
)

from .conftest import API_KEY, USER_HASH, USERNAME, BricksetServer, setup_integration

USER_INPUT = {
    CONF_API_KEY: API_KEY,
    CONF_USERNAME: USERNAME,
    CONF_PASSWORD: "hunter2",
}


@pytest.mark.usefixtures("brickset")
async def test_user_flow(hass: HomeAssistant) -> None:
    """A valid key and login create an entry that stores only the token."""
    hass.config.country = "GB"
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["step_id"] == "region"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_REGION: "UK"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == USERNAME
    assert result["data"] == {
        CONF_API_KEY: API_KEY,
        CONF_USERNAME: USERNAME,
        CONF_USER_HASH: USER_HASH,
    }
    assert CONF_PASSWORD not in result["data"]
    assert result["options"][CONF_REGION] == "UK"
    # New entries start with the all-themes release rows switched on.
    assert result["options"][CONF_RELEASES] is True


@pytest.mark.usefixtures("brickset")
async def test_user_flow_asks_for_region_when_country_is_unmapped(
    hass: HomeAssistant,
) -> None:
    """LEGO.com prices four markets, so any other country has to be asked."""
    hass.config.country = "FR"

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "region"
    assert result["description_placeholders"]["country"] == "FR"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_REGION: "DE"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["options"][CONF_REGION] == "DE"


@pytest.mark.usefixtures("brickset")
async def test_region_step_is_seeded_from_the_country(hass: HomeAssistant) -> None:
    """A mapped country preselects its market, leaving it changeable."""
    hass.config.country = "CA"

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["step_id"] == "region"
    assert result["data_schema"]({})[CONF_REGION] == "CA"


@pytest.mark.usefixtures("brickset")
async def test_region_can_be_overridden_at_setup(hass: HomeAssistant) -> None:
    """Buying from another country's store is common, so the seed is a default."""
    hass.config.country = "GB"

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_REGION: "US"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["options"][CONF_REGION] == "US"


@pytest.mark.parametrize(
    ("key_valid", "credentials_valid", "expected"),
    [
        (False, True, "invalid_api_key"),
        (True, False, "invalid_auth"),
    ],
)
async def test_user_flow_errors(
    hass: HomeAssistant,
    brickset: BricksetServer,
    key_valid: bool,
    credentials_valid: bool,
    expected: str,
) -> None:
    """Rejected credentials show an error and let the user retry."""
    hass.config.country = "GB"
    brickset.key_valid = key_valid
    brickset.credentials_valid = credentials_valid

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": expected}

    # Recovering in the same flow produces an entry.
    brickset.key_valid = True
    brickset.credentials_valid = True
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )
    assert result["step_id"] == "region"


@pytest.mark.usefixtures("brickset")
async def test_user_flow_cannot_connect(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker
) -> None:
    """A transport failure maps to cannot_connect."""
    aioclient_mock.clear_requests()
    aioclient_mock.post(
        "https://brickset.com/api/v3.asmx/checkKey",
        exc=aiohttp.ClientError("boom"),
    )

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["errors"] == {"base": "cannot_connect"}


@pytest.mark.usefixtures("brickset")
async def test_user_flow_unexpected_error(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker
) -> None:
    """An error Brickset does not classify maps to unknown."""
    aioclient_mock.clear_requests()
    aioclient_mock.post(
        "https://brickset.com/api/v3.asmx/checkKey",
        json={"status": "error", "message": "Service temporarily unavailable"},
    )

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "unknown"}


@pytest.mark.usefixtures("brickset")
async def test_duplicate_account_aborts(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The same Brickset account cannot be added twice."""
    mock_config_entry.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    # Brickset usernames ignore case, so another spelling is the same account.
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_USERNAME: USERNAME.upper()}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reauth_flow(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Reauth mints a fresh token, takes a new key if given, and keeps no password."""
    brickset.api_keys.add("renewed-key")
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        data={**mock_config_entry.data, CONF_USER_HASH: "stale"},
    )

    result = await mock_config_entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_API_KEY: "renewed-key", CONF_PASSWORD: "hunter2"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert mock_config_entry.data[CONF_USER_HASH] == USER_HASH
    assert mock_config_entry.data[CONF_API_KEY] == "renewed-key"
    assert CONF_PASSWORD not in mock_config_entry.data
    assert "hunter2" not in str(mock_config_entry.data)


async def test_reauth_flow_rejects_bad_password(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """A wrong password keeps the reauth form open."""
    brickset.credentials_valid = False
    mock_config_entry.add_to_hass(hass)

    result = await mock_config_entry.start_reauth_flow(hass)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_API_KEY: API_KEY, CONF_PASSWORD: "wrong"}
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "invalid_auth"}


async def test_reconfigure_flow(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Reconfigure can swap the API key for the same account, and keeps no password."""
    brickset.api_keys.add("new-key")
    mock_config_entry.add_to_hass(hass)

    result = await mock_config_entry.start_reconfigure_flow(hass)
    assert result["step_id"] == "reconfigure"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_API_KEY: "new-key"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    assert mock_config_entry.data[CONF_API_KEY] == "new-key"
    assert CONF_PASSWORD not in mock_config_entry.data
    assert "hunter2" not in str(mock_config_entry.data)


@pytest.mark.usefixtures("brickset")
async def test_reconfigure_rejects_other_account(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Reconfiguring onto a different Brickset account is refused."""
    mock_config_entry.add_to_hass(hass)

    result = await mock_config_entry.start_reconfigure_flow(hass)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_USERNAME: "someone_else"}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "account_mismatch"


@pytest.mark.usefixtures("brickset")
async def test_options_flow(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Options round-trip and the theme picker is populated from Brickset."""
    await setup_integration(hass, mock_config_entry)

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    assert result["description_placeholders"] == {
        "budget": "80",
        "collection_hours": "1",
        "estimated_calls": "50",
    }

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_REGION: "US",
            CONF_THEMES: ["Technic", "Icons"],
            CONF_DAILY_CALL_BUDGET: 50,
            "catalogue": True,
            "catalogue_rich": True,
            "catalogue_interval": 14,
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert mock_config_entry.options[CONF_REGION] == "US"
    assert mock_config_entry.options["catalogue_interval"] == 14
    assert mock_config_entry.options[CONF_THEMES] == ["Technic", "Icons"]
    # A smaller budget stretches the collection interval on the reload.
    collection = mock_config_entry.runtime_data.collection
    assert collection.update_interval == timedelta(hours=2)


@pytest.mark.usefixtures("brickset", "spring")
async def test_options_flow_estimates_an_unloaded_entry(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """An entry that is not loaded is estimated at the cheapest poll."""
    mock_config_entry.add_to_hass(hass)

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)

    assert result["description_placeholders"]["estimated_calls"] == "50"


@pytest.mark.usefixtures("brickset")
async def test_options_flow_links_users_to_the_account(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, hass_admin_user: MockUser
) -> None:
    """The user picker lists people, not system users, and saves who is linked."""
    await setup_integration(hass, mock_config_entry)
    member = MockUser(name="Robin").add_to_hass(hass)
    MockUser(name="Supervisor", system_generated=True).add_to_hass(hass)

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    users = next(
        value
        for key, value in result["data_schema"].schema.items()
        if key == CONF_USERS
    )
    assert {option["label"] for option in users.config["options"]} == {
        hass_admin_user.name,
        "Robin",
    }

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_REGION: "UK",
            CONF_DAILY_CALL_BUDGET: 80,
            CONF_USERS: [member.id],
            CONF_SHARED: False,
            "catalogue": True,
            "catalogue_rich": True,
            "catalogue_interval": 7,
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert mock_config_entry.options[CONF_USERS] == [member.id]
    assert mock_config_entry.options[CONF_SHARED] is False


async def test_options_flow_falls_back_to_saved_themes(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The theme picker offers the saved themes when getThemes fails."""
    await setup_integration(hass, mock_config_entry)
    brickset.themes_error = "Service temporarily unavailable"

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)

    assert result["type"] is FlowResultType.FORM
    themes = next(
        value
        for key, value in result["data_schema"].schema.items()
        if key == CONF_THEMES
    )
    assert themes.config["options"] == ["Technic"]


def test_estimated_daily_calls() -> None:
    """The estimate follows the schedule the budget yields, on the day it is made."""
    spring, autumn = date(2026, 5, 15), date(2026, 10, 1)
    themes = {CONF_THEMES: ["Technic"]}
    # 24 hourly polls of owned + wanted, plus 2 feed polls of one call each.
    assert estimated_daily_calls(themes, today=spring) == 50
    # Themes ride in one comma-joined call, so five cost the same as one.
    five = {CONF_THEMES: ["Technic", "Icons", "City", "Star Wars", "Botanicals"]}
    assert estimated_daily_calls(five, today=spring) == 50
    # No themes means no feed polls at all.
    assert estimated_daily_calls({}, today=spring) == 48
    # A tighter budget polls less often: every 4 h is 6 polls of 2, plus the feeds.
    tight = {**themes, CONF_DAILY_CALL_BUDGET: 20}
    assert estimated_daily_calls(tight, today=spring) == 14
    # A collection past a page costs more a poll, so it is polled every 2 h.
    assert estimated_daily_calls(themes, poll_cost=4, today=spring) == 50
    # Until a poll has asked getThemes, next year is assumed from September.
    assert estimated_daily_calls(themes, today=autumn) == 52

    # Following every theme reads the year once a day, about 3 calls, and the
    # watched themes come out of that read rather than costing their own.
    releases = {**themes, CONF_RELEASES: True}
    assert estimated_daily_calls(releases, today=spring) == 51
    assert estimated_daily_calls(releases, today=autumn) == 52
    # January reads last year whole as well.
    assert estimated_daily_calls(releases, today=date(2026, 1, 10)) == 54
    # On a tight budget its calls come out of the collection's share: 15 less 3
    # leaves 12, so the collection polls every 4 h.
    tight = {**releases, CONF_DAILY_CALL_BUDGET: 20}
    assert estimated_daily_calls(tight, today=spring) == 15
    # Once a poll has measured itself, that replaces the estimate.
    assert estimated_daily_calls(releases, today=spring, feeds_cost=2) == 50
