# Set catalogue

A local index of every LEGO set, so that naming a set costs nothing.

Brickset bills 100 `getSets` calls per key per day. Today, turning "10497-1" into a
set ID costs one of them, which puts a hard ceiling on anything interactive: search,
autocomplete, or a dashboard where somebody types a set number. A local catalogue
removes that ceiling entirely.

## Source

Rebrickable publishes the full set list as a nightly CSV, free and without an API
key. Measured 2026-08-06:

| | |
|---|---|
| URL | `https://cdn.rebrickable.com/media/downloads/sets.csv.gz` |
| Size | 511 KB gzipped, 2.68 MB raw |
| Rows | 27,941 |
| Fields | `set_num, name, year, theme_id, num_parts, img_url` |
| Themes | `themes.csv.gz`, needed to resolve `theme_id` |
| Brickset API calls | none |

Their terms: *"You can use these files for any purpose. If you publish any articles
please let us know and maybe we can help promote it."* No attribution is required;
the README credits them regardless.

The `/downloads/` page sits behind Cloudflare and refuses non-browser clients, but
the CDN paths themselves serve fine.

## Gear and books are not sets

Rebrickable numbers keyrings, lunchboxes, pencil cases and storybooks exactly
like sets, and files them under top-level `Gear` and `Books` themes. Measured
2026-08-07:

| | Count |
|---|---|
| `NNNN-N` entries | 25,359 |
| under `Gear` or `Books` | 6,376 (25.1%) |
| remaining | 18,983 |

They are the bulk of the 18% of Rebrickable numbers Brickset does not carry,
because Brickset catalogues sets rather than merchandise. Excluding both themes
at seed time keeps the catalogue a quarter smaller and stops autofill offering a
keyring when someone types a number.

Filter on the theme, not on part count: 1,685 legitimate sets have a single part
(a minifigure, a promotional brick), and dropping those would lose real records.

## What it is not

The catalogue is Rebrickable's, and the integration's data is Brickset's. They
mostly agree — 90.7% of `set_num` values match `NNNN-N` — but not entirely:
Rebrickable indexes books and gear (`0003977811-1`) that Brickset may not, and
either may carry a set the other lacks.

So a hit is a strong hint, never a guarantee. Every path that resolves a set must
still fall back to a live `getSets` lookup on a miss, and treat the catalogue purely
as a way to avoid *wasting* calls, never as the source of truth for what Brickset
knows.

The catalogue holds set identity only. Owned, wanted, quantity and rating stay with
the coordinator, refreshed from Brickset.

### Rebrickable carries no Brickset set ID

Writes go to `setCollection`, which takes a Brickset `setID` — an integer that exists
nowhere in Rebrickable's data. So the CSV alone cannot make a write free; it can only
answer *does this number exist* and *what is it called*.

The IDs come from records already fetched for another reason. Every collection and
feed poll returns hundreds of sets carrying both the number and the `setID`, so the
catalogue harvests the pairing from each poll and keeps it beside the index. Costs no
calls, and makes a repeat write on any set the account has seen free.

A number never returned by a poll still costs one lookup, exactly as before.

### A miss must never reject

The two failure directions are not equal:

| | Consequence |
|---|---|
| In Rebrickable, absent from Brickset | The lookup we skipped happens anyway. Costs one call, exactly as today. |
| In Brickset, absent from Rebrickable | Only a bug **if a miss blocks**. If a miss means "ask Brickset", it costs nothing but the saving. |

So the catalogue may confirm, never veto. Malformed input (`hello world`) is rejected
on format alone; a well-formed number the catalogue has not heard of goes to
Brickset. Divergence then affects only how much quota is saved.

### Validating the overlap before building

The saving is only worth the machinery if the datasets agree, and that is measurable
for two billed calls, because `getSets` accepts a comma-delimited `setNumber` list of
up to 500:

Run it with the key in the environment, never as an argument:

```bash
BRICKSET_API_KEY=... python3 scripts/compare_catalogues.py --year 2024
```

1. **Brickset knows Rebrickable's sets?** Sample 500 random `set_num` values from the
   CSV, request them in one `getSets` call, count how many return. Estimates the
   false-positive rate.
2. **Rebrickable knows Brickset's sets?** Pull one year with
   `getSets{year: <recent>, pageSize: 500}`, then check those numbers against the CSV
   locally. Estimates the false-negative rate, which is the one that erodes the
   saving.

Two calls, a few thousand sets sampled. If the overlap is poor, the catalogue is not
worth building and the existing per-lookup cost stands.

