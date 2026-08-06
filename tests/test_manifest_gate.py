"""Tests for the CI version gate."""

from __future__ import annotations

import json
from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from manifest_gate import (
    VersionError,
    actual_bump,
    check,
    expected_bump,
    manifest_version,
    parse_version,
)


def test_parse_version() -> None:
    assert parse_version("v1.2.3") == (1, 2, 3, None)
    assert parse_version("1.2.3-beta.1") == (1, 2, 3, "beta.1")
    with pytest.raises(VersionError):
        parse_version("not-a-version")


@pytest.mark.parametrize(
    ("labels", "expected"),
    [
        ({"breaking"}, "major"),
        ({"feature"}, "minor"),
        ({"enhancement", "documentation"}, "minor"),
        ({"fix"}, "patch"),
        (set(), "patch"),
    ],
)
def test_expected_bump(labels: set[str], expected: str) -> None:
    assert expected_bump(labels) == expected


@pytest.mark.parametrize(
    ("released", "candidate", "expected"),
    [
        ("1.0.0", "2.0.0", "major"),
        ("1.0.0", "1.1.0", "minor"),
        ("1.0.0", "1.0.1", "patch"),
        ("1.0.0", "1.0.0", "none"),
        ("1.2.0", "1.1.9", "none"),
    ],
)
def test_actual_bump(released: str, candidate: str, expected: str) -> None:
    assert actual_bump(released, candidate) == expected


def test_check_requires_a_bump() -> None:
    error = check("0.1.0", "0.1.0", set())
    assert error is not None
    assert "already released" in error


def test_check_rejects_too_small_a_bump() -> None:
    error = check("0.1.0", "0.1.1", {"feature"})
    assert error is not None
    assert "minor bump" in error


def test_check_allows_a_larger_bump_than_required() -> None:
    assert check("0.1.0", "1.0.0", {"fix"}) is None


def test_check_accepts_a_matching_bump() -> None:
    assert check("0.1.0", "0.2.0", {"feature"}) is None
    assert check("v0.1.0", "0.1.1", {"fix"}) is None


def test_manifest_version_matches_the_packaged_manifest() -> None:
    """The gate reads the same file hassfest and HACS read."""
    path = Path("custom_components/lego/manifest.json")
    assert manifest_version(path) == json.loads(path.read_text())["version"]
