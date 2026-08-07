"""Config, reauth, reconfigure and options flows for the LEGO integration."""

from __future__ import annotations

from collections.abc import Mapping
import logging
import math
from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_API_KEY, CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    BooleanSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)
import voluptuous as vol

from .api import BricksetClient
from .const import (
    CONF_CATALOGUE,
    CONF_CATALOGUE_RICH,
    CONF_COLLECTION_INTERVAL,
    CONF_DAILY_CALL_BUDGET,
    CONF_FEEDS_INTERVAL,
    CONF_REGION,
    CONF_THEMES,
    CONF_USER_HASH,
    CONF_WATCHLIST,
    COUNTRY_TO_REGION,
    DEFAULT_CATALOGUE,
    DEFAULT_CATALOGUE_RICH,
    DEFAULT_COLLECTION_INTERVAL_HOURS,
    DEFAULT_DAILY_CALL_BUDGET,
    DEFAULT_FEEDS_INTERVAL_HOURS,
    DEFAULT_REGION,
    DOMAIN,
    MAX_INTERVAL_HOURS,
    MIN_INTERVAL_HOURS,
    REGIONS,
)
from .exceptions import (
    BricksetAuthError,
    BricksetConnectionError,
    BricksetError,
    BricksetUserHashError,
)

_LOGGER = logging.getLogger(__name__)

STEP_USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_API_KEY): TextSelector(
            TextSelectorConfig(type=TextSelectorType.PASSWORD)
        ),
        vol.Required(CONF_USERNAME): TextSelector(),
        vol.Required(CONF_PASSWORD): TextSelector(
            TextSelectorConfig(type=TextSelectorType.PASSWORD)
        ),
    }
)


def estimated_daily_calls(options: Mapping[str, Any]) -> int:
    """Estimate billed getSets calls per day for a set of options."""
    collection_hours = options.get(
        CONF_COLLECTION_INTERVAL, DEFAULT_COLLECTION_INTERVAL_HOURS
    )
    feeds_hours = options.get(CONF_FEEDS_INTERVAL, DEFAULT_FEEDS_INTERVAL_HOURS)
    themes = len(options.get(CONF_THEMES, []))
    watchlist = 1 if options.get(CONF_WATCHLIST) else 0

    collection_polls = math.ceil(24 / max(collection_hours, 1))
    feed_polls = math.ceil(24 / max(feeds_hours, 1)) if themes else 0
    return collection_polls * (2 + watchlist) + feed_polls * themes


async def _validate(hass: Any, api_key: str, username: str, password: str) -> str:
    """Validate credentials and return a user hash."""
    client = BricksetClient(async_get_clientsession(hass), api_key)
    await client.check_key()
    return await client.login(username, password)


class LegoConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for LEGO."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialise the flow."""
        self._entry_data: dict[str, Any] = {}

    async def _async_try_credentials(
        self, user_input: dict[str, Any], errors: dict[str, str]
    ) -> str | None:
        """Validate user input, populating errors on failure."""
        try:
            return await _validate(
                self.hass,
                user_input[CONF_API_KEY],
                user_input[CONF_USERNAME],
                user_input[CONF_PASSWORD],
            )
        except BricksetAuthError:
            errors["base"] = "invalid_api_key"
        except BricksetUserHashError:
            errors["base"] = "invalid_auth"
        except BricksetConnectionError:
            errors["base"] = "cannot_connect"
        except BricksetError:
            _LOGGER.exception("Unexpected Brickset error during setup")
            errors["base"] = "unknown"
        return None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}
        if user_input is not None:
            user_hash = await self._async_try_credentials(user_input, errors)
            if user_hash is not None:
                await self.async_set_unique_id(user_input[CONF_USERNAME].lower())
                self._abort_if_unique_id_configured()
                self._entry_data = {
                    CONF_API_KEY: user_input[CONF_API_KEY],
                    CONF_USERNAME: user_input[CONF_USERNAME],
                    CONF_USER_HASH: user_hash,
                }
                return await self.async_step_region()

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_SCHEMA,
            description_placeholders={"api_key_path": "Tools -> Web services"},
            errors=errors,
        )

    def _create(self, region: str) -> ConfigFlowResult:
        """Finish the flow with a pricing region."""
        return self.async_create_entry(
            title=self._entry_data[CONF_USERNAME],
            data=self._entry_data,
            options={CONF_REGION: region},
        )

    async def async_step_region(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choose the market to price against, seeded from the country."""
        if user_input is not None:
            return self._create(user_input[CONF_REGION])

        country = self.hass.config.country or ""
        suggested = COUNTRY_TO_REGION.get(country)
        selector = SelectSelector(
            SelectSelectorConfig(options=REGIONS, mode=SelectSelectorMode.DROPDOWN)
        )
        key = (
            vol.Required(CONF_REGION, default=suggested)
            if suggested
            else vol.Required(CONF_REGION)
        )
        return self.async_show_form(
            step_id="region",
            data_schema=vol.Schema({key: selector}),
            description_placeholders={"country": country or "not set"},
        )

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Handle a rejected API key or expired user hash."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask for the password again and mint a fresh user hash."""
        entry = self._get_reauth_entry()
        errors: dict[str, str] = {}

        if user_input is not None:
            merged = {
                CONF_API_KEY: user_input.get(CONF_API_KEY, entry.data[CONF_API_KEY]),
                CONF_USERNAME: entry.data[CONF_USERNAME],
                CONF_PASSWORD: user_input[CONF_PASSWORD],
            }
            user_hash = await self._async_try_credentials(merged, errors)
            if user_hash is not None:
                return self.async_update_reload_and_abort(
                    entry,
                    data_updates={
                        CONF_API_KEY: merged[CONF_API_KEY],
                        CONF_USER_HASH: user_hash,
                    },
                )

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_API_KEY, default=entry.data[CONF_API_KEY]): (
                        TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))
                    ),
                    vol.Required(CONF_PASSWORD): TextSelector(
                        TextSelectorConfig(type=TextSelectorType.PASSWORD)
                    ),
                }
            ),
            description_placeholders={"username": entry.data[CONF_USERNAME]},
            errors=errors,
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Let the user swap API key or Brickset account."""
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}

        if user_input is not None:
            user_hash = await self._async_try_credentials(user_input, errors)
            if user_hash is not None:
                await self.async_set_unique_id(user_input[CONF_USERNAME].lower())
                self._abort_if_unique_id_mismatch(reason="account_mismatch")
                return self.async_update_reload_and_abort(
                    entry,
                    data_updates={
                        CONF_API_KEY: user_input[CONF_API_KEY],
                        CONF_USERNAME: user_input[CONF_USERNAME],
                        CONF_USER_HASH: user_hash,
                    },
                )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=self.add_suggested_values_to_schema(
                STEP_USER_SCHEMA,
                {
                    CONF_API_KEY: entry.data[CONF_API_KEY],
                    CONF_USERNAME: entry.data[CONF_USERNAME],
                },
            ),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: Any) -> LegoOptionsFlow:
        """Return the options flow."""
        return LegoOptionsFlow()


class LegoOptionsFlow(OptionsFlow):
    """Handle LEGO options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage region, feeds, watchlist and polling budget."""
        entry = self.config_entry
        if user_input is not None:
            options = {
                CONF_REGION: user_input[CONF_REGION],
                CONF_THEMES: user_input.get(CONF_THEMES, []),
                CONF_WATCHLIST: [
                    number.strip()
                    for number in user_input.get(CONF_WATCHLIST, [])
                    if number.strip()
                ],
                CONF_COLLECTION_INTERVAL: int(user_input[CONF_COLLECTION_INTERVAL]),
                CONF_FEEDS_INTERVAL: int(user_input[CONF_FEEDS_INTERVAL]),
                CONF_DAILY_CALL_BUDGET: int(user_input[CONF_DAILY_CALL_BUDGET]),
                CONF_CATALOGUE: user_input[CONF_CATALOGUE],
                CONF_CATALOGUE_RICH: user_input[CONF_CATALOGUE_RICH],
            }
            return self.async_create_entry(data=options)

        options = entry.options
        themes = await self._async_theme_options()

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_REGION, default=options.get(CONF_REGION, DEFAULT_REGION)
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=REGIONS, mode=SelectSelectorMode.DROPDOWN
                    )
                ),
                vol.Optional(
                    CONF_THEMES, default=list(options.get(CONF_THEMES, []))
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=themes,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(
                    CONF_WATCHLIST, default=list(options.get(CONF_WATCHLIST, []))
                ): SelectSelector(
                    SelectSelectorConfig(options=[], multiple=True, custom_value=True)
                ),
                vol.Required(
                    CONF_COLLECTION_INTERVAL,
                    default=options.get(
                        CONF_COLLECTION_INTERVAL, DEFAULT_COLLECTION_INTERVAL_HOURS
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=MIN_INTERVAL_HOURS,
                        max=MAX_INTERVAL_HOURS,
                        step=1,
                        mode=NumberSelectorMode.BOX,
                        unit_of_measurement="h",
                    )
                ),
                vol.Required(
                    CONF_FEEDS_INTERVAL,
                    default=options.get(
                        CONF_FEEDS_INTERVAL, DEFAULT_FEEDS_INTERVAL_HOURS
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=MIN_INTERVAL_HOURS,
                        max=MAX_INTERVAL_HOURS,
                        step=1,
                        mode=NumberSelectorMode.BOX,
                        unit_of_measurement="h",
                    )
                ),
                vol.Required(
                    CONF_CATALOGUE,
                    default=options.get(CONF_CATALOGUE, DEFAULT_CATALOGUE),
                ): BooleanSelector(),
                vol.Required(
                    CONF_CATALOGUE_RICH,
                    default=options.get(CONF_CATALOGUE_RICH, DEFAULT_CATALOGUE_RICH),
                ): BooleanSelector(),
                vol.Required(
                    CONF_DAILY_CALL_BUDGET,
                    default=options.get(
                        CONF_DAILY_CALL_BUDGET, DEFAULT_DAILY_CALL_BUDGET
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=4, max=100, step=1, mode=NumberSelectorMode.BOX
                    )
                ),
            }
        )

        return self.async_show_form(
            step_id="init",
            data_schema=schema,
            description_placeholders={
                "estimated_calls": str(estimated_daily_calls(options)),
                "budget": str(
                    options.get(CONF_DAILY_CALL_BUDGET, DEFAULT_DAILY_CALL_BUDGET)
                ),
            },
        )

    async def _async_theme_options(self) -> list[str]:
        """Fetch the unbilled theme list, falling back to free text if it fails."""
        client = BricksetClient(
            async_get_clientsession(self.hass),
            self.config_entry.data[CONF_API_KEY],
            self.config_entry.data[CONF_USER_HASH],
        )
        try:
            return sorted(await client.get_themes())
        except BricksetError as err:
            _LOGGER.debug("Could not fetch Brickset themes: %s", err)
            return sorted(self.config_entry.options.get(CONF_THEMES, []))
