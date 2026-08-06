#!/usr/bin/env python3
"""Generate the HACS brand assets for the LEGO integration.

Deliberately draws a generic studded brick with no wordmark, so nothing here
imitates LEGO Group or Brickset branding. Run from the repo root:

    python3 scripts/generate_brand.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

BRAND_DIR = Path("custom_components/lego/brand")

BODY = (206, 42, 42, 255)
BODY_LIGHT = (232, 74, 74, 255)
BODY_DARK = (150, 24, 24, 255)
STUD_TOP = (240, 96, 96, 255)


def _brick(
    draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], studs: int
) -> None:
    """Draw one studded brick inside a bounding box."""
    left, top, right, bottom = box
    width = right - left
    height = bottom - top
    stud_h = int(height * 0.18)
    body_top = top + stud_h
    radius = max(int(width * 0.04), 2)

    stud_w = width / studs
    stud_r = stud_w * 0.28
    for index in range(studs):
        centre = left + stud_w * (index + 0.5)
        draw.ellipse(
            (
                centre - stud_r,
                top,
                centre + stud_r,
                top + stud_h * 1.9,
            ),
            fill=STUD_TOP,
        )

    draw.rounded_rectangle((left, body_top, right, bottom), radius=radius, fill=BODY)
    # Bevel: a light top edge and a dark bottom edge read as depth at small sizes.
    draw.rounded_rectangle(
        (left, body_top, right, body_top + int(height * 0.10)),
        radius=radius,
        fill=BODY_LIGHT,
    )
    draw.rounded_rectangle(
        (left, bottom - int(height * 0.10), right, bottom),
        radius=radius,
        fill=BODY_DARK,
    )


def build_icon(size: int) -> Image.Image:
    """Draw a single 2-stud brick filling a square canvas."""
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    margin = int(size * 0.12)
    _brick(draw, (margin, int(size * 0.22), size - margin, size - margin), studs=2)
    return image


def build_logo(width: int, height: int) -> Image.Image:
    """Draw three stacked bricks across a landscape canvas."""
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    pad = int(height * 0.12)
    brick_h = int((height - pad * 2) * 0.42)
    _brick(draw, (pad, pad, width - pad, pad + brick_h), studs=6)
    _brick(
        draw,
        (int(width * 0.18), pad + brick_h + pad, int(width * 0.82), height - pad),
        studs=4,
    )
    return image


def main() -> None:
    """Write every brand asset."""
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    build_icon(256).save(BRAND_DIR / "icon.png")
    build_icon(512).save(BRAND_DIR / "icon@2x.png")
    build_logo(512, 256).save(BRAND_DIR / "logo.png")
    build_logo(1024, 512).save(BRAND_DIR / "logo@2x.png")
    for path in sorted(BRAND_DIR.glob("*.png")):
        with Image.open(path) as image:
            print(f"{path}: {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()
