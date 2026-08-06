#!/usr/bin/env python3
"""Render the HACS brand assets from assets/brick.svg.

Run from the repo root:

    python3 scripts/generate_brand.py
"""

from __future__ import annotations

import io
from pathlib import Path

import cairosvg
from PIL import Image

SOURCE = Path("assets/brick.svg")
BRAND_DIR = Path("custom_components/lego/brand")

ICON_MARGIN = 0.06
LOGO_MARGIN = 0.10


def _render(size: int) -> Image.Image:
    """Rasterise the brick to a square RGBA image."""
    png = cairosvg.svg2png(
        url=str(SOURCE), output_width=size, output_height=size, background_color=None
    )
    assert png is not None
    return Image.open(io.BytesIO(png)).convert("RGBA")


def build_icon(size: int) -> Image.Image:
    """Draw the brick centred on a square canvas."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = round(size * (1 - ICON_MARGIN * 2))
    brick = _render(inner)
    canvas.alpha_composite(brick, ((size - inner) // 2, (size - inner) // 2))
    return canvas


def build_logo(width: int, height: int) -> Image.Image:
    """Draw the brick centred on a landscape canvas."""
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    inner = round(height * (1 - LOGO_MARGIN * 2))
    brick = _render(inner)
    canvas.alpha_composite(brick, ((width - inner) // 2, (height - inner) // 2))
    return canvas


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
