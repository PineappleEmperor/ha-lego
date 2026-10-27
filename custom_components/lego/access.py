"""Which Home Assistant users may use which Brickset account."""

from typing import Any

from homeassistant.auth.models import User
from homeassistant.auth.permissions.const import POLICY_CONTROL
from homeassistant.config_entries import ConfigEntry

from .const import CONF_SHARED, CONF_USERS, DEFAULT_SHARED


def linked_users(entry: ConfigEntry[Any]) -> list[str]:
    """Return the ids of the users this account belongs to."""
    return list(entry.options.get(CONF_USERS, []))


def is_shared(entry: ConfigEntry[Any]) -> bool:
    """Whether every user may use this account."""
    return bool(entry.options.get(CONF_SHARED, DEFAULT_SHARED))


def is_linked(entry: ConfigEntry[Any], user: User) -> bool:
    """Whether this account is one of the user's own, not merely open to them."""
    return user.id in linked_users(entry)


def can_view(entry: ConfigEntry[Any], user: User | None) -> bool:
    """Whether this user may see this account."""
    # No user means an automation or a script, which an admin set up.
    if user is None or user.is_admin or is_shared(entry):
        return True
    return is_linked(entry, user)


def can_change(entry: ConfigEntry[Any], user: User | None) -> bool:
    """Whether this user may write to this account."""
    # A read-only user may look at an account of their own but not change it.
    return can_view(entry, user) and (
        user is None or user.permissions.access_all_entities(POLICY_CONTROL)
    )
