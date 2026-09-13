"""Generate original 16×16 pixel-art gym-style badges for the footer."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public" / "badges"
OUT.mkdir(parents=True, exist_ok=True)

K = (20, 24, 32, 255)
W = (248, 248, 240, 255)
G1, G2, G3 = (168, 168, 176, 255), (112, 112, 120, 255), (72, 72, 80, 255)
B1, B2, B3 = (120, 200, 240, 255), (48, 120, 200, 255), (24, 72, 152, 255)
Y1, Y2, Y3 = (255, 232, 96, 255), (232, 176, 32, 255), (184, 120, 16, 255)
R1, R2 = (255, 96, 96, 255), (216, 48, 48, 255)
O1 = (255, 160, 48, 255)
P1, P2 = (248, 144, 200, 255), (200, 64, 144, 255)
V1 = (176, 120, 232, 255)
GR1, GR2 = (120, 208, 96, 255), (56, 144, 64, 255)
BR1, BR2, BR3 = (200, 144, 72, 255), (144, 88, 40, 255), (96, 56, 24, 255)

N = 16


def px(img: Image.Image, x: int, y: int, c: tuple[int, int, int, int]) -> None:
    if 0 <= x < img.size[0] and 0 <= y < img.size[1]:
        img.putpixel((x, y), c)


def fill(img: Image.Image, cells: list[tuple[int, int]], c: tuple[int, int, int, int]) -> None:
    for x, y in cells:
        px(img, x, y, c)


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


def outline(img: Image.Image, cells: list[tuple[int, int]], edge: tuple[int, int, int, int]) -> None:
    s = set(cells)
    for x, y in cells:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (x + dx, y + dy) not in s:
                px(img, x + dx, y + dy, edge)


def cells_from_rows(rows: dict[int, range | list[int]]) -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    for y, xs in rows.items():
        for x in xs:
            out.append((x, y))
    return out


def new() -> Image.Image:
    return Image.new("RGBA", (N, N), (0, 0, 0, 0))


def save(img: Image.Image, name: str) -> None:
    big = img.resize((32, 32), Image.NEAREST)
    path = OUT / name
    big.save(path)
    print("wrote", path.name)


def main() -> None:
    for p in OUT.glob("kanto-*.png"):
        p.unlink()

    # 1 Boulder
    img = new()
    body = cells_from_rows(
        {
            3: range(6, 10),
            4: range(4, 12),
            5: range(3, 13),
            6: range(3, 13),
            7: range(3, 13),
            8: range(3, 13),
            9: range(3, 13),
            10: range(3, 13),
            11: range(4, 12),
            12: range(6, 10),
        }
    )
    fill(img, body, G2)
    for x, y in body:
        if x + y < 14:
            px(img, x, y, G1)
        if x + y > 18:
            px(img, x, y, G3)
    px(img, 5, 5, W)
    px(img, 6, 5, W)
    px(img, 5, 6, W)
    outline(img, body, K)
    save(img, "pixel-1.png")

    # 2 Cascade
    img = new()
    body = cells_from_rows(
        {
            2: range(7, 9),
            3: range(6, 10),
            4: range(5, 11),
            5: range(4, 12),
            6: range(4, 12),
            7: range(4, 12),
            8: range(4, 12),
            9: range(5, 11),
            10: range(5, 11),
            11: range(6, 10),
            12: range(7, 9),
        }
    )
    fill(img, body, B2)
    for x, y in body:
        if x <= 6:
            px(img, x, y, B1)
        if y >= 10:
            px(img, x, y, B3)
    px(img, 6, 5, W)
    px(img, 7, 4, W)
    outline(img, body, K)
    save(img, "pixel-2.png")

    # 3 Thunder
    img = new()
    body: list[tuple[int, int]] = []
    for y in range(2, 14):
        for x in range(2, 14):
            if abs(x - 7.5) + abs(y - 7.5) <= 5.5:
                body.append((x, y))
    for x, y in [
        (7, 1),
        (8, 1),
        (7, 2),
        (8, 2),
        (1, 7),
        (1, 8),
        (2, 7),
        (2, 8),
        (13, 7),
        (13, 8),
        (14, 7),
        (14, 8),
        (7, 13),
        (8, 13),
        (7, 14),
        (8, 14),
        (3, 3),
        (4, 3),
        (3, 4),
        (12, 3),
        (11, 3),
        (12, 4),
        (3, 12),
        (3, 11),
        (4, 12),
        (12, 12),
        (12, 11),
        (11, 12),
    ]:
        body.append((x, y))
    body = list(set(body))
    fill(img, body, Y2)
    for x, y in body:
        if y <= 5 or (x <= 5 and y <= 8):
            px(img, x, y, Y1)
        if y >= 11:
            px(img, x, y, Y3)
    px(img, 6, 5, W)
    px(img, 7, 5, W)
    outline(img, body, K)
    save(img, "pixel-3.png")

    # 4 Rainbow
    img = new()
    body = []
    for y in range(6, 10):
        for x in range(6, 10):
            body.append((x, y))
    for y in range(1, 5):
        for x in range(6, 10):
            body.append((x, y))
    for y in range(11, 15):
        for x in range(6, 10):
            body.append((x, y))
    for y in range(6, 10):
        for x in range(1, 5):
            body.append((x, y))
    for y in range(6, 10):
        for x in range(11, 15):
            body.append((x, y))
    for y in range(3, 6):
        for x in range(3, 6):
            body.append((x, y))
    for y in range(3, 6):
        for x in range(10, 13):
            body.append((x, y))
    for y in range(10, 13):
        for x in range(3, 6):
            body.append((x, y))
    for y in range(10, 13):
        for x in range(10, 13):
            body.append((x, y))
    body = list(set(body))
    for x, y in body:
        if y <= 4:
            c = Y1
        elif x >= 11:
            c = R1
        elif y >= 11:
            c = V1
        elif x <= 4:
            c = B1
        elif x + y <= 12:
            c = O1
        elif x >= 9 and y <= 8:
            c = P1
        else:
            c = GR1
        px(img, x, y, c)
    rect(img, 6, 6, 9, 9, Y2)
    px(img, 7, 7, W)
    px(img, 8, 7, W)
    outline(img, body, K)
    save(img, "pixel-4.png")

    # 5 Soul
    img = new()
    body = cells_from_rows(
        {
            3: list(range(4, 7)) + list(range(9, 12)),
            4: list(range(3, 8)) + list(range(8, 13)),
            5: range(3, 13),
            6: range(3, 13),
            7: range(3, 13),
            8: range(4, 12),
            9: range(5, 11),
            10: range(6, 10),
            11: range(7, 9),
        }
    )
    fill(img, body, P2)
    for x, y in body:
        if y <= 5 and x <= 8:
            px(img, x, y, P1)
    px(img, 5, 5, W)
    px(img, 4, 5, W)
    outline(img, body, K)
    save(img, "pixel-5.png")

    # 6 Marsh
    img = new()
    body = []
    for y in range(10, 15):
        body.append((7, y))
        body.append((8, y))
    body += cells_from_rows(
        {
            2: range(7, 9),
            3: range(6, 10),
            4: range(5, 11),
            5: range(4, 12),
            6: range(3, 12),
            7: range(3, 12),
            8: range(4, 12),
            9: range(5, 11),
            10: range(6, 10),
        }
    )
    body = list(set(body))
    fill(img, body, GR2)
    for x, y in body:
        if x <= 6 and y <= 8:
            px(img, x, y, GR1)
    for y in range(4, 11):
        px(img, 7, y, Y3)
    px(img, 5, 4, W)
    outline(img, body, K)
    save(img, "pixel-6.png")

    # 7 Volcano
    img = new()
    body = cells_from_rows(
        {
            2: range(7, 9),
            3: range(6, 10),
            4: range(5, 11),
            5: list(range(4, 8)) + list(range(8, 12)),
            6: range(3, 13),
            7: range(3, 13),
            8: range(3, 13),
            9: range(4, 12),
            10: range(4, 12),
            11: range(5, 11),
            12: range(6, 10),
            13: range(7, 9),
        }
    )
    fill(img, body, R2)
    for x, y in body:
        if y <= 6:
            px(img, x, y, O1)
        if 7 <= y <= 9 and 5 <= x <= 10:
            px(img, x, y, Y1)
    px(img, 7, 5, W)
    outline(img, body, K)
    save(img, "pixel-7.png")

    # 8 Earth
    img = new()
    body = []
    for y in range(2, 14):
        for x in range(2, 14):
            if (x - 7.5) ** 2 + (y - 7.5) ** 2 <= 5.6**2:
                body.append((x, y))
    fill(img, body, BR2)
    for x, y in body:
        if x + y < 13:
            px(img, x, y, BR1)
        if x + y > 18:
            px(img, x, y, BR3)
    for x, y in [
        (7, 4),
        (7, 5),
        (8, 6),
        (9, 7),
        (6, 8),
        (5, 9),
        (8, 9),
        (9, 10),
        (7, 11),
    ]:
        px(img, x, y, K)
    px(img, 5, 5, W)
    px(img, 6, 4, W)
    outline(img, body, K)
    save(img, "pixel-8.png")


if __name__ == "__main__":
    main()
