"""Set pictures kept on Home Assistant's disk, so a dashboard draws them offline."""

import asyncio
from datetime import timedelta
from http import HTTPStatus
import logging
from pathlib import Path
import re
import shutil
import time
from typing import TYPE_CHECKING, Any

from aiohttp import ClientError, ClientTimeout, hdrs, web
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.http import KEY_AUTHENTICATED, KEY_HASS, HomeAssistantView
from homeassistant.util.hass_dict import HassKey

from .const import (
    BRICKSET_IMAGE_URL,
    BRICKSET_THUMBNAIL_URL,
    CONF_SHARP_PICTURES,
    DEFAULT_SHARP_PICTURES,
    DOMAIN,
)

if TYPE_CHECKING:
    from .coordinator import LegoConfigEntry

_LOGGER = logging.getLogger(__name__)

IMAGE_PATH = "/api/lego/image/{size}/{number}.jpg"
SOURCES = {"small": BRICKSET_THUMBNAIL_URL, "large": BRICKSET_IMAGE_URL}
# Core signs media it hands out for a day (CONTENT_AUTH_EXPIRY_TIME); re-signing at
# half-life keeps one address per picture for half a day, so browsers can cache it.
SIGNED_FOR = timedelta(hours=24)
RESIGN_WITHIN = timedelta(hours=12)
FETCH_TIMEOUT = ClientTimeout(total=20)
# Brickset numbers are letters, digits and a variant suffix; nothing else reaches disk.
_NUMBER = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$")

IMAGE_CACHE: HassKey[ImageCache] = HassKey(f"{DOMAIN}_images")


class ImageUnavailable(Exception):
    """Brickset could not be reached for a picture not yet on disk."""


def _read(path: Path) -> bytes | None:
    try:
        return path.read_bytes()
    except FileNotFoundError:
        return None


def _write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_suffix(".part")
    partial.write_bytes(data)
    partial.replace(path)


class ImageCache:
    """Each picture fetched from Brickset once, then served from disk."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Keep pictures under Home Assistant's cache folder, outside backups."""
        self.hass = hass
        self.root = Path(hass.config.cache_path(DOMAIN, "images"))
        self._signed: dict[str, tuple[str, float]] = {}
        self._locks: dict[str, asyncio.Lock] = {}

    @callback
    def url(self, number: str, size: str) -> str | None:
        """Return a signed address for one picture, the same one for half a day."""
        if size not in SOURCES or not _NUMBER.match(number):
            return None
        path = IMAGE_PATH.format(size=size, number=number)
        now = time.time()
        signed = self._signed.get(path)
        if signed is None or signed[1] - now < RESIGN_WITHIN.total_seconds():
            signed = (
                # The content user, as core signs media: the picture is the same for
                # every viewer, so one address serves them all.
                async_sign_path(self.hass, path, SIGNED_FOR, use_content_user=True),
                now + SIGNED_FOR.total_seconds(),
            )
            self._signed[path] = signed
        return signed[0]

    def _file(self, number: str, size: str) -> Path:
        # Brickset's server ignores case, so one file serves every spelling.
        return self.root / size / f"{number.lower()}.jpg"

    async def async_get(self, number: str, size: str) -> bytes | None:
        """Return a picture, fetching it first if absent; None if Brickset has none."""
        path = self._file(number, size)
        if (data := await self.hass.async_add_executor_job(_read, path)) is not None:
            return data
        lock = self._locks.setdefault(str(path), asyncio.Lock())
        async with lock:
            if (
                data := await self.hass.async_add_executor_job(_read, path)
            ) is not None:
                return data
            data = await self._async_fetch(SOURCES[size].format(number=number))
            if data is not None:
                await self.hass.async_add_executor_job(_write, path, data)
        self._locks.pop(str(path), None)
        return data

    async def _async_fetch(self, url: str) -> bytes | None:
        session = async_get_clientsession(self.hass)
        try:
            async with session.get(url, timeout=FETCH_TIMEOUT) as response:
                if response.status == HTTPStatus.NOT_FOUND:
                    return None
                response.raise_for_status()
                if not response.content_type.startswith("image/"):
                    return None
                return await response.read()
        except (ClientError, TimeoutError) as err:
            _LOGGER.debug("Could not fetch %s: %s", url, err)
            raise ImageUnavailable from err

    async def async_clear(self) -> None:
        """Delete every stored picture, once no account is left to show them."""
        await self.hass.async_add_executor_job(shutil.rmtree, self.root, True)


class LegoImageView(HomeAssistantView):
    """Serve a set's picture to the panel and cards from disk."""

    url = IMAGE_PATH
    name = "api:lego:image"
    # An <img> cannot send a bearer token, so the address carries a signature;
    # the auth middleware checks it and marks the request authenticated.
    requires_auth = False

    async def get(self, request: web.Request, size: str, number: str) -> web.Response:
        """Return the picture, or say why there is none."""
        if not request[KEY_AUTHENTICATED]:
            # As core's media player proxy: a 401 counts towards an IP ban, and a
            # signature dies with every restart, so a tab left open would otherwise
            # ban its own user. Only a real login attempt gets 401.
            if hdrs.AUTHORIZATION in request.headers:
                raise web.HTTPUnauthorized
            raise web.HTTPForbidden
        if size not in SOURCES or not _NUMBER.match(number):
            raise web.HTTPNotFound
        cache = request.app[KEY_HASS].data[IMAGE_CACHE]
        try:
            data = await cache.async_get(number, size)
        except ImageUnavailable:
            # The panel then asks Brickset directly, and failing that shows its icon.
            return web.Response(status=HTTPStatus.BAD_GATEWAY)
        if data is None:
            raise web.HTTPNotFound
        return web.Response(
            body=data,
            content_type="image/jpeg",
            headers={hdrs.CACHE_CONTROL: "private, max-age=43200"},
        )


@callback
def async_setup_images(hass: HomeAssistant) -> None:
    """Start the cache and its view once, whatever the number of accounts."""
    hass.data[IMAGE_CACHE] = ImageCache(hass)
    hass.http.register_view(LegoImageView())


@callback
def with_pictures(
    hass: HomeAssistant, entry: LegoConfigEntry, cards: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Point each card at Home Assistant's copy, keeping Brickset's as a fallback."""
    cache = hass.data[IMAGE_CACHE]
    sharp = entry.options.get(CONF_SHARP_PICTURES, DEFAULT_SHARP_PICTURES)
    for card in cards:
        number = card["set_number"]
        card["image_remote"] = card["image"]
        card["image"] = cache.url(number, "small") or card["image"]
        card["image_large"] = cache.url(number, "large") if sharp else None
    return cards
