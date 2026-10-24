#!/usr/bin/env python3
# skill-audit: local-tool
"""Draw the brand assets: an isometric 2x2 LEGO brick carrying the HA tree.

Also writes the panel's generated module: the logo with its colours left as CSS
variables, so the panel can draw it in the theme's primary colour, and the rainbow
of real bricks the panel uses to fill empty space.

Proportions come from a real 2x2 brick rather than from any drawing: a 15.8 mm
moulded footprint (two 8 mm pitches less the 0.2 mm clearance), a 9.6 mm body,
and 4.8 mm studs 1.8 mm tall, all expressed as multiples of the plan square
side. Run from the repo root:

    python3 scripts/generate_brand.py
"""

import colorsys
import io
import json
from pathlib import Path
from xml.etree import ElementTree as ET

import cairosvg
from PIL import Image

BRAND_DIR = Path("custom_components/lego/brand")
PANEL_MODULE = Path("frontend/src/generated/brand.ts")

ISO = 0.57735  # tan(30 degrees)

# Real brick dimensions over the 15.8 mm moulded footprint.
FOOTPRINT = 15.8
BODY = 9.6 / FOOTPRINT
# Studs are deliberately larger than the real 2.4 x 1.8 mm; see docs/brand.md.
STUD_R = 2.65 / FOOTPRINT
STUD_RISE = 1.5 / FOOTPRINT
STUD_AT = (0.25, 0.75)

TOP = "#18BCF2"
LEFT = "#159FD4"
RIGHT = "#0B6E93"
STUD_SIDE = "#1193C4"
EDGE = "#064F6B"

OUTER_STROKE = 2.0
INNER_STROKE = 0.5

APEX = (50.0, 8.0)
HALF_WIDTH = 46.0


def _pts(points: list[tuple[float, float]]) -> str:
    return " ".join(f"{x:.3f},{y:.3f}" for x, y in points)


def brick(a: float = HALF_WIDTH) -> tuple[str, tuple]:
    """Draw the brick, returning its markup and front-left face corners."""
    ax, ay = APEX
    side = a * 1.1547  # plan square side: the rhombus diagonal over cos(30)
    u = (a, ISO * a)
    v = (-a, ISO * a)
    height = BODY * side
    r = STUD_R * side
    ry = r * ISO
    rise = STUD_RISE * side

    p_apex = (ax, ay)
    p_right = (ax + u[0], ay + u[1])
    p_front = (ax + u[0] + v[0], ay + u[1] + v[1])
    p_left = (ax + v[0], ay + v[1])
    b_right = (p_right[0], p_right[1] + height)
    b_front = (p_front[0], p_front[1] + height)
    b_left = (p_left[0], p_left[1] + height)

    studs = sorted(
        (
            ay + u[1] * su + v[1] * sv - rise,
            ax + u[0] * su + v[0] * sv,
        )
        for su in STUD_AT
        for sv in STUD_AT
    )

    parts = [
        f'<polygon points="{_pts([p_left, p_front, b_front, b_left])}" fill="{LEFT}"/>',
        (
            f'<polygon points="{_pts([p_front, p_right, b_right, b_front])}" '
            f'fill="{RIGHT}"/>'
        ),
        f'<polygon points="{_pts([p_apex, p_right, p_front, p_left])}" fill="{TOP}"/>',
        (
            f'<g stroke="{EDGE}" stroke-width="{INNER_STROKE}" fill="none" '
            f'stroke-linecap="round">'
            f'<path d="M{p_left[0]:.3f},{p_left[1]:.3f} '
            f"L{p_front[0]:.3f},{p_front[1]:.3f} "
            f'L{p_right[0]:.3f},{p_right[1]:.3f}"/>'
            f'<path d="M{p_front[0]:.3f},{p_front[1]:.3f} '
            f'L{b_front[0]:.3f},{b_front[1]:.3f}"/></g>'
        ),
        (
            f"<polygon points="
            f'"{_pts([p_apex, p_right, b_right, b_front, b_left, p_left])}" '
            f'fill="none" stroke="{EDGE}" stroke-width="{OUTER_STROKE}" '
            f'stroke-linejoin="round"/>'
        ),
    ]
    for cy, cx in studs:
        parts.append(
            f'<g stroke="{EDGE}" stroke-width="{INNER_STROKE}" stroke-linejoin="round">'
            f'<path fill="{STUD_SIDE}" d="M{cx - r:.3f},{cy:.3f} v{rise:.3f} '
            f'a{r:.3f},{ry:.3f} 0 0 0 {r * 2:.3f},0 v{-rise:.3f} z"/>'
            f'<ellipse fill="{TOP}" cx="{cx:.3f}" cy="{cy:.3f}" '
            f'rx="{r:.3f}" ry="{ry:.3f}"/></g>'
        )

    return "".join(parts), (p_left, p_front, b_front, b_left)


