"""Tests for following and unfollowing themes from the panel."""

from typing import Any

from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_REGION
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_RELEASES,
    CONF_SHARED,
    CONF_THEMES,
    EVENT_NEW_SET,
)

from .conftest import BricksetServer, make_set, setup_integration


def _account(entry: MockConfigEntry, **options: Any) -> MockConfigEntry:
    """Return the fixture's account with these options instead."""
    return MockConfigEntry(
        domain=entry.domain,
        title=entry.title,
        unique_id=entry.unique_id,
        version=entry.version,
        minor_version=entry.minor_version,
        data=dict(entry.data),
        options={CONF_REGION: "UK", CONF_THEMES: [], **options},
    )


async def _follow(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    theme: str,
    *,
    follow: bool = True,
    token: str | None = None,
) -> dict[str, Any]:
    """Send a follow over the websocket and return the reply."""
    client = await (hass_ws_client(hass, token) if token else hass_ws_client(hass))
    await client.send_json_auto_id(
        {"type": "lego/themes/follow", "theme": theme, "follow": follow}
    )
    return await client.receive_json()


@pytest.mark.usefixtures("spring")
async def test_following_a_theme_fetches_it_without_a_reload(
    hass: HomeAssistant,
    brickset: BricksetServer,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """One batched call fetches the themes, and the collection is not re-polled."""
    brickset.theme_sets.append(make_set(7, "10330-1", "An Icon", theme="Icons"))
    entry = await setup_integration(hass, mock_config_entry)
    events: list[Event] = []

    @callback
    def record(event: Event) -> None:
        events.append(event)

    hass.bus.async_listen(EVENT_NEW_SET, record)
    before = len(brickset.get_sets_calls)

    message = await _follow(hass, hass_ws_client, "Icons")

    assert message["result"] == {"followed": ["Technic", "Icons"], "complete": True}
    assert entry.options[CONF_THEMES] == ["Technic", "Icons"]
    assert [call["theme"] for call in brickset.get_sets_calls[before:]] == [
        "Technic,Icons"
    ]
    feeds = entry.runtime_data.feeds
    assert [item.number for item in feeds.data.themes["Icons"]] == ["10330-1"]
    # A theme just followed is baselined, so its existing sets are not news.
    assert events == []
    assert entry.state is ConfigEntryState.LOADED


@pytest.mark.usefixtures("brickset", "spring")
async def test_following_starts_polling_on_an_idle_feed(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An account that followed nothing starts polling once it follows a theme."""
    entry = await setup_integration(hass, _account(mock_config_entry))
    feeds = entry.runtime_data.feeds
    assert feeds.update_interval is None

    message = await _follow(hass, hass_ws_client, "Technic")

    assert message["result"]["complete"] is True
    assert feeds.update_interval is not None
    assert len(feeds.data.themes["Technic"]) == 2


async def test_following_while_reading_whole_years_costs_nothing(
    hass: HomeAssistant,
    brickset: BricksetServer,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The theme is cut from the years already read."""
    brickset.year_sets[:] = [
        make_set(8, "42300-1", "Year Technic", theme="Technic", year=dt_util.now().year)
    ]
    entry = await setup_integration(
        hass, _account(mock_config_entry, **{CONF_RELEASES: True})
    )
    await hass.async_block_till_done(wait_background_tasks=True)
    before = len(brickset.get_sets_calls)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/themes"})
    assert (await client.receive_json())["result"]["follow_cost"] == 0

    message = await _follow(hass, hass_ws_client, "technic")

    assert message["result"]["complete"] is True
    assert brickset.get_sets_calls[before:] == []
    feeds = entry.runtime_data.feeds
    assert [item.number for item in feeds.data.themes["technic"]] == ["42300-1"]


async def test_unfollowing_drops_the_theme_without_a_call(
    hass: HomeAssistant,
    brickset: BricksetServer,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Stopping following needs nothing fetched."""
    entry = await setup_integration(hass, mock_config_entry)
    before = len(brickset.get_sets_calls)

    message = await _follow(hass, hass_ws_client, "TECHNIC", follow=False)

    assert message["result"] == {"followed": [], "complete": True}
    assert brickset.get_sets_calls[before:] == []
    assert entry.runtime_data.feeds.data.themes == {}


@pytest.mark.usefixtures("brickset", "spring")
async def test_the_theme_list_says_what_following_costs(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The picker gets every theme, the followed ones and the call it spends."""
    await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/themes"})
    result = (await client.receive_json())["result"]

    assert "Technic" in result["themes"]
    assert result["followed"] == ["Technic"]
    assert result["follow_cost"] == 1
    assert result["can_change"] is True


@pytest.mark.usefixtures("brickset")
async def test_a_read_only_user_cannot_follow(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_read_only_access_token: str,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A read-only user sees a shared account's themes but cannot change them."""
    entry = await setup_integration(
        hass, _account(mock_config_entry, **{CONF_SHARED: True})
    )

    message = await _follow(
        hass, hass_ws_client, "Icons", token=hass_read_only_access_token
    )

    assert message["error"]["code"] == "unauthorized"
    assert entry.options[CONF_THEMES] == []


@pytest.mark.usefixtures("brickset", "member")
async def test_a_user_cannot_follow_on_someone_elses_account(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    member_token: str,
    mock_config_entry: MockConfigEntry,
) -> None:
    """An account the user may not see is not theirs to change."""
    entry = await setup_integration(hass, mock_config_entry)

    client = await hass_ws_client(hass, member_token)
    await client.send_json_auto_id(
        {
            "type": "lego/themes/follow",
            "config_entry_id": entry.entry_id,
            "theme": "Icons",
            "follow": True,
        }
    )
    message = await client.receive_json()

    assert message["error"]["code"] == "unauthorized"
    assert entry.options[CONF_THEMES] == ["Technic"]
