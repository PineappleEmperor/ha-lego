"""Tests for the set pictures Home Assistant keeps and serves."""

from datetime import timedelta
from http import HTTPStatus
from pathlib import Path

import aiohttp
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import (
    ClientSessionGenerator,
    WebSocketGenerator,
)

from custom_components.lego.const import CONF_SHARP_PICTURES
from custom_components.lego.images import IMAGE_CACHE

from .conftest import setup_integration

SMALL = "https://images.brickset.com/sets/small/10294-1.jpg"
LARGE = "https://images.brickset.com/sets/images/10294-1.jpg"
BACKUP_SMALL = "https://cdn.rebrickable.com/media/thumbs/sets/10294-1.jpg/230x230p.jpg"
JPEG = b"\xff\xd8\xff\xe0 picture of the Titanic"


@pytest.fixture
def cache_dir(tmp_path: Path) -> Path:
    """Keep the pictures in a temporary folder rather than the test package."""
    return tmp_path


async def _start(hass: HomeAssistant, entry: MockConfigEntry, cache_dir: Path) -> None:
    await setup_integration(hass, entry)
    hass.data[IMAGE_CACHE].root = cache_dir


async def _wishlist_card(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, client=None
) -> dict:
    client = client or await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    return (await client.receive_json())["result"]["wishlist"][0]