def tree(face: tuple, height: float, fill: str = "#FFFFFF", width: float = 17.0) -> str:
    """Place the Home Assistant tree on the front-left face.

    The face's slope is applied to the node positions rather than to the drawing:
    shearing the strokes turns the round caps into ellipses and leaves a seam
    where each node meets its branch.
    """
    p_left, p_front, b_front, b_left = face
    slope = (p_front[1] - p_left[1]) / (p_front[0] - p_left[0])
    radius = width * 1.14

    def p(x: float, y: float) -> tuple[float, float]:
        return x, y + slope * x

    stem = (p(120, 83.77), p(120, 239.76))
    left = (p(60, 179.76), p(120, 239.76))
    right = (p(180, 145.77), p(120, 205.77))
    nodes = (p(120, 83.77), p(60, 179.76), p(180, 145.77))

    pts = (*nodes, stem[1], left[1], right[1])
    x0 = min(x for x, _ in pts) - radius
    x1 = max(x for x, _ in pts) + radius
    y0 = min(y for _, y in pts) - radius
    y1 = max(y for _, y in pts) + radius
    scale = height / (y1 - y0)

    cx = (p_left[0] + p_front[0] + b_front[0] + b_left[0]) / 4
    cy = (p_left[1] + p_front[1] + b_front[1] + b_left[1]) / 4
    tx = cx - (x0 + (x1 - x0) / 2) * scale
    ty = cy - (y0 + (y1 - y0) / 2) * scale

    lines = "".join(
        f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}"/>'
        for a, b in (stem, left, right)
    )
    circles = "".join(
        f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}"/>' for x, y in nodes
    )
    return (
        f'<g transform="translate({tx:.3f},{ty:.3f}) scale({scale:.5f})">'
        f'<g stroke="{fill}" stroke-width="{width}" stroke-linecap="round" '
        f'fill="none">{lines}</g><g fill="{fill}">{circles}</g></g>'
    )


def icon_svg(tree_height: float = 25.0) -> str:
    """Return the square icon."""
    body, face = brick()
    body += tree(face, tree_height)
    side = HALF_WIDTH * 1.1547
    span = max(2 * HALF_WIDTH, ISO * 2 * HALF_WIDTH + BODY * side) + OUTER_STROKE + 5
    vx = APEX[0] - span / 2
    vy = APEX[1] + (ISO * 2 * HALF_WIDTH + BODY * side) / 2 - span / 2
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="{vx:.2f} {vy:.2f} {span:.2f} {span:.2f}">{body}</svg>'
    )


