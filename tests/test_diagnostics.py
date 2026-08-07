"""Tests for LEGO diagnostics."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lego.diagnostics import async_get_config_entry_diagnostics

from .conftest import API_KEY, USER_HASH, USERNAME, BricksetServer, setup_integration


async def test_diagnostics_redact_secrets(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
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


async def test_diagnostics_include_quota_and_coordinator_state(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
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
    assert collection["watched_sets"] == ["10497-1"]
    assert collection["update_interval_hours"] == 6

    assert diagnostics["coordinators"]["feeds"]["themes"] == {"Technic": 2}
    assert diagnostics["summary"]["pieces_owned"] == 7122


async def test_diagnostics_report_the_catalogue(
    hass: HomeAssistant, brickset: BricksetServer, mock_config_entry: MockConfigEntry
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
