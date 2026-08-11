# LEGO for Home Assistant

<img src="custom_components/lego/brand/logo.png" alt="LEGO integration logo" width="320">

Track your LEGO collection in Home Assistant, using [Brickset](https://brickset.com) as
the data source. Collection totals, a value estimate, new-release feeds for the themes
you care about, retirement countdowns, and calendars for releases, retirements and set
anniversaries.

> [!IMPORTANT]
> This project is **not affiliated with, authorised by, or endorsed by the LEGO Group**.
> LEGO® is a trademark of the LEGO Group. All set data comes from
> [Brickset.com](https://brickset.com) via their public API, and every set links back to
> its Brickset page. No affiliate or referral links are used anywhere in this
> integration.

> [!NOTE]
> **AI assistance:** I'm a programmer; this project is built with AI (Claude, via Claude
> Code) for implementation, code review, and QA — under human direction, guided by my
> [`ha-integration`](https://github.com/PineappleEmperor/pineapple-claude-hacs) skill.
> Architecture and final review are mine; every change is human-reviewed before it
> merges.

## Use cases

- Put "sets owned", "pieces owned" and "collection value" on a dashboard.
- Get a notification when a new set appears in a theme you follow.
- Get a warning 30 days before a set on your wishlist retires from LEGO.com.
- See release and retirement dates as a calendar next to the rest of your household's.
- Mark a set as owned from a dashboard button the moment you finish building it.

## Supported services

| Source | What it provides |
|--------|------------------|
| Brickset API v3 | Owned/wanted collection, set catalogue, LEGO.com RRP and availability dates, collection writes |
| Rebrickable set list | The public CSV of every LEGO set, used as a local index so searching and checking a set number costs no Brickset calls |

## Installation

### HACS (recommended)

1. In HACS, choose **Integrations → ⋮ → Custom repositories**.
2. Add `https://github.com/PineappleEmperor/ha-lego` as an **Integration**.
3. Install **LEGO**, then restart Home Assistant.

### Manual

Copy `custom_components/lego` into your Home Assistant `config/custom_components/`
directory and restart.

## Configuration

1. Get a free Brickset API key at
   [brickset.com/tools/webservices/v3](https://brickset.com/tools/webservices/v3).
2. **Settings → Devices & services → Add integration → LEGO**.
3. Enter your API key, Brickset username and Brickset password.
4. Choose the pricing region. It is preselected from Home Assistant's country
   when that country is one LEGO.com prices separately (`GB`, `US`, `CA`, `DE`),
   but you can pick any of the four — tracking a store you actually buy from
   matters more than where you live. Changeable later under **Configure**.

### Setup parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| Brickset API key | Yes | Issued from your Brickset account under Tools → Web services. |
| Brickset username | Yes | The account whose owned and wanted sets are tracked. Also the entry's unique ID. |
| Brickset password | Yes | Used **once** to obtain a long-lived token. The password is never stored; only the token is written to the config entry. |

### Options

Reachable via **Configure** on the integration entry.

| Option | Default | Notes |
|--------|---------|-------|
| Pricing region | from HA's country | Which LEGO.com market supplies RRP and availability dates (`UK`, `US`, `CA`, `DE`). |
| Themes to watch | none | Each watched theme costs one API call per feed refresh. |
| Watchlist | none | Full set numbers, e.g. `10497-1`. Each gets a retirement-countdown sensor. |
| Collection refresh interval | 6 h | How often owned and wanted sets are re-fetched. |
| New release refresh interval | 12 h | How often watched themes are checked. |
| Daily call budget | 80 | Polling stops at this many calls, leaving headroom for manual actions. |
| Keep a local set index | on | Downloads Rebrickable's set list. Costs no Brickset calls and makes set lookups free. |
| Include set names in the index | on | Needed to search by name. Roughly 1.8 MB on disk instead of 450 KB. |
| Set index refresh interval | 7 days | How often the list is re-downloaded (1–90 days). A set missing from the index still works; it just costs one lookup. |

## Data updates

Brickset allows **100 `getSets` calls per API key per day**; no other method counts. The
integration polls on two schedules and self-limits:

- **Collection** (default every 6 h): one call for owned sets, one for wanted, plus one
  more if the watchlist contains sets in neither list.
- **Themes** (default every 12 h): one call per watched theme.
- `getKeyUsageStats` (unbilled) is polled at most every 30 minutes to reconcile the local
  tally with Brickset's own count, which also catches calls made by other tools sharing
  the key.

The local set index refreshes every 7 days by default from Rebrickable's public CSV,
which is not a Brickset endpoint and costs nothing from the daily allowance. It seeds in
the background after setup, so a first start does not wait on the download. The interval
is configurable; Rebrickable publishes whole snapshots rather than deltas, so a refresh
is always a full 511 KB download.

The options dialog shows the estimated calls/day for your current settings. When the
budget is spent, polling pauses and entities keep serving the last successful poll rather
than going unavailable. `sensor.brickset_*_brickset_calls_today` shows usage, budget and
remaining headroom.

## Entities

| Entity | Notes |
|--------|-------|
| Sets owned / Distinct sets owned | Totals with and without duplicate copies. |
| Pieces owned / Minifigures owned | Summed across owned sets, multiplied by quantity. |
| Sets wanted | Size of your Brickset wishlist. |
| Collection value | Sum of LEGO.com RRP × quantity in the chosen region. |
| Brickset calls today | Diagnostic; usage against the daily limit. |
| Set *N* retires in | One per watchlist entry; days until retirement, full set data in attributes. |
| Latest *theme* set | One per watched theme; newest set number, with details in attributes. |
| Set retirements / releases / anniversaries | Three calendar entities. |

## Actions

| Action | What it does |
|--------|--------------|
| `lego.set_collection` | Marks a set owned/wanted, or updates quantity, rating or notes. |
| `lego.add_watch` | Adds a set to the watchlist. |
| `lego.remove_watch` | Removes a set from the watchlist. |
| `lego.search_sets` | Searches Brickset and returns matches (response action). Costs one API call. |

`lego.set_collection` spends a call only for a set no poll has returned; the local index
remembers the Brickset ID of everything already seen.

### Searching without spending a call

Dashboards can search the local index over the websocket API, which never reaches
Brickset:

```json
{"type": "lego/search", "config_entry_id": "<entry id>", "query": "galaxy", "limit": 10}
```

Each result carries `set_number`, `name`, `year`, `theme` and `owned`. Use
`lego.search_sets` instead when you need Brickset's own record — prices, dates, images.

## Events

| Event | Fired when |
|-------|-----------|
| `lego_new_set` | A set appears in a watched theme that was not in the previous poll. |
| `lego_wanted_set_changed` | A wanted set's price, availability or retirement date changes. |

The first poll after a restart establishes the baseline and fires nothing, so a restart
does not replay the year's releases.

`lego_new_set` carries the set's details so an automation needs no further API call:
`set_number`, `name`, `theme`, `year`, `pieces`, `minifigs`, `image_url`,
`brickset_url`, `released`, `release_date`, `retirement_date`, `retail_price` and
`region`.

A just-announced set usually has no dates yet — LEGO publishes them later, and they are
per-region — so `release_date`, `retirement_date` and `retail_price` are frequently
`null`. Guard on `released` or test the field before formatting it:

```yaml
message: >-
  {{ trigger.event.data.name }}
  {% if trigger.event.data.release_date %}
    is out on {{ trigger.event.data.release_date }}
  {% else %}
    has been announced, no release date yet
  {% endif %}
```

## Examples

Notify when a set on the wishlist is about to retire:

```yaml
automation:
  - alias: LEGO retirement warning
    triggers:
      - trigger: numeric_state
        entity_id: sensor.brickset_myname_set_10497_1_retires_in
        below: 30
    actions:
      - action: notify.mobile_app_phone
        data:
          title: Retiring soon
          message: >-
            {{ state_attr(trigger.entity_id, 'set_name') }} retires on
            {{ state_attr(trigger.entity_id, 'retirement_date') }}.
```

Notify on a new set in a watched theme:

```yaml
automation:
  - alias: New Technic set
    triggers:
      - trigger: event
        event_type: lego_new_set
    conditions:
      - "{{ trigger.event.data.theme == 'Technic' }}"
    actions:
      - action: notify.mobile_app_phone
        data:
          title: "New {{ trigger.event.data.theme }} set"
          message: >-
            {{ trigger.event.data.set_number }} {{ trigger.event.data.name }} —
            {{ trigger.event.data.pieces }} pieces
          data:
            image: "{{ trigger.event.data.image_url }}"
```

Mark a set owned from a dashboard button:

```yaml
script:
  mark_set_built:
    sequence:
      - action: lego.set_collection
        data:
          config_entry_id: !secret lego_entry_id
          set_number: 10497-1
          owned: true
          qty_owned: 1
```

## Known limitations

- **Collection value is RRP, not market value.** It sums LEGO.com recommended retail
  price, which Brickset does not publish for many older sets. The value sensor exposes
  `sets_missing_price` so you can see how much of the collection is uncounted.
- **Retirement and release dates are region-specific** and are best populated for the US
  and UK. A set with no published date for your region produces no calendar event and an
  unknown countdown.
- **100 calls/day is a hard ceiling** shared by everything using that API key. Watching
  many themes on a short interval will exhaust it.
- **Minifigure counts come from set records**, so loose minifigures tracked separately on
  Brickset are not included.
- Brickset user hashes are long-lived but not permanent; a password change invalidates
  them and triggers the reauth flow.
- **The local index is Rebrickable's, not Brickset's.** The two agree on about 91% of set
  numbers. A number the index has not heard of is still sent to Brickset, so divergence
  only costs a saving — it never rejects a real set.

## Troubleshooting

| Symptom | Cause and fix |
|---------|---------------|
| "Brickset rejected that API key" during setup | The key is wrong or was revoked. Re-copy it from Brickset → Tools → Web services. |
| "Brickset rejected that username or password" | Credentials are wrong, or the account uses a social login with no Brickset password set. |
| Entities stop updating, log says "daily call budget spent" | Too many watched themes or too short an interval. Raise the intervals, or raise the budget (up to 100). |
| Repeated reauth prompts | Your Brickset password changed, invalidating the token. Complete the reauth once. |
| Value sensor looks far too low | Check `sets_missing_price`; most pre-2010 sets have no published RRP. |
| Calendars are empty | Your region has no published dates for those sets. Try switching the pricing region in options. |
| `lego/search` returns "The set catalogue is not available" | The local index is turned off in options, or its first download has not finished. It retries on the next restart. |
| Searching by name finds nothing | "Include set names in the index" is off; only exact set numbers match. |

Enable debug logging with:

```yaml
logger:
  logs:
    custom_components.lego: debug
```

## Removal

**Settings → Devices & services → LEGO → ⋮ → Delete**. This removes the config entry,
its device and all its entities. Nothing is written to Brickset on removal; sets you
marked owned or wanted through the integration stay marked on your Brickset account.
If installed via HACS, uninstall it there afterwards and restart.

## Support

If this saves you some time, you can
[buy me a coffee](https://buymeacoffee.com/PineappleEmperor). Entirely optional;
nothing in the integration asks you for anything.

## Credits

Set data, images and pricing © [Brickset.com](https://brickset.com) — please support them
by visiting the set pages this integration links to.

The local set index is built from [Rebrickable](https://rebrickable.com)'s public
downloads, used with their permission to use the files for any purpose.

## Licence

MIT.
