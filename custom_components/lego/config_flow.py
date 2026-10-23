"""Config, reauth, reconfigure and options flows for the LEGO integration."""

from collections.abc import Mapping
from datetime import date
import logging
import math
from typing import TYPE_CHECKING, Any, cast, override

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigEntryState,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.const import CONF_API_KEY, CONF_PASSWORD, CONF_REGION, CONF_USERNAME
from homeassistant.core import HomeAssistant, callback
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
from homeassistant.util import dt as dt_util
import probatio

from .api import BricksetClient
from .const import (
    CONF_CATALOGUE,
    CONF_CATALOGUE_INTERVAL,
    CONF_CATALOGUE_RICH,
    CONF_DAILY_CALL_BUDGET,
    CONF_PANEL,
    CONF_RELEASES,
    CONF_THEMES,
    CONF_USER_HASH,
    COUNTRY_TO_REGION,
    DEFAULT_CATALOGUE,
    DEFAULT_CATALOGUE_INTERVAL_DAYS,
    DEFAULT_CATALOGUE_RICH,
    DEFAULT_DAILY_CALL_BUDGET,
    DEFAULT_PANEL,
    DEFAULT_REGION,
    DEFAULT_RELEASES,
    DOMAIN,
    MAX_CATALOGUE_INTERVAL_DAYS,
    MIN_CATALOGUE_INTERVAL_DAYS,
    MIN_COLLECTION_POLL_COST,
    REGIONS,
)
from .exceptions import (
    BricksetAuthError,
    BricksetConnectionError,
    BricksetError,
    BricksetUserHashError,
)
from .quota import collection_interval, feeds_calls_per_day

if TYPE_CHECKING:
    from .coordinator import LegoConfigEntry

_LOGGER = logging.getLogger(__name__)

STEP_USER_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_API_KEY): TextSelector(
            TextSelectorConfig(type=TextSelectorType.PASSWORD)
        ),
        probatio.Required(CONF_USERNAME): TextSelector(),
        probatio.Required(CONF_PASSWORD): TextSelector(
            TextSelectorConfig(type=TextSelectorType.PASSWORD)
        ),
    }
)


def _feeds_calls(
    options: Mapping[str, Any], today: date, feeds_cost: int | None
) -> int:
    """Return the calls a day the feeds spend under a set of options."""
    return feeds_calls_per_day(
        bool(options.get(CONF_THEMES)),
        bool(options.get(CONF_RELEASES, DEFAULT_RELEASES)),
        today,
        feeds_cost,
    )


