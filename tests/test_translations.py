"""Checks that every translation key used in code actually resolves.

hassfest validates the shape of strings.json but never runs the integration, so
a typo'd translation_key passes CI and only shows up as a raw key in the UI.
"""

from __future__ import annotations

import json
from pathlib import Path
import re

import yaml

PACKAGE = Path("custom_components/lego")
STRINGS = json.loads((PACKAGE / "strings.json").read_text())
EN = json.loads((PACKAGE / "translations" / "en.json").read_text())

PY_FILES = sorted(PACKAGE.glob("*.py"))


def _source() -> str:
    """Return every Python source file concatenated."""
    return "\n".join(path.read_text() for path in PY_FILES)


def test_english_translations_match_strings() -> None:
    """translations/en.json is kept in step with strings.json."""
    assert EN == STRINGS


def test_exception_translation_keys_exist() -> None:
    """Every translation_key raised as an error has a message."""
    used = set(re.findall(r'translation_key="([a-z_]+)"', _source()))
    entity_keys = {key for platform in STRINGS["entity"].values() for key in platform}
    exception_keys = set(STRINGS["exceptions"])
    issue_keys = set(STRINGS["issues"])

    unresolved = used - entity_keys - exception_keys - issue_keys
    assert not unresolved, (
        f"translation keys with no entry in strings.json: {unresolved}"
    )


def test_entity_translation_keys_exist() -> None:
    """Every _attr_translation_key and description translation_key is defined."""
    used = set(re.findall(r'_attr_translation_key = "([a-z_]+)"', _source()))
    used |= set(re.findall(r'translation_key="([a-z_]+)",\n\s+state_class', _source()))

    defined = {key for platform in STRINGS["entity"].values() for key in platform}
    exception_keys = set(STRINGS["exceptions"])

    unresolved = used - defined - exception_keys
    assert not unresolved, (
        f"entity translation keys missing from strings.json: {unresolved}"
    )


def test_every_entity_string_has_an_icon() -> None:
    """icons.json covers every entity translation key."""
    icons = json.loads((PACKAGE / "icons.json").read_text())
    for platform, entries in STRINGS["entity"].items():
        assert set(entries) <= set(icons["entity"][platform]), (
            f"{platform} entities missing icons"
        )


def test_services_yaml_matches_strings() -> None:
    """Every action in strings.json exists in services.yaml, and vice versa."""
    services = yaml.safe_load((PACKAGE / "services.yaml").read_text())

    assert set(services) == set(STRINGS["services"])

    for name, definition in services.items():
        documented = STRINGS["services"][name]["fields"]
        assert set(definition.get("fields", {})) == set(documented), (
            f"field mismatch for action {name}"
        )


def test_service_icons_defined() -> None:
    """icons.json names an icon for every action."""
    icons = json.loads((PACKAGE / "icons.json").read_text())
    assert set(icons["services"]) == set(STRINGS["services"])
