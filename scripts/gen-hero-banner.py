"""Gera banner pixel-art original pro hero do pkatrade.

Cena: feira / rota com barraca de troca — paleta navy/creme/ouro/verde do site.
Canvas 192×72 escalado nearest-neighbor → public/hero/banner.png.
Lado esquerdo mais aberto (céu/grama) para overlay de copy.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "hero"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 192, 72
SCALE = 5  # → 960×360

SKY1 = (142, 180, 216, 255)
SKY2 = (168, 198, 228, 255)
SKY3 = (118, 158, 198, 255)
CLOUD = (247, 249, 252, 255)
NAVY = (28, 51, 88, 255)
NAVY2 = (20, 36, 63, 255)
CREAM = (244, 241, 232, 255)
CARD = (247, 249, 252, 255)
GOLD = (201, 162, 39, 255)
BRASS = (176, 141, 46, 255)
GOLD_SOFT = (232, 208, 120, 255)
GRASS1 = (106, 154, 88, 255)
GRASS2 = (86, 136, 72, 255)
GRASS3 = (61, 122, 82, 255)
GRASS4 = (74, 106, 56, 255)
PATH1 = (196, 168, 120, 255)
PATH2 = (176, 148, 100, 255)
PATH3 = (148, 116, 72, 255)
PATH4 = (120, 92, 56, 255)
WOOD1 = (176, 124, 68, 255)
WOOD2 = (144, 96, 48, 255)
WOOD3 = (104, 68, 32, 255)
WOOD4 = (72, 44, 20, 255)
BALL_R = (200, 64, 56, 255)
BALL_R2 = (160, 40, 36, 255)
BALL_W = (248, 248, 244, 255)
BALL_B = (32, 36, 44, 255)
TREE1 = (72, 128, 64, 255)
TREE2 = (48, 96, 52, 255)
TREE3 = (32, 72, 40, 255)
TRUNK = (96, 64, 32, 255)
TRUNK2 = (72, 48, 24, 255)
SKIN = (232, 200, 160, 255)
HAIR = (40, 48, 64, 255)
CLOTH = (56, 72, 112, 255)
CLOTH2 = (40, 52, 88, 255)
FLOWER = (216, 88, 96, 255)
FLOWER2 = (232, 176, 64, 255)
LANTERN = (232, 176, 64, 255)
LANTERN2 = (184, 120, 32, 255)
FENCE = (120, 92, 56, 255)


def px(img: Image.Image, x: int, y: int, c: tuple[int, int, int, int]) -> None:
    if 0 <= x < img.size[0] and 0 <= y < img.size[1]:
        img.putpixel((x, y), c)


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


def draw_sky(img: Image.Image) -> None:
    for y in range(0, 30):
        t = y / 29
        c = tuple(int(SKY1[i] * (1 - t) + SKY3[i] * t) for i in range(3)) + (255,)
        hline(img, 0, W - 1, y, c)
    # soft upper band
    for y in range(0, 8):
        hline(img, 0, W - 1, y, SKY2 if y % 2 == 0 else SKY1)
    for cx, cy in ((22, 5), (58, 3), (98, 6), (138, 4), (168, 7)):
        rect(img, cx, cy, cx + 12, cy + 2, CLOUD)
        rect(img, cx + 2, cy - 1, cx + 9, cy - 1, CLOUD)
        rect(img, cx + 3, cy + 3, cx + 10, cy + 3, CLOUD)
        px(img, cx + 1, cy + 1, CARD)


def draw_hills(img: Image.Image) -> None:
    for x in range(W):
        wave = 2 if (x // 9) % 2 == 0 else 0
        bump = 1 if (x % 17) < 4 else 0
        h = 22 + wave + bump
        for y in range(h, 30):
            px(img, x, y, TREE3 if y < h + 2 else GRASS4)


def draw_tree(img: Image.Image, tx: int, ty: int, big: bool = False) -> None:
    w = 7 if big else 5
    trunk_h = 8 if big else 6
    rect(img, tx + w // 2 - 1, ty + 5, tx + w // 2, ty + 4 + trunk_h, TRUNK)
    px(img, tx + w // 2, ty + 6, TRUNK2)
    rect(img, tx, ty + 1, tx + w, ty + 5, TREE1)
    rect(img, tx + 1, ty, tx + w - 1, ty, TREE1)
    if big:
        rect(img, tx - 1, ty + 2, tx + w + 1, ty + 4, TREE1)
        rect(img, tx + 1, ty - 1, tx + w - 1, ty - 1, TREE2)
    px(img, tx + 1, ty + 2, TREE2)
    px(img, tx + w - 1, ty + 3, TREE3)
    px(img, tx + 2, ty + 4, TREE2)


def draw_bush(img: Image.Image, x: int, y: int) -> None:
    rect(img, x, y + 1, x + 5, y + 3, TREE1)
    rect(img, x + 1, y, x + 4, y, TREE1)
    px(img, x + 1, y + 2, TREE2)
    px(img, x + 4, y + 1, TREE3)


def draw_flower(img: Image.Image, x: int, y: int, color: tuple[int, int, int, int]) -> None:
    px(img, x + 1, y + 2, GRASS3)
    px(img, x + 1, y + 1, color)
    px(img, x, y + 1, color)
    px(img, x + 2, y + 1, color)
    px(img, x + 1, y, GOLD_SOFT)


def draw_ground(img: Image.Image) -> None:
    rect(img, 0, 30, W - 1, H - 1, GRASS1)
    for y in range(30, H):
        for x in range(W):
            if (x + y * 3) % 5 == 0:
                px(img, x, y, GRASS2)
            if (x * 2 + y) % 11 == 0:
                px(img, x, y, GRASS3)
            if (x + y * 2) % 17 == 0:
                px(img, x, y, GRASS4)

    # cobble path — denser on the right (scene focus)
    rect(img, 62, 42, W - 4, 64, PATH1)
    for y in range(42, 65):
        for x in range(62, W - 3):
            tile = (x // 4 + y // 3) % 2 == 0
            if tile:
                px(img, x, y, PATH2)
            if (x + y) % 13 == 0:
                px(img, x, y, PATH3)
            if (x // 3 + y // 2) % 7 == 0:
                px(img, x, y, PATH4)
    hline(img, 62, W - 4, 42, PATH4)
    hline(img, 62, W - 4, 64, PATH4)
    vline(img, 62, 42, 64, PATH4)

    # soft path edge into grass
    for y in range(42, 65):
        for dx, c in ((1, PATH3), (2, GRASS2), (3, GRASS1)):
            px(img, 62 - dx, y, c)


def draw_fence(img: Image.Image) -> None:
    for x in range(8, 58, 7):
        vline(img, x, 48, 54, FENCE)
        px(img, x, 48, WOOD3)
    hline(img, 8, 55, 50, FENCE)
    hline(img, 8, 55, 52, WOOD3)


def draw_pokeball(img: Image.Image, cx: int, cy: int) -> None:
    rect(img, cx + 1, cy, cx + 3, cy, BALL_R)
    rect(img, cx, cy + 1, cx + 4, cy + 1, BALL_R)
    px(img, cx + 1, cy + 1, BALL_R2)
    rect(img, cx, cy + 2, cx + 4, cy + 2, BALL_B)
    rect(img, cx, cy + 3, cx + 4, cy + 3, BALL_W)
    rect(img, cx + 1, cy + 4, cx + 3, cy + 4, BALL_W)
    px(img, cx + 2, cy + 2, BALL_W)


def draw_stall(img: Image.Image) -> None:
    # posts
    rect(img, 88, 28, 91, 52, WOOD3)
    rect(img, 136, 28, 139, 52, WOOD3)
    px(img, 89, 30, WOOD2)
    px(img, 137, 30, WOOD2)

    # roof top
    rect(img, 84, 22, 143, 24, NAVY)
    hline(img, 84, 143, 22, NAVY2)
    # striped awning
    rect(img, 82, 25, 145, 31, CREAM)
    hline(img, 82, 145, 25, NAVY)
    hline(img, 82, 145, 31, WOOD4)
    for x in range(82, 146, 5):
        stripe = GOLD if ((x - 82) // 5) % 2 == 0 else BRASS
        vline(img, x, 26, 30, stripe)
        vline(img, x + 1, 26, 30, stripe)

    # hanging lanterns
    for lx in (94, 128):
        vline(img, lx, 31, 34, WOOD4)
        rect(img, lx - 1, 34, lx + 1, 37, LANTERN)
        px(img, lx, 35, GOLD_SOFT)
        px(img, lx, 37, LANTERN2)

    # trade board
    rect(img, 94, 32, 132, 42, CARD)
    hline(img, 94, 132, 32, NAVY)
    hline(img, 94, 132, 42, NAVY)
    vline(img, 94, 32, 42, NAVY)
    vline(img, 132, 32, 42, NAVY)
    for i, x0 in enumerate((97, 108, 119)):
        rect(img, x0, 34, x0 + 8, 40, CREAM)
        hline(img, x0, x0 + 8, 34, NAVY2)
        vline(img, x0, 34, 40, NAVY2)
        vline(img, x0 + 8, 34, 40, NAVY2)
        px(img, x0 + 2, 36, GOLD if i != 1 else BRASS)
        px(img, x0 + 3, 36, GOLD_SOFT)
        # tiny “sprite” stub
        rect(img, x0 + 4, 37, x0 + 6, 39, CLOTH if i == 0 else TREE1 if i == 1 else BALL_R)

    # counter
    rect(img, 86, 43, 141, 51, WOOD1)
    hline(img, 86, 141, 43, WOOD4)
    hline(img, 86, 141, 51, WOOD4)
    rect(img, 88, 45, 139, 49, WOOD2)
    for x in range(90, 138, 6):
        px(img, x, 47, WOOD3)

    draw_pokeball(img, 90, 38)
    draw_pokeball(img, 130, 38)

    # crates
    rect(img, 144, 46, 156, 56, WOOD2)
    hline(img, 144, 156, 46, WOOD1)
    hline(img, 144, 156, 56, WOOD4)
    rect(img, 146, 48, 154, 53, WOOD1)
    vline(img, 150, 48, 53, WOOD3)
    rect(img, 157, 50, 166, 58, WOOD3)
    hline(img, 157, 166, 50, WOOD2)
    rect(img, 159, 52, 164, 56, WOOD1)


def draw_sign(img: Image.Image) -> None:
    vline(img, 74, 40, 56, WOOD3)
    rect(img, 68, 34, 80, 44, WOOD1)
    hline(img, 68, 80, 34, WOOD4)
    hline(img, 68, 80, 44, WOOD4)
    vline(img, 68, 34, 44, WOOD4)
    vline(img, 80, 34, 44, WOOD4)
    # gold trade diamond
    px(img, 74, 37, GOLD)
    px(img, 73, 38, GOLD)
    px(img, 74, 38, GOLD_SOFT)
    px(img, 75, 38, GOLD)
    px(img, 72, 39, BRASS)
    px(img, 73, 39, GOLD)
    px(img, 74, 39, GOLD)
    px(img, 75, 39, GOLD)
    px(img, 76, 39, BRASS)
    px(img, 74, 40, GOLD)


def draw_trainer(img: Image.Image, x: int, y: int, facing_right: bool = True) -> None:
    # hair
    rect(img, x + 1, y, x + 3, y, HAIR)
    px(img, x + 2, y - 1, HAIR)
    # head
    rect(img, x + 1, y + 1, x + 3, y + 3, SKIN)
    px(img, x + (3 if facing_right else 1), y + 2, HAIR)  # eye hint
    # body
    rect(img, x + 1, y + 4, x + 3, y + 7, CLOTH)
    px(img, x + 2, y + 5, CLOTH2)
    # belt
    hline(img, x + 1, x + 3, y + 7, GOLD)
    # legs
    px(img, x + 1, y + 8, NAVY2)
    px(img, x + 3, y + 8, NAVY2)
    px(img, x + 1, y + 9, NAVY2)
    px(img, x + 3, y + 9, NAVY2)
    # shoes
    px(img, x + 1, y + 10, HAIR)
    px(img, x + 3, y + 10, HAIR)
    # arm
    if facing_right:
        px(img, x + 4, y + 5, SKIN)
        px(img, x + 4, y + 6, CLOTH)
    else:
        px(img, x, y + 5, SKIN)
        px(img, x, y + 6, CLOTH)


def draw_npc_vendor(img: Image.Image, x: int, y: int) -> None:
    # behind counter vibe
    rect(img, x + 1, y, x + 3, y, HAIR)
    rect(img, x + 1, y + 1, x + 3, y + 2, SKIN)
    rect(img, x + 1, y + 3, x + 3, y + 5, BRASS)
    px(img, x + 2, y + 4, GOLD)


def main() -> None:
    img = Image.new("RGBA", (W, H), SKY1)
    draw_sky(img)
    draw_hills(img)

    for tx, ty, big in (
        (2, 22, True),
        (14, 24, False),
        (26, 23, False),
        (170, 22, True),
        (180, 24, False),
    ):
        draw_tree(img, tx, ty, big)

    draw_ground(img)
    draw_fence(img)

    for bx, by in ((40, 56), (48, 58), (18, 54), (172, 58)):
        draw_bush(img, bx, by)

    for fx, fy, col in (
        (12, 58, FLOWER),
        (20, 60, FLOWER2),
        (34, 57, FLOWER),
        (52, 59, FLOWER2),
        (178, 60, FLOWER),
    ):
        draw_flower(img, fx, fy, col)

    draw_stall(img)
    draw_sign(img)
    draw_npc_vendor(img, 110, 36)
    draw_trainer(img, 76, 50, True)
    draw_trainer(img, 160, 48, False)

    # navy frame
    hline(img, 0, W - 1, 0, NAVY)
    hline(img, 0, W - 1, H - 1, NAVY)
    vline(img, 0, 0, H - 1, NAVY)
    vline(img, W - 1, 0, H - 1, NAVY)

    big = img.resize((W * SCALE, H * SCALE), Image.Resampling.NEAREST)
    out = OUT_DIR / "banner.png"
    big.save(out, format="PNG")
    img.save(OUT_DIR / "banner-native.png", format="PNG")
    print(f"wrote {out} ({big.size[0]}×{big.size[1]})")
    print(f"wrote {OUT_DIR / 'banner-native.png'} ({W}×{H})")


if __name__ == "__main__":
    main()