## Storage

Held in a `homeassistant.helpers.storage.Store`, loaded into memory at startup.
The harvested Brickset IDs are stored alongside, and survive a change of mode.

| Mode | Cached | Enables |
|------|--------|---------|
| Rich (default) | number, name, year, root theme | search by name, autocomplete |
| Slim | number only | exact-number validation |

Slim is not simply smaller: without names there is nothing to search, so
autocomplete degrades to exact set numbers. The setup option says that rather than
describing it as a storage choice. Changing mode discards the index and re-seeds,
because the rows themselves differ.

## Refresh

Weekly by default, configurable from 1 to 90 days. Seeding happens in a background
task, so a first setup does not wait on half a megabyte.

Measured 2026-08-11:

| | |
|---|---|
| `Last-Modified` | rebuilt nightly |
| Growth | +24 rows over 5 days, so roughly 5 sets a day |
| `ETag` | `"6a79f7df-7cdb4"` — nginx `hex(mtime)-hex(size)` |
| Conditional `GET` | returns `304` when the file has not been rebuilt |

The `ETag` is derived from the modification time, not the content, so it changes
on every nightly rebuild whether or not any set changed. A conditional `GET` still
costs nothing when they skip a night, but it cannot be relied on to avoid the
download. Weekly is therefore ~511 KB a week; daily would be seven times that, to
save at most a handful of billed lookups.

### There is no delta to fetch

Three separate reasons, all measured:

| | |
|---|---|
| Range requests | Supported — `Accept-Ranges: bytes`, a `206` confirmed |
| gzip structure | **Single member.** One deflate stream, so a byte suffix cannot be decompressed without the preceding 2.7 MB |
| Row order | Roughly lexicographic by `set_num`, not append-ordered — new sets are inserted throughout, so there is no contiguous "new" region to fetch |

Rebrickable publishes full snapshots only; there is no incremental feed. Their REST
API can filter by year, but it needs a per-user key, which is the registration this
whole approach exists to avoid.

So a refresh is a full download or nothing. That is the reason the interval is a
user option, and why `lego.refresh_catalogue` exists — when a set is missing and
you would rather not wait for the schedule, the honest answer is to fetch the file
again.

### A Rebrickable API key would not fix this

Checked against their OpenAPI spec, 2026-08-11. `/api/v3/lego/sets/` accepts
`page`, `page_size`, `theme_id`, `min_year`, `max_year`, `min_parts`, `max_parts`,
`ordering` and `search`. There is **no** modified-since filter, so a key buys no
delta endpoint.

`min_year` does allow a cheap top-up — 1,227 sets dated 2026 and 3 dated 2027, so
the current and next year is 4.4% of the catalogue in two requests at
`page_size=1000`. But it misses retroactive edits to older records, and the rate
limit is one request a second, so anything broader is slower than fetching the
whole file.

Not worth taking. The index currently asks the user for no account at all, and a
key requirement is a poor trade for ~470 KB a week. If the planned MOC entry lands
and a key exists anyway, a `min_year` top-up could be added opportunistically —
never as a requirement. See [sources.md](sources.md).

Failure is non-fatal at every step: a failed download keeps the previous catalogue,
and an absent catalogue falls back to live lookups, which is exactly today's
behaviour. The catalogue is an optimisation, never a dependency.

## Search

A websocket command (`lego/search`) queries the in-memory index and returns matches
with number, name, year, theme and whether the account already owns it. Numbers
starting with the query rank above names containing it. No entity is involved:
27,941 sets cannot live in the state machine, and a `select` entity with that many
options would wreck the recorder.

This is what any dashboard autocomplete calls.

## Effect on the daily budget

| Action | Now | With catalogue |
|--------|-----|----------------|
| Write to a set any poll has returned | 1 call | 0 |
| Write to a set never seen | 1 call | 1 call |
| Reject a number that is not a set | 1 call | 0 |
| Autocomplete while typing | impossible | 0 |
| Collection and theme polling | unchanged | unchanged |

Polling remains the only thing that reliably spends quota.

## Decisions

- **One store per entry.** The index is account-independent, so a shared copy would
  save disk, but the harvested Brickset IDs are not — they come from that account's
  polls. Splitting the two stores buys little and costs a migration.
- **Weekly, not the feeds interval.** New sets appear in Rebrickable in batches, and
  a miss only forfeits a saving.
- **`themes.csv.gz` is needed.** Brickset names themes for the sets already tracked;
  the exclusion of `Gear` and `Books` applies to every other row, which is the point.
