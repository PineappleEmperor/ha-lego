# Set catalogue (proposal)

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

| Mode | Cached | On disk | Enables |
|------|--------|---------|---------|
| Rich (default) | number, ID, name, year, theme, image | ~1.8 MB | search by name, autocomplete, thumbnails |
| Slim | number only | ~450 KB | exact-number validation |

Slim is not simply smaller: without names there is nothing to search, so
autocomplete degrades to exact set numbers. The setup option should say that rather
than describing it as a storage choice.

## Refresh

Weekly, with a conditional `GET` (`If-Modified-Since` / `ETag`) so an unchanged file
costs a round trip and no download.

Failure is non-fatal at every step: a failed download keeps the previous catalogue,
and an absent catalogue falls back to live lookups, which is exactly today's
behaviour. The catalogue is an optimisation, never a dependency.

## Search

A websocket command (`lego/search`) queries the in-memory index and returns matches
with number, name, year, theme and image. No entity is involved: 27,941 sets cannot
live in the state machine, and a `select` entity with that many options would wreck
the recorder.

This is what any dashboard autocomplete would call.

## Effect on the daily budget

| Action | Now | With catalogue |
|--------|-----|----------------|
| Add a set not already in your collection | 1 call | 0 |
| `lego.search_sets` | 1 call | 0 |
| Reject a malformed or unknown number | 1 call | 0 |
| Autocomplete while typing | impossible | 0 |
| Collection and theme polling | unchanged | unchanged |

Polling remains the only thing that spends quota.

## Open questions

- Should the catalogue be shared across config entries? It is account-independent,
  so one copy would do, but `Store` is naturally per-entry.
- Is a weekly refresh right, or should it follow the feeds interval?
- Do we need `themes.csv.gz` at all, given Brickset supplies theme names for the
  sets we actually track?
