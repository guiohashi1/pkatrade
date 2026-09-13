"""Compose HD overworld BG from CC0 Puny World tileset (Shade).

License: CC0 — https://opengameart.org/content/16x16-puny-world-tileset
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
SHEET = ROOT / ".tmp-bg" / "punyworld-overworld-tileset.png"
OUT = ROOT / "public" / "bg"
OUT.mkdir(parents=True, exist_ok=True)

TW = 16
# Logical map size in tiles (16:9-ish, HD after scale)
MW, MH = 60, 34
SCALE = 8  # → 7680×4352 is too big; use 5 → 4800×2720, or 4 → 3840×2176
SCALE = 4  # 3840×2176 crisp HD


def tile(sheet: Image.Image, tx: int, ty: int, w: int = 1, h: int = 1) -> Image.Image:
    return sheet.crop((tx * TW, ty * TW, (tx + w) * TW, (ty + h) * TW))


def paste(dst: Image.Image, spr: Image.Image, tx: int, ty: int) -> None:
    dst.alpha_composite(spr, (tx * TW, ty * TW))


def fill_grass(dst: Image.Image, sheet: Image.Image) -> None:
    # several grass variants from top of sheet
    variants = [tile(sheet, x, 0) for x in (0, 1, 2, 3)]
    for y in range(MH):
        for x in range(MW):
            g = variants[(x * 3 + y * 5) % len(variants)]
            paste(dst, g, x, y)


def stamp_rect(dst: Image.Image, sheet: Image.Image, sx: int, sy: int, sw: int, sh: int, dx: int, dy: int) -> None:
    paste(dst, tile(sheet, sx, sy, sw, sh), dx, dy)


def darken_navy(im: Image.Image) -> Image.Image:
    """Grade toward site navy/dusk without killing greens."""
    im = im.convert("RGBA")
    # slight desat + darken
    im = ImageEnhance.Brightness(im).enhance(0.82)
    im = ImageEnhance.Color(im).enhance(0.85)
    # navy wash
    wash = Image.new("RGBA", im.size, (20, 36, 63, 70))
    return Image.alpha_composite(im, wash)


def main() -> None:
    sheet = Image.open(SHEET).convert("RGBA")
    # replace pure black with transparent for object stamps
    px = sheet.load()
    assert px is not None
    for y in range(sheet.size[1]):
        for x in range(sheet.size[0]):
            r, g, b, a = px[x, y]
            if r < 8 and g < 8 and b < 8:
                px[x, y] = (0, 0, 0, 0)

    world = Image.new("RGBA", (MW * TW, MH * TW), (0, 0, 0, 255))
    fill_grass(world, sheet)

    # dirt path winding through center (path tiles ~ row 1-3)
    # horizontal path
    for x in range(8, 52):
        stamp_rect(world, sheet, 6, 1, 1, 1, x, 18)
        stamp_rect(world, sheet, 6, 1, 1, 1, x, 19)
    # vertical branch
    for y in range(6, 28):
        stamp_rect(world, sheet, 5, 2, 1, 1, 28, y)
        stamp_rect(world, sheet, 5, 2, 1, 1, 29, y)

    # tree wall top / sides (pine clusters often around row 6-8)
    for x in range(0, MW, 2):
        stamp_rect(world, sheet, 0, 7, 2, 2, x, 0)
        stamp_rect(world, sheet, 0, 7, 2, 2, x, MH - 2)
    for y in range(2, MH - 2, 2):
        stamp_rect(world, sheet, 2, 7, 2, 2, 0, y)
        stamp_rect(world, sheet, 2, 7, 2, 2, MW - 2, y)

    # cliffs / rocks (row ~4-5)
    stamp_rect(world, sheet, 12, 4, 4, 3, 4, 10)
    stamp_rect(world, sheet, 12, 4, 4, 3, 48, 22)
    stamp_rect(world, sheet, 16, 4, 3, 2, 42, 8)

    # water / pond (around row 16+)
    stamp_rect(world, sheet, 0, 16, 6, 4, 8, 22)
    stamp_rect(world, sheet, 6, 16, 5, 4, 40, 12)

    # houses (row ~32+)
    stamp_rect(world, sheet, 0, 32, 4, 4, 14, 8)
    stamp_rect(world, sheet, 4, 32, 4, 4, 34, 14)
    stamp_rect(world, sheet, 8, 32, 5, 4, 20, 24)
    stamp_rect(world, sheet, 14, 32, 4, 4, 46, 26)

    # signs / wells if present near row 38
    stamp_rect(world, sheet, 0, 38, 2, 2, 25, 16)
    stamp_rect(world, sheet, 2, 38, 2, 2, 32, 22)

    # fence bits
    for x in range(12, 24):
        stamp_rect(world, sheet, 10, 6, 1, 1, x, 14)

    graded = darken_navy(world)
    hd = graded.resize((MW * TW * SCALE, MH * TW * SCALE), Image.Resampling.NEAREST)
    out = OUT / "overworld.png"
    hd.save(out, format="PNG", optimize=True)
    # also keep jpg fallback for browsers that prefer
    hd.convert("RGB").save(OUT / "overworld.jpg", format="JPEG", quality=92)
    print(f"wrote {out} {hd.size}")
    print(f"wrote {OUT / 'overworld.jpg'}")


if __name__ == "__main__":
    main()
