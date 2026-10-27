"""Checks that every translation key used in code actually resolves.

hassfest validates the shape of translations/en.json but never runs the integration, so
a typo'd translation_key passes CI and only shows up as a raw key in the UI.
"""

import ast
import json
from pathlib import Path
import re

import yaml

PACKAGE = Path("custom_components/lego")
STRINGS = json.loads((PACKAGE / "translations" / "en.json").read_text())

PY_FILES = sorted(PACKAGE.glob("*.py"))


def _source() -> str:
    """Return every Python source file concatenated."""
    return "\n".join(path.read_text() for path in PY_FILES)


def _passed_keys() -> dict[str, set[str]]:
    """Group every literal translation_key by the kind of call that passes it."""
    found: dict[str, set[str]] = {"exceptions": set(), "issues": set(), "entity": set()}
    for path in PY_FILES:
        for node in ast.walk(ast.parse(path.read_text())):
            if not isinstance(node, ast.Call):
                continue
            key = next(
                (
                    keyword.value.value
                    for keyword in node.keywords
                    if keyword.arg == "translation_key"
                    and isinstance(keyword.value, ast.Constant)
                ),
                None,
            )
            if key is None:
                continue
            func = node.func
            name = (
                func.attr
                if isinstance(func, ast.Attribute)
                else getattr(func, "id", "")
            )
            if name == "async_create_issue":
                found["issues"].add(key)
            elif name.endswith("Description"):
                found["entity"].add(key)
            else:
                found["exceptions"].add(key)
    return found


def test_exception_translation_keys_exist() -> None:
    """Every key an error is raised with has a message under exceptions."""
    # Each section is checked alone: a key defined only for an issue or an entity
    # would show the raw key where an error message belongs.
    used = _passed_keys()["exceptions"]
    assert used

    unresolved = used - set(STRINGS["exceptions"])
    assert not unresolved, f"errors with no message under exceptions: {unresolved}"


def test_issue_translation_keys_exist() -> None:
    """Every key a repair is raised with has its text under issues."""
    used = _passed_keys()["issues"]
    assert used

    unresolved = used - set(STRINGS["issues"])
    assert not unresolved, f"repairs with no text under issues: {unresolved}"


def test_entity_translation_keys_exist() -> None:
    """Every _attr_translation_key and description translation_key is defined."""
    used = set(re.findall(r'_attr_translation_key = "([a-z_]+)"', _source()))
    used |= set(re.findall(r'translation_key="([a-z_]+)",\n\s+state_class', _source()))

    defined = {key for platform in STRINGS["entity"].values() for key in platform}
    exception_keys = set(STRINGS["exceptions"])

    unresolved = used - defined - exception_keys
    assert not unresolved, (
        f"entity translation keys missing from translations/en.json: {unresolved}"
    )


def test_every_entity_string_has_an_icon() -> None:
    """icons.json covers every entity translation key."""
    icons = json.loads((PACKAGE / "icons.json").read_text())
    for platform, entries in STRINGS["entity"].items():
        assert set(entries) <= set(icons["entity"][platform]), (
            f"{platform} entities missing icons"
        )


def test_services_yaml_matches_strings() -> None:
    """Every action in translations/en.json exists in services.yaml, and vice versa."""
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
