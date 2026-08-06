# ha-lego

Home Assistant custom integration exposing a LEGO collection from the Brickset API v3.
Domain: `lego`. Package: `custom_components/lego/`.

## AI sessions

Before writing or modifying integration code (config flow, platforms, manifest,
coordinator, services…), invoke the `ha-integration` skill. Re-invoke it after any
`/compact`, since compaction can drop the skill's guidance from context.

## Hard constraints

- **Brickset allows 100 `getSets` calls per API key per day.** No other method counts.
  Every billed call goes through `BricksetClient.get_sets`, which reserves against
  `QuotaManager` first. Never add a code path that calls `getSets` without going through
  the client, and never add a poll without accounting for it in
  `estimated_daily_calls()` in `config_flow.py`.
- **Passwords are never persisted.** The config flow exchanges them for a `userHash` and
  stores only that. Reauth re-runs `login`.
- **No affiliate or referral links.** Set links must point at plain Brickset URLs.
- The integration is unofficial; keep the "not affiliated with the LEGO Group" and
  Brickset attribution notices in the README, config flow strings and entity
  attribution.

## Layout

| File | Role |
|------|------|
| `api.py` | Async Brickset client on HA's shared aiohttp session |
| `quota.py` | Daily call budget, reconciled against `getKeyUsageStats` |
| `models.py` | `LegoSet`, `CollectionSummary` and the API parsers |
| `coordinator.py` | Collection and feeds coordinators, event firing |
| `config_flow.py` | Config, reauth, reconfigure and options flows |
| `entity.py` | Device wiring and attribution base classes |
| `sensor.py` / `calendar.py` | Entity platforms |
| `services.py` | Actions, registered once in `async_setup` |

## Conventions

- Conventional Commits; one version bump as the last commit before merge.
- `git config core.hooksPath .githooks` once per clone — the commit-msg hook enforces
  terse subjects and rejects AI trailers.
- Run before claiming done: `ruff check custom_components/`, `ruff format`,
  `pyright custom_components/`, `pytest`, `scripts/skill_audit.sh`.
- `quality_scale.yaml` is the definition of done. A rule is only `done` when a test
  exercises it. Do not add `"quality_scale"` to `manifest.json` until every rule at that
  tier is `done` or `exempt`.
