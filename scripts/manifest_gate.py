#!/usr/bin/env python3
"""Check that manifest.json's version was bumped correctly for a PR.

Compares the manifest version against the last *published* release and asserts
the bump matches the PR's release label. Pure functions so CI behaviour can be
unit tested; the CLI is a thin wrapper.

    python3 scripts/manifest_gate.py --released 0.3.1 --labels feature
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

MANIFEST = Path("custom_components/lego/manifest.json")

MAJOR_LABELS = {"breaking", "major"}
MINOR_LABELS = {"feature", "enhancement", "minor"}

_VERSION_RE = re.compile(
    r"^v?(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)"
    r"(?:-(?P<pre>[0-9A-Za-z.-]+))?$"
)


class VersionError(ValueError):
    """Raised when a version string cannot be parsed."""


def parse_version(value: str) -> tuple[int, int, int, str | None]:
    """Parse a semver string, tolerating a leading v and a prerelease suffix."""
    match = _VERSION_RE.match(value.strip())
    if match is None:
        raise VersionError(f"Not a semver version: {value!r}")
    return (
        int(match["major"]),
        int(match["minor"]),
        int(match["patch"]),
        match["pre"],
    )


def expected_bump(labels: set[str]) -> str:
    """Return the bump a set of PR labels requires."""
    lowered = {label.lower() for label in labels}
    if lowered & MAJOR_LABELS:
        return "major"
    if lowered & MINOR_LABELS:
        return "minor"
    return "patch"


def actual_bump(released: str, candidate: str) -> str:
    """Return the bump between two versions."""
    r_major, r_minor, r_patch, _ = parse_version(released)
    c_major, c_minor, c_patch, _ = parse_version(candidate)

    if (c_major, c_minor, c_patch) <= (r_major, r_minor, r_patch):
        return "none"
    if c_major > r_major:
        return "major"
    if c_minor > r_minor:
        return "minor"
    if c_patch > r_patch:
        return "patch"
    return "none"


def check(released: str, candidate: str, labels: set[str]) -> str | None:
    """Return an error message, or None when the bump is acceptable.

    A larger bump than the labels require is fine; a smaller one is not.
    """
    order = {"none": 0, "patch": 1, "minor": 2, "major": 3}
    wanted = expected_bump(labels)
    got = actual_bump(released, candidate)
    if got == "none":
        return (
            f"manifest.json is still {candidate}, but {released} is already "
            "released. Bump the version as the last commit before merge."
        )
    if order[got] < order[wanted]:
        return (
            f"Labels require a {wanted} bump but {released} -> {candidate} is "
            f"only a {got} bump."
        )
    return None


def manifest_version(path: Path = MANIFEST) -> str:
    """Read the version out of manifest.json."""
    return str(json.loads(path.read_text())["version"])


def main() -> int:
    """Run the gate."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--released", required=True, help="Last published release")
    parser.add_argument("--labels", default="", help="Comma separated PR labels")
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    args = parser.parse_args()

    candidate = manifest_version(args.manifest)
    labels = {label.strip() for label in args.labels.split(",") if label.strip()}

    if (error := check(args.released, candidate, labels)) is not None:
        print(f"::error::{error}")
        return 1

    print(f"Version gate OK: {args.released} -> {candidate}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
