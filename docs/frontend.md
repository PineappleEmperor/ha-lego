# Frontend

The panel shipped in 0.5.0 and was rebuilt as one page of rows for 1.0.0, when its
rows also became dashboard cards. What follows is what exists and the reasoning
behind it.

## What exists

`frontend/src/` builds, through esbuild, to the one committed bundle
`custom_components/lego/panel/lego-panel.js`. HACS ships the repo as-is with no build
step on the user's machine, so the bundle has to be in the repo, and a stale bundle
is invisible because it still runs. `frontend_build.yml` rebuilds from source on
every PR touching either, and fails if the result differs from the committed file.

| File | Role |
|------|------|
| `lego-panel.ts` | The sidebar page: header, Customise, and the rows in the user's order |
| `base.ts` | `LegoRow`, the frame every row draws: fold arrow, icon, title, actions, handle |
| `rows/*.ts` | One element per row: collection, releases, wishlist, value |
| `cards.ts` | A dashboard card around each row, registered in the card picker |
| `format.ts` | Pure helpers, exported so the tests can reach them |
| `palette.ts` | The chart colours, light and dark, and which theme takes which |
| `svg.ts` | Draws the generated logo and bricks through escaped template bindings |
| `generated/brand.ts` | Written by `scripts/generate_brand.py`; never edited by hand |

Per-user settings (row order, hidden rows, which rows start folded, combined or
separate release rows, and each release row's starting filters) are saved through
`lego/panel_config/set`. Keying by user costs nothing over keying by install and
avoids a migration if two people ever share a dashboard. Folding a row by its header
lasts only for the visit; Customise is where a start state is chosen.

Data comes from `lego/dashboard`, `lego/collection`, `lego/search` and
`lego/releases`, never from entity state. `lego/releases` reads the feeds already in
memory, so changing a release row's span or themes costs no Brickset calls.

### Chart colours

The charts use the dataviz skill's validated categorical palette, with its own light
and dark steps. Home Assistant's `--color-N` palette was run through the same
validator and fails in dark mode on lightness, chroma and colour-blind separation.
A few themes keep the hue people expect (Botanicals green, Icons gold, Technic
violet, Harry Potter red); other themes take the free slots in a fixed order, so a
theme's colour follows the theme rather than its rank. Grey for Technic was tried
and fails the chroma floor, reading as "Other".

### Nothing rendered from strings

The logo and the bricks are generated as data, not markup, and `svg.ts` draws only
the elements the generator writes, through Lit's escaped attribute bindings. Neither
`unsafeSVG` nor `unsafeCSS` is used, so no reviewer has to establish that a string
is trusted. The logo's faces are shades of `--primary-color` written into each
shape's `style`, since `var()` in an SVG presentation attribute is not reliably
honoured.

## Why the cards ship with the integration

HACS categorises a repository, not a folder: a repo is an `integration` or a
`plugin`, never both. The first plan was cards in a separate `ha-lego-card`
repository for that reason.

They ship here instead. Home Assistant lets a custom integration load a module on
every page with `frontend.add_extra_js_url`, whose own docstring says it is for
custom integrations, so the cards need no second repository and no manual resource.
The integration loads the bundle at exactly the URL the panel uses, and a browser
evaluates a module once per URL, so the panel page does not define anything twice.
The cards read only this integration's websocket commands, so installed on their own
they could show nothing; shipping them together keeps cards and data in the same
release. What is given up is a listing of its own among HACS's plugins.

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
