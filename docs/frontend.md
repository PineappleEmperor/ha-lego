# Frontend

The panel shipped in 0.5.0. What follows is the reasoning it was built on; the
cards are still to come.

## What exists

`frontend/src/panel.ts` is a single Lit element, built by esbuild to the committed
`custom_components/lego/panel/lego-panel.js`. HACS ships the repo as-is with no
build step on the user's machine, so the bundle has to be in the repo — and a
stale bundle is invisible, because it still runs. `frontend_build.yml` rebuilds
from source on every PR touching either, and fails if the result differs from the
committed file.

Rows on the home view are reorderable by drag, saved per Home Assistant user
through `lego/panel_config/set`. Keying by user costs nothing over keying by
install and avoids a migration if two people ever share a dashboard.

Data comes from `lego/dashboard`, `lego/collection` and `lego/search` — never from
entity state. That is what makes a card extractable later.



An optional panel in this repository first, with cards extracted to their own
repository once the pieces have earned it.

## Why the panel belongs here and cards do not

HACS categorises a repository, not a folder: a repo is an `integration` or a
`plugin`, never both. A Lovelace card shipped inside this repo would never
appear in the card store, and the integration would have to serve and register
the bundle itself.

A panel has no such problem. It is registered by the integration through
`panel_custom`, so it is part of the integration by construction.

So: panel here, cards later in `ha-lego-card` as a HACS `plugin`.

## Optional, offered during setup, on by default

The setup flow asks on its own step, with the box already ticked. Its own step
because "do you want a page in the sidebar" is a different kind of question from
"which market prices your collection", and burying a sidebar change beside an
unrelated setting is how people end up surprised by their own nav. A panel nobody discovers is a
panel nobody uses, and someone who has just connected their collection is the
one person guaranteed to want to look at it.

Registration is conditional on the option, and the options flow can turn it off
later. Toggling it reloads the entry, which registers or removes the sidebar
entry — an option that only takes effect after a restart would be worse than no
option.

## Building it so cards can be extracted

The cost of extraction is decided now, not later. Two rules:

- **Data comes from websocket commands, never from panel-internal state.** A card
  living in another repository can call `lego/search` exactly as the panel does.
  Anything the panel reaches for directly becomes an obstacle to lifting a
  component out.
- **Each view is a standalone custom element** that takes its data as properties
  and emits events. A component shaped that way is published as a card by adding
  a manifest and a build target, not by rewriting it.

## Gated on the catalogue

Search-as-you-type is the point of the panel, and every keystroke would be a
billed Brickset call without a local catalogue. See [catalogue.md](catalogue.md);
the panel waits on it.

## Costs to accept before starting

A JS/TS build enters a Python repository: a bundler, committed build artifacts so
HACS ships something runnable, and a release process that keeps the bundle in step
with the integration version. That is the real price, not the component code.

Sizing, typography, spacing and colour follow the `ha-panel-design` skill —
Material 3 type scale, 48px touch targets, and Home Assistant's theme custom
properties rather than hardcoded values, so the panel inherits the user's theme.
