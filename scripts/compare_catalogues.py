#!/usr/bin/env python3
"""Measure how far Rebrickable's set list and Brickset's agree.

Spends two billed getSets calls, because setNumber accepts a comma-delimited list
of up to 500. Run before deciding whether a local catalogue is worth building:

    BRICKSET_API_KEY=... python3 scripts/compare_catalogues.py --year 2024

The key comes from the environment rather than an argument so it stays out of
shell history and process listings.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import io
import json
import os
import random
import re
import sys
import urllib.parse
import urllib.request

SETS_CSV = "https://cdn.rebrickable.com/media/downloads/sets.csv.gz"
API = "https://brickset.com/api/v3.asmx/getSets"
SAMPLE = 500


def fetch_rebrickable() -> dict[str, dict[str, str]]:
    """Download the Rebrickable set list."""
    headers = {"User-Agent": "ha-lego/compare"}
    request = urllib.request.Request(SETS_CSV, headers=headers)
    with urllib.request.urlopen(request, timeout=120) as response:
        raw = gzip.decompress(response.read()).decode("utf-8")
    rows = list(csv.DictReader(io.StringIO(raw)))
    return {row["set_num"]: row for row in rows}


def get_sets(api_key: str, params: dict[str, object]) -> tuple[int, list[dict]]:
    """Call getSets, returning Brickset's match count and the records."""
    body = urllib.parse.urlencode(
        {"apiKey": api_key, "userHash": "", "params": json.dumps(params)}
    ).encode()
    request = urllib.request.Request(API, data=body, headers={"User-Agent": "ha-lego"})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.loads(response.read().decode("utf-8"))
    if payload.get("status") != "success":
        sys.exit(f"Brickset error: {payload.get('message')}")
    return int(payload.get("matches") or 0), payload.get("sets") or []


def main() -> None:
    """Run both directions of the comparison."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, default=2024)
    parser.add_argument("--seed", type=int, default=1)
    args = parser.parse_args()

    api_key = os.environ.get("BRICKSET_API_KEY", "").strip()
    if not api_key:
        sys.exit("Set BRICKSET_API_KEY in the environment before running this.")

    print("Downloading Rebrickable set list...")
    rebrickable = fetch_rebrickable()
    numbered = [n for n in rebrickable if re.match(r"^\d+-\d+$", n)]
    print(f"  {len(rebrickable)} rows, {len(numbered)} matching NNNN-N\n")

    random.seed(args.seed)
    sample = random.sample(numbered, min(SAMPLE, len(numbered)))
    print(f"1. Does Brickset know Rebrickable's sets?  (sample of {len(sample)})")
    reported, records = get_sets(
        api_key, {"setNumber": ",".join(sample), "pageSize": SAMPLE}
    )
    found = {s["number"] for s in records}
    if reported > len(records):
        print(
            f"  NOTE: Brickset reports {reported} matches but returned "
            f"{len(records)} records; the response is truncated"
        )
    hit = sum(1 for n in sample if n.split("-")[0] in found or n in found)
    print(f"  Brickset returned {len(records)} records for {len(sample)} numbers")
    pct = hit / len(sample) * 100
    print(f"  {hit}/{len(sample)} present in Brickset  ({pct:.1f}%)")
    print("  misses here cost one wasted call each, same as today\n")

    print(f"2. Does Rebrickable know Brickset's sets?  (year {args.year})")
    _, year_sets = get_sets(api_key, {"year": args.year, "pageSize": SAMPLE})
    numbers = [s["number"] for s in year_sets]
    known = sum(1 for n in numbers if n in rebrickable or f"{n}-1" in rebrickable)
    if numbers:
        pct = known / len(numbers) * 100
        print(f"  {known}/{len(numbers)} present in Rebrickable  ({pct:.1f}%)")
        print(f"  this is the saving rate: {pct:.0f}% of lookups avoided")
    else:
        print("  no sets returned for that year")


if __name__ == "__main__":
    main()
