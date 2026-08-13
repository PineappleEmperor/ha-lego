<img src="custom_components/lego/brand/logo.png" alt="LEGO integration logo" width="320">

<p>
<a href="https://github.com/PineappleEmperor/ha-lego/releases"><img alt="release" src="https://img.shields.io/github/v/release/PineappleEmperor/ha-lego?style=flat-square"></a>
<a href="https://github.com/PineappleEmperor/ha-lego/commits/main/"><img alt="commits since latest" src="https://img.shields.io/github/commits-since/PineappleEmperor/ha-lego/latest?style=flat-square"></a>
<img alt="stars" src="https://img.shields.io/github/stars/PineappleEmperor/ha-lego?style=flat-square&amp;color=E6DD00">
<a href="https://github.com/hacs/integration"><img alt="hacs" src="https://img.shields.io/badge/hacs-custom-blue?style=flat-square"></a>
<a href="LICENSE"><img alt="licence" src="https://img.shields.io/github/license/PineappleEmperor/ha-lego?style=flat-square"></a>
<br>
<img alt="python" src="https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-lego/python_validate.yml?style=flat-square&amp;label=python">
<img alt="hassfest" src="https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-lego/hassfest_validate.yml?style=flat-square&amp;label=hassfest">
<img alt="hacs valid" src="https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-lego/hacs_validate.yml?style=flat-square&amp;label=hacs%20valid">
<a href="https://buymeacoffee.com/PineappleEmperor"><img alt="Buy me a coffee" height="20" src="https://cdn.buymeacoffee.com/buttons/default-yellow.png"></a>
</p>

# LEGO for Home Assistant

