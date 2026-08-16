#!/usr/bin/env python3
# skill-audit: local-tool
"""Draw the brand assets: an isometric 2x2 LEGO brick carrying the HA tree.

Proportions come from a real 2x2 brick rather than from any drawing: a 15.8 mm
moulded footprint (two 8 mm pitches less the 0.2 mm clearance), a 9.6 mm body,
and 4.8 mm studs 1.8 mm tall, all expressed as multiples of the plan square
side. Run from the repo root:

    python3 scripts/generate_brand.py
"""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

BRAND_DIR = Path("custom_components/lego/brand")

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


if __name__ == "__main__":
    main()