def _hls(colour: str) -> tuple[float, float, float]:
    r, g, b = (int(colour[i : i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)


def _hex(h: float, lightness: float, s: float) -> str:
    r, g, b = colorsys.hls_to_rgb(h, max(0.0, min(1.0, lightness)), s)
    return "#{:02X}{:02X}{:02X}".format(*(round(c * 255) for c in (r, g, b)))


def shades(top: str) -> dict[str, str]:
    """The logo's five shades re-derived for another top colour, by HSL lightness."""
    logo = {"top": TOP, "left": LEFT, "right": RIGHT, "stud": STUD_SIDE, "edge": EDGE}
    base = _hls(TOP)[1]
    h, lightness, s = _hls(top)
    return {
        key: _hex(h, lightness * _hls(value)[1] / base, s)
        for key, value in logo.items()
    }


# Real parts, lengths rising in pairs, in rainbow order. Each exists in its colour
# per Rebrickable's elements list; the colours are Rebrickable's published values.
RAINBOW = (
    ("3005", 1, 1, "Red", "#C91A09"),
    ("3004", 2, 1, "Orange", "#FE8A18"),
    ("3010", 4, 1, "Yellow", "#F2CD37"),
    ("3001", 4, 2, "Green", "#237841"),
    ("3009", 6, 1, "Dark Azure", "#078BC9"),
    ("2456", 6, 2, "Blue", "#0055BF"),
    ("3008", 8, 1, "Dark Purple", "#3F3691"),
    ("3007", 8, 2, "Medium Lavender", "#AC78BA"),
)
# Stud tops sit this much lighter than the face, so dark colours keep their detail.
STUD_HIGHLIGHT = 0.08


def part_svg(m: int, n: int, top: str, unit: float = 20.0) -> tuple[str, float]:
    """Draw an m-by-n brick in the logo's projection; return it and its width."""
    c = shades(top)
    h, lightness, s = _hls(c["top"])
    stud_top = _hex(h, lightness + STUD_HIGHLIGHT, s)
    ux, uy, vx, vy = unit * 0.866, unit * 0.5, -unit * 0.866, unit * 0.5
    height = BODY * 2 * unit
    r = STUD_R * 2 * unit
    ry = r * ISO
    rise = STUD_RISE * 2 * unit
    outer, inner = unit * 0.045, unit * 0.012
    pad = outer + 1
    ax, ay = n * unit * 0.866 + pad, r * 0.6 + rise + pad

    def at(a: float, b: float) -> tuple[float, float]:
        return ax + a * ux + b * vx, ay + a * uy + b * vy

    def down(point: tuple[float, float]) -> tuple[float, float]:
        return point[0], point[1] + height

    apex, right, front, left = at(0, 0), at(m, 0), at(m, n), at(0, n)
    width = (m + n) * unit * 0.866 + 2 * pad
    parts = [
        f'<polygon points="{_pts([left, front, down(front), down(left)])}" '
        f'fill="{c["left"]}"/>',
        f'<polygon points="{_pts([front, right, down(right), down(front)])}" '
        f'fill="{c["right"]}"/>',
        f'<polygon points="{_pts([apex, right, front, left])}" fill="{c["top"]}"/>',
        f'<path d="M{left[0]:.2f},{left[1]:.2f} L{front[0]:.2f},{front[1]:.2f} '
        f"L{right[0]:.2f},{right[1]:.2f} M{front[0]:.2f},{front[1]:.2f} "
        f'L{front[0]:.2f},{down(front)[1]:.2f}" stroke="{c["edge"]}" '
        f'stroke-width="{inner:.2f}" fill="none" stroke-linecap="round"/>',
        f'<polygon points="'
        f'{_pts([apex, right, down(right), down(front), down(left), left])}" '
        f'fill="none" stroke="{c["edge"]}" stroke-width="{outer:.2f}" '
        f'stroke-linejoin="round"/>',
    ]
    for cy, cx in sorted(
        (at(i + 0.5, j + 0.5)[1] - rise, at(i + 0.5, j + 0.5)[0])
        for i in range(m)
        for j in range(n)
    ):
        parts.append(
            f'<g stroke="{c["edge"]}" stroke-width="{inner:.2f}" '
            f'stroke-linejoin="round"><path fill="{c["stud"]}" '
            f'd="M{cx - r:.2f},{cy:.2f} v{rise:.2f} a{r:.2f},{ry:.2f} 0 0 0 '
            f'{r * 2:.2f},0 v{-rise:.2f} z"/><ellipse fill="{stud_top}" '
            f'cx="{cx:.2f}" cy="{cy:.2f}" rx="{r:.2f}" ry="{ry:.2f}"/></g>'
        )
    full_height = down(front)[1] + pad
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.2f} '
        f'{full_height:.2f}" aria-hidden="true">{"".join(parts)}</svg>'
    )
    return svg, width