@pytest.mark.usefixtures("brickset")
async def test_a_picture_is_fetched_once_then_served_from_disk(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """The signed address works without a login, and Brickset is asked only once."""
    aioclient_mock.get(SMALL, content=JPEG, headers={"Content-Type": "image/jpeg"})
    await _start(hass, mock_config_entry, cache_dir)
    card = await _wishlist_card(hass, hass_ws_client)
    client = await hass_client_no_auth()

    for _ in range(2):
        response = await client.get(card["image"])
        assert response.status == HTTPStatus.OK
        assert await response.read() == JPEG
        assert response.headers["Cache-Control"] == "private, max-age=43200"

    assert sum(1 for call in aioclient_mock.mock_calls if str(call[1]) == SMALL) == 1
    assert (cache_dir / "small" / "10294-1.jpg").read_bytes() == JPEG


@pytest.mark.usefixtures("brickset")
async def test_a_picture_without_a_signature_is_refused(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """An expired tab gets 403, so it cannot ban its user; a bad login gets 401."""
    await _start(hass, mock_config_entry, cache_dir)
    client = await hass_client_no_auth()

    response = await client.get("/api/lego/image/small/10294-1.jpg")
    assert response.status == HTTPStatus.FORBIDDEN

    response = await client.get(
        "/api/lego/image/small/10294-1.jpg",
        headers={"Authorization": "Bearer not-a-token"},
    )
    assert response.status == HTTPStatus.UNAUTHORIZED


@pytest.mark.parametrize(
    "path",
    ["/api/lego/image/huge/10294-1.jpg", "/api/lego/image/small/..%2Fsecrets.jpg"],
)
@pytest.mark.usefixtures("brickset")
async def test_only_a_known_size_and_a_set_number_are_served(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
    path: str,
) -> None:
    """Nothing but a set number reaches the disk or Brickset."""
    await _start(hass, mock_config_entry, cache_dir)

    response = await (await hass_client()).get(path)

    # Home Assistant's own security filter answers a ".." before the view does.
    assert response.status in (HTTPStatus.NOT_FOUND, HTTPStatus.BAD_REQUEST)
    assert not any(cache_dir.rglob("*"))


@pytest.mark.usefixtures("brickset")
async def test_a_set_brickset_has_no_picture_of_is_not_found(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """No picture on either site is a 404, remembered rather than asked again."""
    aioclient_mock.get(SMALL, status=HTTPStatus.NOT_FOUND)
    aioclient_mock.get(BACKUP_SMALL, status=HTTPStatus.NOT_FOUND)
    await _start(hass, mock_config_entry, cache_dir)
    client = await hass_client()

    for _ in range(2):
        response = await client.get("/api/lego/image/small/10294-1.jpg")
        assert response.status == HTTPStatus.NOT_FOUND

    assert not any(cache_dir.rglob("*.jpg"))
    asked = [str(call[1]) for call in aioclient_mock.mock_calls]
    assert (asked.count(SMALL), asked.count(BACKUP_SMALL)) == (1, 1)


@pytest.mark.usefixtures("brickset")
async def test_rebrickable_pictures_a_set_brickset_cannot(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """Mostly promotional sets: Rebrickable's copy, by its lower-case number, is kept."""
    aioclient_mock.get(
        "https://images.brickset.com/sets/small/REDSOX2016-1.jpg",
        status=HTTPStatus.NOT_FOUND,
    )
    aioclient_mock.get(
        "https://cdn.rebrickable.com/media/thumbs/sets/redsox2016-1.jpg/230x230p.jpg",
        content=JPEG,
        headers={"Content-Type": "image/jpeg"},
    )
    await _start(hass, mock_config_entry, cache_dir)

    response = await (await hass_client()).get("/api/lego/image/small/REDSOX2016-1.jpg")

    assert response.status == HTTPStatus.OK
    assert await response.read() == JPEG
    assert (cache_dir / "small" / "redsox2016-1.jpg").read_bytes() == JPEG


@pytest.mark.usefixtures("brickset")
async def test_an_unreachable_brickset_says_so(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """Offline and not yet stored: 502, so the panel tries Brickset itself."""
    aioclient_mock.get(SMALL, exc=aiohttp.ClientConnectionError())
    aioclient_mock.get(BACKUP_SMALL, exc=aiohttp.ClientConnectionError())
    await _start(hass, mock_config_entry, cache_dir)

    response = await (await hass_client()).get("/api/lego/image/small/10294-1.jpg")

    assert response.status == HTTPStatus.BAD_GATEWAY


@pytest.mark.usefixtures("brickset")
async def test_a_stored_picture_needs_no_internet(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """The point of keeping them: a dashboard with no connection still draws."""
    (cache_dir / "small").mkdir(parents=True)
    (cache_dir / "small" / "10294-1.jpg").write_bytes(JPEG)
    aioclient_mock.get(SMALL, exc=aiohttp.ClientConnectionError())
    await _start(hass, mock_config_entry, cache_dir)

    response = await (await hass_client()).get("/api/lego/image/small/10294-1.jpg")

    assert response.status == HTTPStatus.OK
    assert await response.read() == JPEG
    assert not any(str(call[1]) == SMALL for call in aioclient_mock.mock_calls)


@pytest.mark.usefixtures("brickset")
async def test_sharp_pictures_offer_the_large_copy(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """The option tells the panel to draw it, served from its own folder."""
    aioclient_mock.get(LARGE, content=JPEG, headers={"Content-Type": "image/jpeg"})
    entry = MockConfigEntry(
        domain=mock_config_entry.domain,
        title=mock_config_entry.title,
        unique_id=mock_config_entry.unique_id,
        version=mock_config_entry.version,
        minor_version=mock_config_entry.minor_version,
        data=dict(mock_config_entry.data),
        options={**mock_config_entry.options, CONF_SHARP_PICTURES: True},
    )
    await _start(hass, entry, cache_dir)
    client = await hass_ws_client(hass)
    card = await _wishlist_card(hass, hass_ws_client, client)
    await client.send_json_auto_id({"type": "lego/dashboard"})
    assert (await client.receive_json())["result"]["sharp_pictures"] is True

    assert card["image_large"].startswith("/api/lego/image/large/10294-1.jpg?authSig=")
    response = await (await hass_client_no_auth()).get(card["image_large"])
    assert response.status == HTTPStatus.OK
    assert (cache_dir / "large" / "10294-1.jpg").exists()


@pytest.mark.usefixtures("brickset")
async def test_an_address_holds_for_half_a_day(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
    freezer: FrozenDateTimeFactory,
) -> None:
    """One address per picture for half a day, so a browser can keep it."""
    await _start(hass, mock_config_entry, cache_dir)
    # One open connection, as a panel left open would be; a new one would need a
    # fresh login after the clock moves.
    client = await hass_ws_client(hass)
    first = (await _wishlist_card(hass, hass_ws_client, client))["image"]

    freezer.tick(timedelta(hours=11))
    assert (await _wishlist_card(hass, hass_ws_client, client))["image"] == first

    freezer.tick(timedelta(hours=2))
    assert (await _wishlist_card(hass, hass_ws_client, client))["image"] != first


@pytest.mark.usefixtures("brickset")
async def test_removing_the_last_account_deletes_the_pictures(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    cache_dir: Path,
) -> None:
    """Nothing is left behind once nothing could show them."""
    await _start(hass, mock_config_entry, cache_dir)
    (cache_dir / "small").mkdir(parents=True)
    (cache_dir / "small" / "10294-1.jpg").write_bytes(JPEG)

    await hass.config_entries.async_remove(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert not cache_dir.exists()
