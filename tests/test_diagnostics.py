"""Tests for LEGO diagnostics."""

from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.lego.const import CONF_SHARED, CONF_USERS, DOMAIN
from custom_components.lego.diagnostics import async_get_config_entry_diagnostics

from .conftest import API_KEY, USER_HASH, USERNAME, setup_integration


@pytest.mark.usefixtures("brickset")
async def test_diagnostics_redact_secrets(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """The API key, token and username never appear in the payload."""
    await setup_integration(hass, mock_config_entry)

    diagnostics = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    assert diagnostics["entry"]["data"]["api_key"] == "**REDACTED**"
    assert diagnostics["entry"]["data"]["user_hash"] == "**REDACTED**"
    assert diagnostics["entry"]["data"]["username"] == "**REDACTED**"

    serialised = str(diagnostics)
    assert API_KEY not in serialised
    assert USER_HASH not in serialised
    assert USERNAME not in serialised


@pytest.mark.usefixtures("brickset")
async def test_diagnostics_redact_who_uses_the_account(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, member: MockUser
) -> None:
    """Linked Home Assistant users are counted, never named or identified."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=mock_config_entry.title,
        unique_id=mock_config_entry.unique_id,
        version=2,
        minor_version=2,
        data=dict(mock_config_entry.data),
        options={
            **mock_config_entry.options,
            CONF_USERS: [member.id],
            CONF_SHARED: True,
        },
    )
    await setup_integration(hass, entry)

    diagnostics = await async_get_config_entry_diagnostics(hass, entry)

    assert diagnostics["entry"]["options"][CONF_USERS] == "**REDACTED**"
    assert diagnostics["entry"]["linked_users"] == 1
    assert diagnostics["entry"]["options"][CONF_SHARED] is True
    serialised = str(diagnostics)
    assert member.id not in serialised
    assert str(member.name) not in serialised


@pytest.mark.usefixtures("brickset")
async def test_diagnostics_include_quota_and_coordinator_state(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Diagnostics report the call budget and what each coordinator holds."""
    await setup_integration(hass, mock_config_entry)

    diagnostics = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    quota = diagnostics["quota"]
    assert quota["calls_today"] == 3
    assert quota["budget"] == 80
    assert quota["remaining"] == 77
    assert quota["brickset_daily_limit"] == 100
    assert quota["recent_usage"]

    collection = diagnostics["coordinators"]["collection"]
    assert collection["last_update_success"] is True
    assert collection["owned_sets"] == 3
    assert collection["wanted_sets"] == 1
    assert collection["update_interval_hours"] == 1

    feeds = diagnostics["coordinators"]["feeds"]
    assert feeds["themes"] == {"Technic": 2}
    assert feeds["calls_per_poll"] == 1
    assert feeds["release_sets"] is None
    assert diagnostics["summary"]["pieces_owned"] == 7122


@pytest.mark.usefixtures("brickset")
async def test_diagnostics_report_the_catalogue(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> None:
    """Diagnostics show whether the local index seeded and what it learned."""
    await setup_integration(hass, mock_config_entry)
    await hass.async_block_till_done()

    catalogue = (await async_get_config_entry_diagnostics(hass, mock_config_entry))[
        "catalogue"
    ]

    assert catalogue["sets"] == 2
    assert catalogue["known_brickset_ids"] == 6
    assert catalogue["stale"] is False
