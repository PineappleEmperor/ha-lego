"""Tests for who may see and change which Brickset account."""

from typing import Any

from homeassistant.const import CONF_API_KEY, CONF_REGION, CONF_USERNAME
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import Unauthorized
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.lego.const import (
    CONF_SHARED,
    CONF_THEMES,
    CONF_USER_HASH,
    CONF_USERS,
    DOMAIN,
    SERVICE_SET_COLLECTION,
)

from .conftest import (
    API_KEY,
    USER_HASH,
    BricksetServer,
    lego_device_id,
    setup_integration,
)


async def _account(hass: HomeAssistant, name: str, **options: Any) -> MockConfigEntry:
    """Set up a current Brickset account with these access options."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=name,
        unique_id=name,
        version=2,
        minor_version=2,
        data={
            CONF_API_KEY: API_KEY,
            CONF_USERNAME: name,
            CONF_USER_HASH: USER_HASH,
        },
        options={CONF_REGION: "UK", CONF_THEMES: [], **options},
    )
    return await setup_integration(hass, entry)


def _set_owned(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    """Build an action call marking a set owned on this account."""
    return {
        "device_id": lego_device_id(hass, entry),
        "set_number": "10497-1",
        "owned": True,
    }


@pytest.mark.usefixtures("brickset")
async def test_a_user_sees_only_the_accounts_they_may_use(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    member: MockUser,
    member_token: str,
) -> None:
    """Their own and the shared account are listed; someone else's is not."""
    await _account(hass, "stranger")
    family = await _account(hass, "family", **{CONF_SHARED: True})
    own = await _account(hass, "robin", **{CONF_USERS: [member.id]})

    client = await hass_ws_client(hass, member_token)
    await client.send_json_auto_id({"type": "lego/accounts"})
    result = (await client.receive_json())["result"]

    assert [item["name"] for item in result["accounts"]] == ["family", "robin"]
    # Before choosing a default, their own account opens ahead of a shared one.
    assert result["selected"] == own.entry_id
    assert family.entry_id in {item["entry_id"] for item in result["accounts"]}


@pytest.mark.usefixtures("brickset")
async def test_an_admin_sees_every_account(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Accounts linked to nobody are still an admin's to manage."""
    await _account(hass, "stranger")

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/accounts"})
    result = (await client.receive_json())["result"]

    assert [item["name"] for item in result["accounts"]] == ["stranger"]


@pytest.mark.usefixtures("brickset")
async def test_another_users_account_is_refused(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, member_token: str
) -> None:
    """Naming an account the user may not see is refused, as is defaulting to it."""
    stranger = await _account(hass, "stranger")

    client = await hass_ws_client(hass, member_token)
    await client.send_json_auto_id(
        {"type": "lego/dashboard", "config_entry_id": stranger.entry_id}
    )
    message = await client.receive_json()
    assert not message["success"]
    assert message["error"]["code"] == "unauthorized"

    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": stranger.entry_id}
    )
    assert not (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "lego/dashboard"})
    message = await client.receive_json()
    assert message["error"]["code"] == "not_found"


@pytest.mark.usefixtures("brickset")
async def test_a_chosen_default_beats_the_users_own_account(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    member: MockUser,
    member_token: str,
) -> None:
    """Once a user makes the shared account their default, it opens first."""
    family = await _account(hass, "family", **{CONF_SHARED: True})
    await _account(hass, "robin", **{CONF_USERS: [member.id]})

    client = await hass_ws_client(hass, member_token)
    await client.send_json_auto_id(
        {"type": "lego/account/set", "config_entry_id": family.entry_id}
    )
    assert (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "lego/accounts"})
    assert (await client.receive_json())["result"]["selected"] == family.entry_id


async def test_a_user_changes_their_own_account(
    hass: HomeAssistant, brickset: BricksetServer, member: MockUser
) -> None:
    """A linked user's action reaches Brickset."""
    own = await _account(hass, "robin", **{CONF_USERS: [member.id]})

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_COLLECTION,
        _set_owned(hass, own),
        blocking=True,
        context=Context(user_id=member.id),
    )

    assert len(brickset.set_collection_calls) == 1


async def test_a_user_cannot_change_someone_elses_account(
    hass: HomeAssistant, brickset: BricksetServer, member: MockUser
) -> None:
    """An action on an account the user may not use never reaches Brickset."""
    stranger = await _account(hass, "stranger")

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            _set_owned(hass, stranger),
            blocking=True,
            context=Context(user_id=member.id),
        )

    assert brickset.set_collection_calls == []


async def test_a_read_only_user_cannot_change_their_account(
    hass: HomeAssistant, brickset: BricksetServer, hass_read_only_user: MockUser
) -> None:
    """A read-only user may look at a shared account but not write to it."""
    family = await _account(hass, "family", **{CONF_SHARED: True})

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_COLLECTION,
            _set_owned(hass, family),
            blocking=True,
            context=Context(user_id=hass_read_only_user.id),
        )

    assert brickset.set_collection_calls == []


async def test_an_automation_changes_any_account(
    hass: HomeAssistant, brickset: BricksetServer
) -> None:
    """A call with no user came from an automation, which an admin set up."""
    stranger = await _account(hass, "stranger")

    await hass.services.async_call(
        DOMAIN, SERVICE_SET_COLLECTION, _set_owned(hass, stranger), blocking=True
    )

    assert len(brickset.set_collection_calls) == 1