Track your LEGO collection in Home Assistant, using [Brickset](https://brickset.com) as
the data source. Collection totals, a value estimate, new-release feeds for the themes
you care about, retirement countdowns, calendars for releases and retirements, and an
optional sidebar panel for browsing it all.

> [!IMPORTANT]
> This project is **not affiliated with, authorised by, or endorsed by the LEGO Group**.
> LEGO® is a trademark of the LEGO Group. Set data, prices and images come from
> [Brickset.com](https://brickset.com) via their public API, and every set links back to
> its Brickset page. The local set index comes from
> [Rebrickable](https://rebrickable.com/downloads/). Neither Brickset nor Rebrickable is
> affiliated with this project or involved in it. No affiliate or referral links are used
> anywhere in this integration.

## Where the data comes from

Brickset is the main service and store of your LEGO collection data. Changes you make
here in this integration are reflected in your
[Brickset](https://brickset.com/tools/webservices/v3) account.

Set lookups come from a local copy of the
[Rebrickable dataset](https://rebrickable.com/downloads/) instead; a free weekly download
listing every LEGO set. We could use the Brickset API but this is capped at 100 API calls
a day. If a set isn't found in the local database then an API call is made, hopefully
massively reducing the number of API calls.

## Installation

[![Open the repository in HACS.][hacs-repo-badge]][hacs-repo-url]

Install **LEGO** from HACS, then restart Home Assistant.

## Configuration

1. Get a free Brickset API key at
   [brickset.com/tools/webservices/v3](https://brickset.com/tools/webservices/v3).
2. Add the integration:

   [![Add the LEGO integration to Home Assistant.][add-badge]][add-url]

3. Enter your API key, Brickset username and Brickset password.
4. Choose the pricing region. It is preselected from Home Assistant's country
   when that country is one LEGO.com prices separately (`GB`, `US`, `CA`, `DE`),
   but you can pick any of the four. Tracking a store you actually buy from
   matters more than where you live. Changeable later under **Configure**.

Once setup finishes, the local set index downloads from Rebrickable in the background.
It needs no account or key, and it costs none of your Brickset allowance. Turn it off
under **Configure** if you would rather not keep it.

### Setup parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| Brickset API key | Yes | Issued from your Brickset account under Tools → Web services. |
| Brickset username | Yes | The account whose owned and wanted sets are tracked. Also the entry's unique ID. |
| Brickset password | Yes | Used once to obtain a long-lived token. The password is never stored; only the token is written to the config entry. |

### Options

Reachable via **Configure** on the integration entry.

| Option | Default | Notes |
|--------|---------|-------|
| Pricing region | from HA's country | Which LEGO.com market supplies prices and availability dates (`UK`, `US`, `CA`, `DE`). |
| Themes to watch | none | Which themes to follow for new releases. However many you pick, they ride in one call per refresh. |
| Collection refresh interval | 1 h | How often owned and wanted sets are re-fetched. Each refresh costs two calls. |
| New release refresh interval | 12 h | How often watched themes are checked. Each refresh costs one call. |
| Daily call budget | 80 | How many calls polling may spend before it pauses, leaving headroom for anything you ask for by hand. |
| Show the LEGO panel in the sidebar | on | Whether to add the sidebar page for browsing your collection, your wishlist and new releases. |
| Keep a local set index | on | Whether to keep a local copy of Rebrickable's set list, so looking a set up costs no Brickset calls. |
| Include set names in the index | on | Whether that index stores names as well as numbers, which is what searching by name needs. Takes roughly 1.8 MB on disk instead of 450 KB. |
| Set index refresh interval | 7 days | How often the local list is re-downloaded, from 1 to 90 days. Costs no Brickset calls, and a set missing from it still works at the price of one lookup. |

## The panel

A **LEGO** entry appears in the sidebar unless you turn it off in options. It has two views:

- **Home** shows new releases in the themes you follow, your wishlist with release and
  retirement dates, and your collection totals. Each row has a drag handle, and the order
  is remembered per Home Assistant user.
- **Collection** is the full grid. Its search box covers both your own sets and the whole
  catalogue.

Every card can mark a set owned or not owned. The panel reads only websocket commands, so
browsing and searching cost no Brickset calls; only the ownership toggle writes.

An **Update now** button on the Home view polls Brickset immediately, showing what the
refresh costs against the calls left today. It greys out once the budget would be
exceeded rather than failing at the API.

## Entities

| Entity | Notes |
|--------|-------|
| Sets owned / Distinct sets owned | Totals with and without duplicate copies. |
| Pieces owned / Minifigures owned | Summed across owned sets, multiplied by quantity. |
| Sets wanted | Size of your Brickset wishlist. A `sets` attribute lists them, soonest to retire first with already-retired sets last, carrying your Brickset priority, and is kept out of the recorder. |
| Collection value | Sum of LEGO.com RRP × quantity in the chosen region. |
| Brickset calls today | Diagnostic; usage against the daily limit. |
| Next wishlist retirement | Days until the soonest set on your wishlist leaves sale, with that set's full record in attributes. Sets already gone are excluded. |
| Latest *theme* set | One per watched theme; newest set number, with details in attributes. |
| Set retirements / releases / anniversaries | Three calendar entities. |

## Actions

| Action | What it does |
|--------|--------------|
| `lego.set_collection` | Marks a set owned/wanted, or updates quantity, rating or notes. |
| `lego.search_sets` | Searches Brickset and returns matches (response action). Costs one API call. |
| `lego.refresh_catalogue` | Re-downloads the local set index now, whatever the interval says. Costs no API calls. |
| `lego.refresh_collection` | Polls Brickset now instead of waiting for the interval. Costs 2 calls, and refuses if the budget would be exceeded. |

`lego.set_collection` spends a call only for a set no poll has returned; the local index
remembers the Brickset ID of everything already seen.

## Data updates

Brickset allows **100 `getSets` calls per API key per day**; no other method counts. The
integration polls on two schedules and self-limits:

- **Collection** (default every 1 h): one call for owned sets and one for wanted.
- **Themes** (default every 12 h): one call for all of them, comma joined. A theme with
  no releases this year is confirmed separately, which costs one more.
- `getKeyUsageStats` does not count against the 100. It is polled at most every 30
  minutes to reconcile the local tally with Brickset's own count, which also catches
  calls made by other tools sharing the key.

The local set index refreshes every 7 days by default from Rebrickable's public CSV,
which is not a Brickset endpoint and costs nothing from the daily allowance. It seeds in
the background after setup, so a first start does not wait on the download. The interval
is configurable; Rebrickable publishes whole snapshots rather than deltas, so a refresh
is always a full 511 KB download.

The options dialog shows the estimated calls/day for your current settings. When the
budget is spent, polling pauses and entities keep serving the last successful poll rather
than going unavailable. `sensor.brickset_*_brickset_calls_today` shows usage, budget and
remaining headroom.

## Removal

**Settings → Devices & services → LEGO → ⋮ → Delete**. That removes the config
entry, its device and all its entities. Nothing is written to Brickset, so sets you
marked owned or wanted stay marked on your account. Uninstall from HACS afterwards
if you want the files gone too.

## Credits

Set data, images and pricing © [Brickset.com](https://brickset.com). Please support them
by visiting the set pages this integration links to. They carry the cost of the data this
project depends on.

The local set index comes from [Rebrickable](https://rebrickable.com/downloads/), whose
terms permit use of the download files for any purpose.

The icon and logo carry the Home Assistant mark, which is trademarked and the property of
the [Open Home Foundation](https://www.openhomefoundation.org/). It is used here under
their terms for non-commercial use. This project is not affiliated with, authorised by or
endorsed by the Open Home Foundation.

## Development

Brickset publishes no schema for its responses, so a small set of contract tests
run against the real API on demand, checking the assumptions this integration
makes about the payload shape. They are marked `live`, excluded from the default
`pytest` run, and gated behind an environment that needs manual approval, so the
credentials stay out of reach of every other workflow.

> [!NOTE]
> **AI assistance:** I'm a programmer; this project is built with AI (Claude, via Claude
> Code) for implementation, code review, and QA — under human direction, guided by my
> [`ha-integration`](https://github.com/PineappleEmperor/pineapple-claude-hacs) skill.
> Architecture and final review are mine; every change is human-reviewed before it
> merges.

<!-- Badges -->

[add-badge]: https://my.home-assistant.io/badges/config_flow_start.svg
[hacs-repo-badge]: https://my.home-assistant.io/badges/hacs_repository.svg

<!-- References -->

[add-url]: https://my.home-assistant.io/redirect/config_flow_start/?domain=lego
[hacs-repo-url]: https://my.home-assistant.io/redirect/hacs_repository/?owner=PineappleEmperor&repository=ha-lego&category=Integration
