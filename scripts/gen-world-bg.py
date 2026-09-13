"""Gera fundo overworld rico (grama + laterais com casas/rochas/água + sprites).

Usa sprites de public/sprites/map (fundo preto → transparente).
Paleta escura navy/olive/creme/ouro alinhada ao site.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "bg"
MAP = ROOT / "public" / "sprites" / "map"
OUT.mkdir(parents=True, exist_ok=True)

N = 48
GRASS_SCALE = 4
SIDE_W, SIDE_H = 72, 220
SIDE_SCALE = 3  # → 216×660

G0 = (52, 86, 64, 255)
G1 = (44, 74, 56, 255)
G2 = (36, 64, 50, 255)
G3 = (28, 52, 44, 255)
G4 = (62, 98, 72, 255)
G5 = (22, 40, 36, 255)
NAVY = (28, 51, 88, 255)
NAVY2 = (20, 36, 63, 255)
NAVY_SHADE = (24, 40, 56, 255)
CREAM = (232, 226, 210, 255)
CREAM2 = (210, 202, 184, 255)
GOLD = (201, 162, 39, 255)
BRASS = (176, 141, 46, 255)
DIRT = (110, 92, 64, 255)
DIRT2 = (86, 70, 48, 255)
PATH = (132, 112, 80, 255)
PATH2 = (108, 90, 64, 255)
ROCK = (96, 92, 88, 255)
ROCK2 = (72, 70, 68, 255)
ROCK3 = (52, 50, 50, 255)
WATER = (48, 92, 140, 255)
WATER2 = (36, 72, 112, 255)
WATER3 = (72, 120, 168, 255)
WOOD = (104, 72, 40, 255)
WOOD2 = (72, 48, 28, 255)
ROOF = (160, 56, 52, 255)
ROOF2 = (120, 40, 40, 255)
WINDOW = (72, 120, 168, 255)
DOOR = (56, 72, 112, 255)
FLOWER_GOLD = (201, 162, 39, 255)
FLOWER_CREAM = (220, 214, 196, 255)
FLOWER_SKY = (122, 156, 188, 255)
CENTER = (243, 230, 184, 255)
TREE1 = (34, 68, 52, 255)
TREE2 = (26, 52, 42, 255)
TREE3 = (18, 36, 34, 255)
TRUNK = (78, 56, 34, 255)
TRUNK2 = (56, 40, 26, 255)
TRANSPARENT = (0, 0, 0, 0)

# dex → path relative to MAP (prefer normals that exist)
SPRITE_PICKS = [
    "129.png",  # Magikarp
    "133.png",  # Eevee
    "175.png",  # Togepi
    "185.png",  # Sudowoodo
    "094.1.png",  # shiny Gengar
    "131.png",  # Lapras
    "143.png",  # Snorlax
    "128.png",  # Tauros?
    "152.png",
    "155.png",
]


def px(img: Image.Image, x: int, y: int, c: tuple[int, int, int, int]) -> None:
    w, h = img.size
    if 0 <= x < w and 0 <= y < h:
        img.putpixel((x, y), c)


def px_wrap(img: Image.Image, x: int, y: int, c: tuple[int, int, int, int]) -> None:
    n = img.size[0]
    img.putpixel((x % n, y % n), c)


def rect(
    img: Image.Image,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    c: tuple[int, int, int, int],
) -> None:
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px(img, x, y, c)


def hline(img: Image.Image, x0: int, x1: int, y: int, c: tuple[int, int, int, int]) -> None:
    for x in range(x0, x1 + 1):
        px(img, x, y, c)


def vline(img: Image.Image, x: int, y0: int, y1: int, c: tuple[int, int, int, int]) -> None:
    for y in range(y0, y1 + 1):
        px(img, x, y, c)


def flower(img: Image.Image, x: int, y: int, petal: tuple[int, int, int, int]) -> None:
    px(img, x, y, CENTER)
    px(img, x - 1, y, petal)
    px(img, x + 1, y, petal)
    px(img, x, y - 1, petal)
    px(img, x, y + 1, petal)


def fill_grass(img: Image.Image) -> None:
    w, h = img.size
    for y in range(h):
        for x in range(w):
            v = (x * 17 + y * 29) % 11
            if v == 0:
                c = G0
            elif v == 1:
                c = G4
            elif v == 2:
                c = G2
            elif v == 3:
                c = NAVY_SHADE
            elif (x + y * 3) % 13 == 0:
                c = G3
            else:
                c = G1
            px(img, x, y, c)


def draw_grass_tile() -> Image.Image:
    img = Image.new("RGBA", (N, N), G1)
    fill_grass(img)
    for x, y in (
        (10, 8),
        (11, 8),
        (12, 8),
        (10, 9),
        (11, 9),
        (12, 9),
        (34, 28),
        (35, 28),
        (34, 29),
        (35, 29),
    ):
        px_wrap(img, x, y, DIRT if (x + y) % 2 == 0 else DIRT2)
    flower(img, 8, 22, FLOWER_GOLD)
    flower(img, 28, 14, FLOWER_SKY)
    flower(img, 42, 34, BRASS)
    flower(img, 16, 36, FLOWER_CREAM)
    return img


def tree(img: Image.Image, tx: int, ty: int, big: bool = True) -> None:
    if big:
        for dx, dy in (
            (0, 2),
            (1, 1),
            (2, 0),
            (3, 0),
            (4, 0),
            (5, 1),
            (6, 2),
            (1, 2),
            (2, 1),
            (3, 1),
            (4, 1),
            (5, 2),
            (2, 2),
            (3, 2),
            (4, 2),
            (2, 3),
            (3, 3),
            (4, 3),
            (1, 3),
            (5, 3),
            (3, -1),
            (0, 3),
            (6, 3),
        ):
            px(img, tx + dx, ty + dy, TREE1 if (dx + dy) % 3 else TREE2)
        px(img, tx + 2, ty + 1, TREE3)
        px(img, tx + 3, ty + 4, TRUNK)
        px(img, tx + 3, ty + 5, TRUNK2)
        px(img, tx + 3, ty + 6, TRUNK)
    else:
        for dx, dy in (
            (1, 1),
            (2, 0),
            (3, 0),
            (4, 1),
            (1, 2),
            (2, 1),
            (3, 1),
            (4, 2),
            (2, 2),
            (3, 2),
            (2, 3),
            (3, 3),
        ):
            px(img, tx + dx, ty + dy, TREE1 if dy < 2 else TREE2)
        px(img, tx + 2, ty + 4, TRUNK)
        px(img, tx + 2, ty + 5, TRUNK2)


def rock(img: Image.Image, x: int, y: int, w: int = 8, h: int = 6) -> None:
    rect(img, x + 1, y, x + w - 2, y + h - 1, ROCK)
    rect(img, x, y + 1, x + w - 1, y + h - 2, ROCK2)
    px(img, x + 2, y + 1, CREAM2)
    px(img, x + w - 3, y + h - 2, ROCK3)
    hline(img, x + 1, x + w - 2, y + h - 1, ROCK3)


def cliff(img: Image.Image, x: int, y: int, w: int = 18, h: int = 14) -> None:
    rect(img, x, y, x + w, y + h, ROCK2)
    for yy in range(y, y + h + 1):
        for xx in range(x, x + w + 1):
            if (xx + yy) % 4 == 0:
                px(img, xx, yy, ROCK)
            if (xx * 2 + yy) % 7 == 0:
                px(img, xx, yy, ROCK3)
    hline(img, x, x + w, y, CREAM2)
    # cave mouth
    cx0, cx1 = x + w // 3, x + 2 * w // 3
    rect(img, cx0, y + h - 6, cx1, y + h, NAVY2)
    rect(img, cx0 + 1, y + h - 5, cx1 - 1, y + h - 1, (12, 16, 24, 255))


def water_pond(img: Image.Image, x: int, y: int, w: int = 22, h: int = 14) -> None:
    rect(img, x, y, x + w, y + h, WATER)
    for yy in range(y, y + h + 1):
        for xx in range(x, x + w + 1):
            if (xx + yy * 2) % 5 == 0:
                px(img, xx, yy, WATER2)
            if (xx * 3 + yy) % 11 == 0:
                px(img, xx, yy, WATER3)
    # shore rocks
    for sx, sy in ((x - 1, y + 2), (x + w + 1, y + 4), (x + 3, y + h + 1), (x + w - 4, y - 1)):
        rock(img, sx, sy, 4, 3)
    # lily
    px(img, x + w // 2, y + h // 2, TREE1)
    px(img, x + w // 2 + 1, y + h // 2, TREE2)


def fence(img: Image.Image, x0: int, x1: int, y: int) -> None:
    hline(img, x0, x1, y, WOOD)
    hline(img, x0, x1, y + 2, WOOD2)
    for x in range(x0, x1 + 1, 4):
        vline(img, x, y - 1, y + 3, WOOD2)


def path_strip(img: Image.Image, x0: int, y0: int, x1: int, y1: int) -> None:
    rect(img, x0, y0, x1, y1, PATH)
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x // 3 + y // 2) % 2 == 0:
                px(img, x, y, PATH2)
            if (x + y) % 9 == 0:
                px(img, x, y, DIRT2)


def house_trade(img: Image.Image, x: int, y: int) -> None:
    """Casa de troca: paredes creme, telhado navy/ouro (sem logo de PC)."""
    # roof
    rect(img, x + 1, y, x + 22, y + 4, NAVY)
    hline(img, x + 1, x + 22, y, NAVY2)
    for i in range(x + 2, x + 22, 3):
        vline(img, i, y + 1, y + 3, GOLD if (i // 3) % 2 == 0 else BRASS)
    # walls
    rect(img, x + 2, y + 5, x + 21, y + 16, CREAM)
    hline(img, x + 2, x + 21, y + 5, CREAM2)
    hline(img, x + 2, x + 21, y + 16, WOOD2)
    vline(img, x + 2, y + 5, y + 16, WOOD2)
    vline(img, x + 21, y + 5, y + 16, WOOD2)
    # door + windows
    rect(img, x + 10, y + 10, x + 14, y + 16, DOOR)
    px(img, x + 13, y + 13, GOLD)
    rect(img, x + 4, y + 8, x + 7, y + 11, WINDOW)
    rect(img, x + 16, y + 8, x + 19, y + 11, WINDOW)
    hline(img, x + 4, x + 7, y + 9, NAVY2)
    hline(img, x + 16, x + 19, y + 9, NAVY2)
    # sign diamond
    px(img, x + 12, y + 6, GOLD)
    px(img, x + 11, y + 7, GOLD)
    px(img, x + 12, y + 7, CENTER)
    px(img, x + 13, y + 7, GOLD)
    px(img, x + 12, y + 8, BRASS)


def house_small(img: Image.Image, x: int, y: int) -> None:
    rect(img, x + 1, y, x + 14, y + 3, ROOF)
    hline(img, x + 1, x + 14, y, ROOF2)
    rect(img, x + 2, y + 4, x + 13, y + 12, CREAM2)
    hline(img, x + 2, x + 13, y + 12, WOOD2)
    rect(img, x + 6, y + 7, x + 9, y + 12, DOOR)
    rect(img, x + 3, y + 6, x + 5, y + 8, WINDOW)


def signpost(img: Image.Image, x: int, y: int) -> None:
    vline(img, x + 2, y + 4, y + 12, WOOD2)
    rect(img, x, y, x + 5, y + 5, WOOD)
    hline(img, x, x + 5, y, WOOD2)
    px(img, x + 2, y + 2, GOLD)
    px(img, x + 1, y + 3, BRASS)
    px(img, x + 3, y + 3, BRASS)


def load_sprite(name: str, max_h: int = 28) -> Image.Image | None:
    path = MAP / name
    if not path.exists():
        return None
    im = Image.open(path).convert("RGBA")
    # black / near-black chroma key
    pixels = im.load()
    assert pixels is not None
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < 18 and g < 18 and b < 18:
                pixels[x, y] = (0, 0, 0, 0)
    # scale down keeping aspect
    if h > max_h:
        nh = max_h
        nw = max(8, int(w * (nh / h)))
        im = im.resize((nw, nh), Image.Resampling.NEAREST)
    return im


def paste_sprite(dst: Image.Image, spr: Image.Image, x: int, y: int) -> None:
    # anchor bottom-center-ish
    dst.alpha_composite(spr, (x, y))


def draw_side(left: bool) -> Image.Image:
    img = Image.new("RGBA", (SIDE_W, SIDE_H), TRANSPARENT)
    fill_grass(img)

    # vertical path
    if left:
        path_strip(img, 28, 0, 42, SIDE_H - 1)
    else:
        path_strip(img, 28, 0, 42, SIDE_H - 1)

    # scenery blocks (mirrored conceptually for left/right)
    tree(img, 4, 6, True)
    tree(img, 52, 10, False)
    house_trade(img, 8, 28)
    fence(img, 6, 48, 48)
    flower(img, 50, 52, FLOWER_GOLD)
    flower(img, 54, 56, FLOWER_CREAM)

    water_pond(img, 6, 62, 24, 16)
    rock(img, 48, 70, 10, 7)
    rock(img, 54, 78, 8, 5)
    signpost(img, 36, 84)

    house_small(img, 40, 100)
    tree(img, 8, 108, False)
    fence(img, 10, 55, 118)

    cliff(img, 4, 130, 28, 18)
    rock(img, 40, 145, 12, 8)
    tree(img, 54, 155, True)
    flower(img, 34, 168, FLOWER_SKY)
    flower(img, 12, 175, FLOWER_GOLD)

    house_small(img, 8, 182)
    path_strip(img, 28, 195, 50, SIDE_H - 1)
    fence(img, 4, 60, 208)
    rock(img, 52, 200, 9, 6)

    # sprites
    picks = SPRITE_PICKS if left else list(reversed(SPRITE_PICKS))
    placements = [
        (picks[0], 34, 55, 22),  # near water
        (picks[1], 48, 90, 24),
        (picks[2], 10, 95, 20),
        (picks[3], 44, 155, 32),  # near cliff / rock vibe
        (picks[4], 12, 160, 26),
        (picks[5] if len(picks) > 5 else picks[0], 30, 48, 18),
    ]
    for name, sx, sy, mh in placements:
        spr = load_sprite(name, max_h=mh)
        if spr is None:
            continue
        # keep on canvas
        x = max(0, min(SIDE_W - spr.size[0], sx))
        y = max(0, min(SIDE_H - spr.size[1], sy))
        paste_sprite(img, spr, x, y)

    if not left:
        img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    # soft navy edge toward center panel
    edge_x = SIDE_W - 1 if left else 0
    for y in range(SIDE_H):
        px(img, edge_x, y, (*NAVY2[:3], 100))
        px(img, edge_x - (1 if left else -1), y, (*NAVY2[:3], 55))

    return img


def draw_bottom_strip() -> Image.Image:
    """Faixa inferior horizontal: caminho + pedras + alguns mons."""
    w, h = 320, 48
    img = Image.new("RGBA", (w, h), TRANSPARENT)
    fill_grass(img)
    path_strip(img, 0, 18, w - 1, 38)
    fence(img, 8, w - 8, 14)
    for x in (20, 70, 140, 210, 270):
        rock(img, x, 28, 8, 5)
    for x in (40, 100, 180, 250):
        tree(img, x, 2, False)
    flower(img, 55, 10, FLOWER_GOLD)
    flower(img, 160, 8, FLOWER_CREAM)
    flower(img, 240, 12, FLOWER_SKY)

    for name, x, mh in (("129.png", 90, 18), ("133.png", 200, 20), ("175.png", 280, 16)):
        spr = load_sprite(name, max_h=mh)
        if spr:
            paste_sprite(img, spr, x, h - spr.size[1] - 4)
    return img


def main() -> None:
    grass = draw_grass_tile()
    grass.save(OUT / "grass-native.png")
    grass.resize((N * GRASS_SCALE, N * GRASS_SCALE), Image.Resampling.NEAREST).save(
        OUT / "grass-tile.png"
    )

    left = draw_side(left=True)
    right = draw_side(left=False)
    tw, th = left.size[0] * SIDE_SCALE, left.size[1] * SIDE_SCALE
    left.resize((tw, th), Image.Resampling.NEAREST).save(OUT / "overworld-left.png")
    right.resize((tw, th), Image.Resampling.NEAREST).save(OUT / "overworld-right.png")
    left.save(OUT / "overworld-left-native.png")
    right.save(OUT / "overworld-right-native.png")

    bottom = draw_bottom_strip()
    bw, bh = bottom.size[0] * 3, bottom.size[1] * 3
    bottom.resize((bw, bh), Image.Resampling.NEAREST).save(OUT / "overworld-bottom.png")
    bottom.save(OUT / "overworld-bottom-native.png")

    # keep legacy names pointing to new sides (compat)
    left.resize((tw, th), Image.Resampling.NEAREST).save(OUT / "trees-side.png")
    right.resize((tw, th), Image.Resampling.NEAREST).save(OUT / "trees-side-right.png")

    print(f"grass {N * GRASS_SCALE}×{N * GRASS_SCALE}")
    print(f"sides {tw}×{th}")
    print(f"bottom {bw}×{bh}")


if __name__ == "__main__":
    main()