def _shade(face: str) -> str:
    """A face of the logo in the theme's primary colour, darkened as the brand is."""
    primary = "var(--primary-color, #009ac7)"
    if face == TOP:
        return primary
    percent = round(_hls(face)[1] / _hls(TOP)[1] * 100)
    return f"color-mix(in srgb, {primary} {percent}%, black)"


def themed_logo_svg() -> str:
    """The icon with each brick face in a shade of the theme's primary colour."""
    global TOP, LEFT, RIGHT, STUD_SIDE, EDGE
    kept = (TOP, LEFT, RIGHT, STUD_SIDE, EDGE)
    TOP, LEFT, RIGHT, STUD_SIDE, EDGE = (_shade(face) for face in kept)
    try:
        return icon_svg()
    finally:
        TOP, LEFT, RIGHT, STUD_SIDE, EDGE = kept


def _tree(element: ET.Element) -> dict[str, object]:
    """An SVG element as data the panel renders through escaped template bindings.

    A colour that is a CSS expression goes in style: var() and color-mix() are not
    reliably honoured in SVG presentation attributes.
    """
    attrs: dict[str, str] = {}
    styles = []
    for key, value in element.attrib.items():
        if key in ("fill", "stroke") and value.startswith(("var(", "color-mix(")):
            styles.append(f"{key}:{value}")
        else:
            attrs[key] = value
    if styles:
        attrs["style"] = ";".join(styles)
    node: dict[str, object] = {"tag": element.tag.split("}")[-1], "attrs": attrs}
    if len(element):
        node["children"] = [_tree(child) for child in element]
    return node


def write_panel_module() -> None:
    """Write the logo and rainbow the panel imports; never edited by hand."""
    bricks = []
    for part, m, n, colour, top in RAINBOW:
        svg, width = part_svg(m, n, top)
        bricks.append(
            {
                "part": part,
                "size": f"{n}x{m}",
                "colour": colour,
                "width": round(width, 2),
                # Markup this script drew a line above, never anything read in.
                "svg": _tree(ET.fromstring(svg)),  # noqa: S314
            }
        )
    logo = _tree(ET.fromstring(themed_logo_svg()))  # noqa: S314, same
    PANEL_MODULE.parent.mkdir(parents=True, exist_ok=True)
    PANEL_MODULE.write_text(
        "// Generated by scripts/generate_brand.py; edit that, not this.\n\n"
        'import type { SvgNode } from "../svg";\n\n'
        f"export const LOGO: SvgNode = {json.dumps(logo)};\n\n"
        "export interface Brick {\n  part: string;\n  size: string;\n"
        "  colour: string;\n  width: number;\n  svg: SvgNode;\n}\n\n"
        f"export const RAINBOW: readonly Brick[] = {json.dumps(bricks)};\n"
    )


def _render(svg: str, size: int) -> Image.Image:
    png = cairosvg.svg2png(
        bytestring=svg.encode(), output_width=size, output_height=size
    )
    assert png is not None
    return Image.open(io.BytesIO(png)).convert("RGBA")


def build_logo(width: int, height: int) -> Image.Image:
    """Draw the icon centred on a landscape canvas."""
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    inner = round(height * 0.88)
    canvas.alpha_composite(
        _render(icon_svg(), inner), ((width - inner) // 2, (height - inner) // 2)
    )
    return canvas


def main() -> None:
    """Write every brand asset."""
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    svg = icon_svg()
    (BRAND_DIR.parent.parent.parent / "assets" / "brick.svg").write_text(svg + "\n")
    _render(svg, 256).save(BRAND_DIR / "icon.png")
    _render(svg, 512).save(BRAND_DIR / "icon@2x.png")
    build_logo(512, 256).save(BRAND_DIR / "logo.png")
    build_logo(1024, 512).save(BRAND_DIR / "logo@2x.png")
    for path in sorted(BRAND_DIR.glob("*.png")):
        with Image.open(path) as image:
            print(f"{path}: {image.size[0]}x{image.size[1]}")
    write_panel_module()
    print(PANEL_MODULE)


if __name__ == "__main__":
    main()
