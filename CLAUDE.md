# ha-lego

Home Assistant custom integration exposing a LEGO collection from the Brickset API v3.
Domain: `lego`. Package: `custom_components/lego/`.

## AI sessions

Before writing or modifying integration code (config flow, platforms, manifest,
coordinator, websocket, services…), invoke the `ha-integration` skill. Re-invoke it after any
`/compact`, since compaction can drop the skill's guidance from context.

## Hard constraints

- **Brickset allows 100 `getSets` calls per API key per day.** No other method counts.
  Every billed call goes through `BricksetClient.get_sets`, which reserves against
  `QuotaManager` first. Never add a code path that calls `getSets` without going through
  the client, and never add a poll without accounting for it in
  `estimated_daily_calls()` in `config_flow.py`.
- **Passwords are never persisted.** The config flow exchanges them for a `userHash` and
  stores only that. Reauth re-runs `login`.
- **Never add our own affiliate or referral tags.** Links the integration builds
  itself point at plain Brickset URLs. Links that arrive *inside* Brickset's own
  feeds keep their tags — Brickset earns from the data this project depends on —
  and any feature carrying them is opt-in and disclosed in the README. Sponsorship
  links belong in the repository, never in anything rendered inside Home Assistant.
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

Brand assets are generated, not hand-drawn — see `docs/brand.md` before touching them.

## Conventions

- Conventional Commits. The release tag is the version: nothing bumps `manifest.json`,
  which the release workflow writes when a release is published.
- CI is reusable workflows called from `PineappleEmperor/release-flow`,
  `ha-integration-ci` and `ha-panel-ci`, pinned by SHA and moved by Dependabot. Never
  copy a workflow body back in.
- Run before claiming done: `ruff check .`, `ruff format --check .`,
  `mypy --config-file mypy.ini custom_components/`, `pytest`, and for panel changes
  `npm ci && npm run check && npm test && npm run build` in `frontend/`.
- `quality_scale.yaml` is the definition of done. A rule is only `done` when a test
  exercises it. Do not add `"quality_scale"` to `manifest.json` until every rule at that
  tier is `done` or `exempt`.

## Git hooks

Run `git config core.hooksPath .githooks` once in every clone. The commit-msg hook
enforces terse Conventional Commit subjects and rejects AI trailers.