def collection_hours(
    options: Mapping[str, Any],
    poll_cost: int = MIN_COLLECTION_POLL_COST,
    today: date | None = None,
    feeds_cost: int | None = None,
) -> int:
    """Return the hours between collection polls that a set of options yields."""
    today = today or dt_util.now().date()
    interval = collection_interval(
        options.get(CONF_DAILY_CALL_BUDGET, DEFAULT_DAILY_CALL_BUDGET),
        poll_cost,
        _feeds_calls(options, today, feeds_cost),
    )
    return int(interval.total_seconds() // 3600)


def estimated_daily_calls(
    options: Mapping[str, Any],
    poll_cost: int = MIN_COLLECTION_POLL_COST,
    today: date | None = None,
    feeds_cost: int | None = None,
) -> int:
    """Estimate billed getSets calls per day for a set of options."""
    # feeds_cost is what the last feeds poll measured, when one has run; before
    # that the feeds are estimated.
    today = today or dt_util.now().date()
    collection_polls = math.ceil(
        24 / collection_hours(options, poll_cost, today, feeds_cost)
    )
    return collection_polls * poll_cost + _feeds_calls(options, today, feeds_cost)


async def _validate(
    hass: HomeAssistant, api_key: str, username: str, password: str
) -> str:
    """Validate credentials and return a user hash."""
    client = BricksetClient(async_get_clientsession(hass), api_key)
    await client.check_key()
    return await client.login(username, password)


class LegoConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for LEGO."""

    VERSION = 2

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

    @override
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
            # New entries get the all-themes release rows; entries from before
            # they existed keep the default, so an upgrade spends no new calls.
            options={CONF_REGION: region, CONF_RELEASES: True},
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
            probatio.Required(CONF_REGION, default=suggested)
            if suggested
            else probatio.Required(CONF_REGION)
        )
        return self.async_show_form(
            step_id="region",
            data_schema=probatio.Schema({key: selector}),
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
            data_schema=probatio.Schema(
                {
                    probatio.Required(CONF_API_KEY, default=entry.data[CONF_API_KEY]): (
                        TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))
                    ),
                    probatio.Required(CONF_PASSWORD): TextSelector(
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
    @override
    def async_get_options_flow(config_entry: ConfigEntry) -> LegoOptionsFlow:
        """Return the options flow."""
        return LegoOptionsFlow()


class LegoOptionsFlow(OptionsFlowWithReload):
    """Handle LEGO options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage region, feeds, the panel, the set index and the call budget."""
        entry = self.config_entry
        if user_input is not None:
            new_options = {
                CONF_REGION: user_input[CONF_REGION],
                CONF_THEMES: user_input.get(CONF_THEMES, []),
                CONF_DAILY_CALL_BUDGET: int(user_input[CONF_DAILY_CALL_BUDGET]),
                CONF_PANEL: user_input[CONF_PANEL],
                CONF_RELEASES: user_input[CONF_RELEASES],
                CONF_CATALOGUE: user_input[CONF_CATALOGUE],
                CONF_CATALOGUE_RICH: user_input[CONF_CATALOGUE_RICH],
                CONF_CATALOGUE_INTERVAL: int(user_input[CONF_CATALOGUE_INTERVAL]),
            }
            return self.async_create_entry(data=new_options)

        options = entry.options
        themes = await self._async_theme_options()

        schema = probatio.Schema(
            {
                probatio.Required(
                    CONF_REGION, default=options.get(CONF_REGION, DEFAULT_REGION)
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=REGIONS, mode=SelectSelectorMode.DROPDOWN
                    )
                ),
                probatio.Optional(
                    CONF_THEMES, default=list(options.get(CONF_THEMES, []))
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=themes,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                probatio.Required(
                    CONF_PANEL, default=options.get(CONF_PANEL, DEFAULT_PANEL)
                ): BooleanSelector(),
                probatio.Required(
                    CONF_RELEASES,
                    default=options.get(CONF_RELEASES, DEFAULT_RELEASES),
                ): BooleanSelector(),
                probatio.Required(
                    CONF_CATALOGUE,
                    default=options.get(CONF_CATALOGUE, DEFAULT_CATALOGUE),
                ): BooleanSelector(),
                probatio.Required(
                    CONF_CATALOGUE_RICH,
                    default=options.get(CONF_CATALOGUE_RICH, DEFAULT_CATALOGUE_RICH),
                ): BooleanSelector(),
                probatio.Required(
                    CONF_CATALOGUE_INTERVAL,
                    default=options.get(
                        CONF_CATALOGUE_INTERVAL, DEFAULT_CATALOGUE_INTERVAL_DAYS
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=MIN_CATALOGUE_INTERVAL_DAYS,
                        max=MAX_CATALOGUE_INTERVAL_DAYS,
                        step=1,
                        mode=NumberSelectorMode.BOX,
                        unit_of_measurement="d",
                    )
                ),
                probatio.Required(
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
                "collection_hours": str(
                    collection_hours(
                        options, self._poll_cost, feeds_cost=self._feeds_cost
                    )
                ),
                "estimated_calls": str(
                    estimated_daily_calls(
                        options, self._poll_cost, feeds_cost=self._feeds_cost
                    )
                ),
                "budget": str(
                    options.get(CONF_DAILY_CALL_BUDGET, DEFAULT_DAILY_CALL_BUDGET)
                ),
            },
        )

    @property
    def _poll_cost(self) -> int:
        """Return what a collection poll costs now, or the minimum if not loaded."""
        entry = self.config_entry
        if entry.state is not ConfigEntryState.LOADED:
            return MIN_COLLECTION_POLL_COST
        return cast("LegoConfigEntry", entry).runtime_data.collection.poll_cost

    @property
    def _feeds_cost(self) -> int | None:
        """Return what the last feeds poll measured, if one has run."""
        entry = self.config_entry
        if entry.state is not ConfigEntryState.LOADED:
            return None
        return cast("LegoConfigEntry", entry).runtime_data.feeds.measured_cost

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
