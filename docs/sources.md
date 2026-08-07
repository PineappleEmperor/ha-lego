# Data sources

## Brickset — in use

The collection itself: owned and wanted sets, the catalogue, LEGO.com RRP and
availability dates, and collection writes. An API key plus a `userHash` obtained
once from a password.

Its inclusion policy matches what a collection tracker means by a set, which is
why it stays the primary source rather than a mirror.

Billed: 100 `getSets` calls per key per day. Nothing else counts.

## Rebrickable — planned

Two jobs, one API key plus a user token:

- The **set catalogue** as a nightly CSV, free of any API call, so resolving a
  set number costs nothing. See [catalogue.md](catalogue.md).
- **MOCs buildable from parts you own**, and designers to follow. No other
  source knows this; it needs a part inventory, not a set list.

## BrickLink — ruled out, 2026-08-07

BrickLink knows what sets actually *sell* for, which would fix the weakest
number this integration reports: collection value is RRP, and RRP is meaningless
for anything long out of production.

It is still not worth it:

- **OAuth 1.0a**, with four secrets per user rather than a key.
- **Every user must register an application and an IP address.** Tokens are
  issued per IP, and home connections are typically dynamic. The documented
  escape, registering `0.0.0.0`, matches any address and so leaves the secrets
  as the only thing protecting the account — a worse bargain to ask of someone
  installing a hobby integration.
- **The developer documentation is gone.** `apidev.bricklink.com` does not
  respond, and `bricklink.com/v3/api.page` renders a title and the server time.

Revisit only if a modern, key-based source of market prices appears. Until then
the value sensor stays RRP-based and says so, exposing `sets_missing_price` so
the gap is visible rather than implied.
