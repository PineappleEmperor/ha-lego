"""Tests for the LEGO config, reauth, reconfigure and options flows."""

from __future__ import annotations

import aiohttp
from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY, CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lego.config_flow import estimated_daily_calls
from custom_components.lego.const import (
    CONF_COLLECTION_INTERVAL,
    CONF_DAILY_CALL_BUDGET,
    CONF_FEEDS_INTERVAL,
    CONF_REGION,
    CONF_THEMES,
    CONF_USER_HASH,
    DOMAIN,
)

from .conftest import API_KEY, USER_HASH, USERNAME, BricksetServer, setup_integration

USER_INPUT = {
    CONF_API_KEY: API_KEY,
    CONF_USERNAME: USERNAME,
    CONF_PASSWORD: "hunter2",
}


async def test_user_flow(hass: HomeAssistant, brickset: BricksetServer) -> None:
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


async def test_user_flow_asks_for_region_when_country_is_unmapped(
    hass: HomeAssistant, brickset: BricksetServer
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


async def test_region_step_is_seeded_from_the_country(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
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


async def test_region_can_be_overridden_at_setup(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
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


async def test_user_flow_cannot_connect(
    hass: HomeAssistant, aioclient_mock, brickset: BricksetServer
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


async def test_duplicate_account_aborts(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """The same Brickset account cannot be added twice."""
    mock_config_entry.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], USER_INPUT
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reauth_flow(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Reauth mints a fresh token and reloads the entry."""
    mock_config_entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(
        mock_config_entry,
        data={**mock_config_entry.data, CONF_USER_HASH: "stale"},
    )

    result = await mock_config_entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_API_KEY: API_KEY, CONF_PASSWORD: "hunter2"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert mock_config_entry.data[CONF_USER_HASH] == USER_HASH


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
    """Reconfigure can swap the API key for the same account."""
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


async def test_reconfigure_rejects_other_account(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Reconfiguring onto a different Brickset account is refused."""
    mock_config_entry.add_to_hass(hass)

    result = await mock_config_entry.start_reconfigure_flow(hass)
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**USER_INPUT, CONF_USERNAME: "someone_else"}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "account_mismatch"


async def test_options_flow(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
) -> None:
    """Options round-trip and the theme picker is populated from Brickset."""
    await setup_integration(hass, mock_config_entry)

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    assert result["description_placeholders"]["budget"] == "80"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            CONF_REGION: "US",
            CONF_THEMES: ["Technic", "Icons"],
            CONF_COLLECTION_INTERVAL: 8,
            CONF_FEEDS_INTERVAL: 24,
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


def test_estimated_daily_calls() -> None:
    """The estimate accounts for both coordinators."""
    # 4 collection polls x (owned + wanted) = 8, plus 2 feed polls of one call each.
    assert (
        estimated_daily_calls(
            {
                CONF_COLLECTION_INTERVAL: 6,
                CONF_FEEDS_INTERVAL: 12,
                CONF_THEMES: ["Technic"],
            }
        )
        == 10
    )
    # Themes ride in one comma-joined call, so five cost the same as one.
    assert (
        estimated_daily_calls(
            {
                CONF_COLLECTION_INTERVAL: 6,
                CONF_FEEDS_INTERVAL: 12,
                CONF_THEMES: ["Technic", "Icons", "City", "Star Wars", "Botanicals"],
            }
        )
        == 10
    )
    # No themes means no feed polls at all.
    assert (
        estimated_daily_calls({CONF_COLLECTION_INTERVAL: 24, CONF_FEEDS_INTERVAL: 12})
        == 2
    )
