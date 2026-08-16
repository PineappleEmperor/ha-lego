# skill-audit: local-tool
"""Fill a Brickset test account with sets that cover the shapes we parse.

The live API tests read whatever this account holds, so what goes in here
decides what they can prove. Each entry below exists because some field it
carries has bitten us, or because it exercises a branch the arithmetic takes.

Nothing here is billed: only getSets counts against the daily hundred, and this
writes through setCollection. Run it against the TEST account, never your own.

    python3 scripts/seed_test_account.py            # marks the sets
    python3 scripts/seed_test_account.py --dry-run   # prints what it would do
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from typing import Any

import aiohttp

API_BASE = "https://brickset.com/api/v3.asmx"


def _secret(prompt: str) -> str:
    """Read a credential, echoing a star per character.

    getpass shows nothing at all, so there is no way to tell whether a paste
    landed. An API key is as much a secret as the password and gets the same
    treatment.
    """
    if not sys.stdin.isatty():
        return input().strip()

    # Imported here, not at the top: both are POSIX only, and the piped path
    # above must keep working where they do not exist.
    import termios  # noqa: PLC0415
    import tty  # noqa: PLC0415

    fd = sys.stdin.fileno()
    saved = termios.tcgetattr(fd)
    value: list[str] = []
    sys.stderr.write(prompt)
    sys.stderr.flush()
    try:
        tty.setraw(fd)
        while (char := sys.stdin.read(1)) not in ("\r", "\n"):
            if char in ("\x7f", "\b"):
                if value:
                    value.pop()
                    sys.stderr.write("\b \b")
            elif char == "\x03":
                raise KeyboardInterrupt
            else:
                value.append(char)
                sys.stderr.write("*")
            sys.stderr.flush()
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, saved)
    sys.stderr.write("\n")
    return "".join(value)


# set number, what it proves, and the collection state to write
SEED: tuple[tuple[str, str, dict[str, Any]], ...] = (
    (
        "6876-1",
        (
            "1988, no LEGO.com price and no dates: the missing-price and "
            "unknown-countdown branches"
        ),
        {"own": 1, "qtyOwned": 1},
    ),
    (
        "10179-1",
        (
            "2007, long retired: a regional dateLastAvailable should exist "
            "here if it exists anywhere"
        ),
        {"own": 1, "qtyOwned": 1},
    ),
    (
        "10497-1",
        "owned twice, so sets_owned and sets_distinct must disagree",
        {"own": 1, "qtyOwned": 2},
    ),
    (
        "10305-1",
        "4515 pieces at a high RRP: the value and piece totals",
        {"own": 1, "qtyOwned": 1, "rating": 5},
    ),
    (
        "10343-1",
        "2025, still on sale: exitDate at the top level with no regional exit date",
        {"own": 1, "qtyOwned": 1},
    ),
    (
        "10294-1",
        "wanted, still on sale: the wishlist with a future retirement",
        {"want": 1, "wantedPriority": 1},
    ),
    (
        "10372-1",
        "wanted at a lower priority, so wantedPriority varies",
        {"want": 1, "wantedPriority": 3},
    ),
    (
        "21034-1",
        "wanted and retired, so the wishlist has something already gone",
        {"want": 1, "wantedPriority": 2},
    ),
)


async def _call(
    session: aiohttp.ClientSession, method: str, fields: dict[str, str]
) -> dict[str, Any]:
    """Post to a Brickset method and return the decoded payload."""
    async with session.post(f"{API_BASE}/{method}", data=fields) as response:
        response.raise_for_status()
        payload = await response.json(content_type=None)
    if payload.get("status") != "success":
        raise SystemExit(f"{method} failed: {payload.get('message')}")
    return payload


async def _resolve(
    session: aiohttp.ClientSession, api_key: str, numbers: list[str]
) -> dict[str, int]:
    """Map set numbers to Brickset IDs, which setCollection needs."""
    payload = await _call(
        session,
        "getSets",
        {
            "apiKey": api_key,
            "userHash": "",
            "params": json.dumps({"setNumber": ",".join(numbers), "pageSize": 100}),
        },
    )
    found = {}
    for record in payload.get("sets") or []:
        number = f"{record['number']}-{record.get('numberVariant', 1)}"
        found[number] = record["setID"]
    return found


def _credentials() -> tuple[str, str, str, str]:
    """Collect what the run needs before any event loop starts."""
    api_key = os.environ.get("BRICKSET_API_KEY") or _secret("Brickset API key: ")
    user_hash = os.environ.get("BRICKSET_USER_HASH") or ""
    username = password = ""
    if not user_hash:
        username = input("Test account username: ").strip()
        password = _secret("Test account password: ")
    return api_key, user_hash, username, password


async def _seed(
    api_key: str,
    user_hash: str,
    username: str,
    password: str,
    minifigs: str = "",
) -> None:
    """Resolve the set IDs and write each collection state."""
    async with aiohttp.ClientSession() as session:
        if not user_hash:
            login = await _call(
                session,
                "login",
                {"apiKey": api_key, "username": username, "password": password},
            )
            user_hash = str(login["hash"])
            print("logged in")

        ids = await _resolve(session, api_key, [number for number, _, _ in SEED])
        missing = [number for number, _, _ in SEED if number not in ids]
        if missing:
            print(f"not on Brickset, skipping: {', '.join(missing)}")

        for number, _, state in SEED:
            if number not in ids:
                continue
            await _call(
                session,
                "setCollection",
                {
                    "apiKey": api_key,
                    "userHash": user_hash,
                    "setID": str(ids[number]),
                    "params": json.dumps(state),
                },
            )
            print(f"  {number:10} {state}")

        for fig in (item.strip() for item in minifigs.split(",") if item.strip()):
            await _call(
                session,
                "setMinifigCollection",
                {
                    "apiKey": api_key,
                    "userHash": user_hash,
                    "minifigNumber": fig,
                    "params": json.dumps({"own": 1, "qtyOwned": 1}),
                },
            )
            print(f"  minifig {fig}")


def main() -> int:
    """Seed the account, or say what it would have done."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--minifigs",
        default="",
        help=(
            "Comma-separated Brickset minifig numbers to mark owned, e.g. sw0001. "
            "Nothing parses minifigs yet; seeding some is how the live tests learn "
            "the record shape. Find the numbers on a minifig's Brickset page."
        ),
    )
    args = parser.parse_args()

    if args.dry_run:
        for number, why, state in SEED:
            print(f"  {number:10} {state}")
            print(f"             {why}")
        print(f"\n{len(SEED)} sets. One billed call to resolve IDs, then none.")
        return 0

    asyncio.run(_seed(*_credentials(), minifigs=args.minifigs))
    print("\nDone. The live API tests now have something to read.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
