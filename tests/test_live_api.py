"""Contract tests against the real Brickset API.

Every assumption checked here has already been wrong once. The set-wide exit
date, the comma-separated theme and the extra collection fields were all found
by reading a live payload, not the docs, because Brickset publishes no schema
for the getSets response. A fixture cannot catch a vendor changing shape, since
it only ever confirms what we already believed.

Two sources of sets, for two different reasons. The test account's own owned and
wanted lists exercise the queries the coordinator actually makes, and every set
returned is checked rather than a sample, which costs the same. A random handful
drawn from the Rebrickable index then reaches sets no account would hold: 1990
releases, obscure themes, records with almost nothing filled in. The seed is
printed so a failure can be reproduced exactly.

Marked live, excluded from the default run, and gated in CI behind an
environment that needs a human approval. Four billed calls per run: owned,
wanted, the catalogue sample and the theme batch.
"""

from __future__ import annotations

import csv
import gzip
import io
import json
import os
import random
from typing import Any

import aiohttp
import pytest

from custom_components.lego.api import API_BASE, BricksetClient
from custom_components.lego.const import SETS_CSV_URL

pytestmark = [
    pytest.mark.live,
    pytest.mark.skipif(
        not (
            os.environ.get("BRICKSET_API_KEY") and os.environ.get("BRICKSET_USER_HASH")
        ),
        reason="needs BRICKSET_API_KEY and BRICKSET_USER_HASH",
    ),
]

CATALOGUE_SAMPLE = 8
THEMES = ("Technic", "Icons")


def _seed() -> int:
    """Return the sample seed, printed so a red run can be reproduced."""
    seed = int(os.environ.get("LIVE_SAMPLE_SEED") or random.randrange(1, 10**9))
    # Printed, not logged: a red run is useless if the sample cannot be repeated.
    print(f"\nsample seed: {seed}  (set LIVE_SAMPLE_SEED={seed} to repeat)")  # noqa: T201
    return seed


async def _post(
    session: aiohttp.ClientSession, method: str, params: dict[str, Any]
) -> dict[str, Any]:
    """Call a Brickset method and return the raw payload, unparsed."""
    async with session.post(
        str(API_BASE / method),
        data={
            "apiKey": os.environ["BRICKSET_API_KEY"],
            "userHash": os.environ["BRICKSET_USER_HASH"],
            "params": json.dumps(params),
        },
    ) as response:
        response.raise_for_status()
        payload = await response.json(content_type=None)

    assert payload.get("status") == "success", payload.get("message")
    return payload


def _assert_shape(records: list[dict[str, Any]], source: str) -> None:
    """Check every field the integration reads, naming the set that broke."""
    for record in records:
        number = f"{record.get('number')}-{record.get('numberVariant')}"
        where = f"{source} {number}"

        for key in ("setID", "number", "numberVariant", "name", "year", "theme"):
            assert key in record, f"{where} has no {key}"

        regions = record.get("LEGOCom") or {}
        regional_exit = [
            payload.get("dateLastAvailable")
            for payload in regions.values()
            if isinstance(payload, dict)
        ]
        # Retirement drives the countdowns, so it has to be readable from one
        # place or the other. Brickset omits the regional date more often than not.
        assert "exitDate" in record or any(regional_exit), (
            f"{where} publishes no exit date at the top level and none per region"
        )


async def test_the_account_collection_keeps_its_shape() -> None:
    """The owned and wanted queries are what every poll runs."""
    async with aiohttp.ClientSession() as session:
        owned = await _post(session, "getSets", {"owned": 1, "extendedData": 1})
        wanted = await _post(session, "getSets", {"wanted": 1, "extendedData": 1})

    owned_sets = owned.get("sets") or []
    wanted_sets = wanted.get("sets") or []
    if not owned_sets and not wanted_sets:
        pytest.skip(
            "the test account owns and wants nothing, so there is no shape to check; "
            "add a few sets to it, ideally one long retired and one still on sale"
        )

    _assert_shape(owned_sets, "owned")
    _assert_shape(wanted_sets, "wanted")

    for record in owned_sets + wanted_sets:
        collection = record.get("collection") or {}
        for key in ("owned", "wanted", "qtyOwned", "qtyWanted", "wantedPriority"):
            assert key in collection, (
                f"{record.get('number')} no longer carries collection.{key}"
            )


async def test_a_random_slice_of_the_catalogue_keeps_its_shape() -> None:
    """Sets an account would never hold are where odd records hide."""
    async with aiohttp.ClientSession() as session:
        async with session.get(SETS_CSV_URL) as response:
            response.raise_for_status()
            raw = await response.read()

        numbers = [
            row["set_num"]
            for row in csv.DictReader(io.StringIO(gzip.decompress(raw).decode()))
        ]
        chosen = random.Random(_seed()).sample(numbers, CATALOGUE_SAMPLE)
        print(f"sampled: {', '.join(chosen)}")  # noqa: T201

        payload = await _post(
            session, "getSets", {"setNumber": ",".join(chosen), "extendedData": 1}
        )

    records = payload.get("sets") or []
    # The two catalogues do not hold identical sets, so a miss is expected and
    # only a total miss means the query itself stopped working.
    assert records, f"Brickset returned nothing for any of {chosen}"
    _assert_shape(records, "catalogue")


async def test_theme_still_accepts_a_comma_separated_list() -> None:
    """The feed poll is one call because of this; losing it silently costs N."""
    async with aiohttp.ClientSession() as session:
        client = BricksetClient(session, os.environ["BRICKSET_API_KEY"])
        sets = await client.get_sets(
            {"theme": ",".join(THEMES), "pageSize": 100, "orderBy": "Theme"}
        )

    returned = {lego_set.theme for lego_set in sets}
    assert returned >= set(THEMES), (
        f"asked for {THEMES} and got {sorted(returned)}; batching has changed, so "
        "the feed coordinator is silently paying one call per theme"
    )


async def test_the_minifig_collection_keeps_its_shape() -> None:
    """Nothing parses minifigs yet, so this records the shape a feature would read.

    Brickset splits ownership into what came inside owned sets and what was
    bought loose, which is a truer count than the minifig slots this integration
    currently sums from set records. It also lowercases the number it echoes
    back, so anything matching on it has to fold case.
    """
    async with aiohttp.ClientSession() as session:
        payload = await _post(session, "getMinifigCollection", {"owned": 1})

    figs = payload.get("minifigs") or []
    print(f"\nminifigs owned: {payload.get('matches')}")  # noqa: T201
    if not figs:
        pytest.skip(
            "the test account owns no minifigs, so there is no record to check; "
            "seed one with setMinifigCollection and a Brickset minifig number"
        )

    print(f"record keys: {sorted(figs[0])}")  # noqa: T201
    for key in (
        "minifigNumber",
        "name",
        "category",
        "ownedInSets",
        "ownedLoose",
        "ownedTotal",
        "wanted",
    ):
        assert key in figs[0], f"the minifig record no longer carries {key}"

    for fig in figs:
        assert fig["minifigNumber"] == fig["minifigNumber"].lower(), (
            "Brickset used to echo the number in lower case; matching depends on it"
        )
        assert fig["ownedTotal"] == fig["ownedInSets"] + fig["ownedLoose"], (
            f"{fig['minifigNumber']}: ownedTotal no longer sums the two halves"
        )
