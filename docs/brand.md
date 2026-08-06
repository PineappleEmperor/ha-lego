# Brand assets

The icon and logo are an isometric 2x2 LEGO brick in Home Assistant blue, carrying
the Home Assistant mark on its front-left face. Everything is drawn from constants
by `scripts/generate_brand.py`; no artwork is hand-edited.

```bash
python3 scripts/generate_brand.py
```

That writes `assets/brick.svg` and the four PNGs HACS and Home Assistant expect:
`icon.png` (256), `icon@2x.png` (512), `logo.png` (512x256) and `logo@2x.png`
(1024x512). The `@2x` variants are not optional — a HiDPI client requests them and
falls back inconsistently if they 404.

## Dimensions

Proportions come from a real brick rather than from a drawing of one, expressed as
fractions of the moulded footprint so the drawing scales cleanly.

| Measure | Real part | Constant |
|---------|-----------|----------|
| Footprint | 15.8 mm (two 8 mm pitches less 0.2 mm clearance) | `FOOTPRINT` |
| Body height | 9.6 mm | `BODY` |
| Stud pitch | 8 mm, so studs sit at 0.25 and 0.75 | `STUD_AT` |
| Projection | 30 degrees | `ISO` |

A 2x2 brick is genuinely squat: 15.8 mm across against 9.6 mm tall. It looks
shorter still in isometric, because the width on screen is the *diagonal*
(1.732 x 15.8), so the body reads as roughly a third of the icon's overall width.
That is correct — a part half this height would be a plate (3.2 mm).

## Studs

Studs are the one deliberate departure from the real part. A real stud is 4.8 mm
across on an 8 mm pitch — 0.60 of the spacing — which reads as undersized in a
drawing, because a photograph also carries highlights, moulding text and shadows
that sell the stud at a size an icon cannot.

| Option | Diameter | Rise | Diameter / pitch | Notes |
|--------|----------|------|------------------|-------|
| Accurate | 4.8 mm | 1.8 mm | 0.60 | True to the part; small at 48 px. |
| **Midway (current)** | **5.3 mm** | **1.5 mm** | **0.67** | Chunkier without looking cartoonish. |
| Wider | 5.8 mm | 1.8 mm | 0.73 | Full stylised width, real rise. |
| Wider and flatter | 5.8 mm | 1.2 mm | 0.73 | Reads as flat discs rather than cylinders. |

Change `STUD_R` and `STUD_RISE` and re-run the generator to switch between these.

Illustrated bricks elsewhere often oversize studs considerably, but the references
that are freely licensed enough to measure use inconsistent projections and their
own accuracy is disputed, so they were not treated as a target.

## Drawing notes

Two things that are easy to get wrong if this is ever rewritten:

- **Studs are drawn after the top face**, each as its own side-plus-ellipse shape.
  Drawing them into the same layer as the brick lets the body's edges cut through
  their outlines.
- **The Home Assistant mark is sheared by position, not by transform.** Applying a
  shear to the drawing squashes the round line caps into ellipses and leaves a
  visible seam where each node meets its branch; moving the node positions instead
  keeps the circles true.
