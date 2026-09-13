"""One-off: decrypt things.dat + spr, extract one creature outfit sprite tile."""
from __future__ import annotations

import os
import struct
import zlib
from pathlib import Path

from Crypto.Cipher import AES
from PIL import Image

GAME = Path(os.environ["LOCALAPPDATA"]) / "PokeAlliance Games" / "PokeAlliance"
OUT = Path(__file__).resolve().parent.parent / ".tmp-sprite-test"

SRC_DAT_SIGNATURE = 0xBCBCF8F6
SRC_SPR_SIGNATURE = 0x5D97AB7B

U16_ATTRS = {0x00, 0x09, 0x1A, 0x1D, 0x1E, 0x21, 0x23}
U32_ATTRS = {0x16, 0x19}
FLAGS = {
    1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 23, 24, 27, 28, 31, 32, 36, 37, 38, 39, 40, 0x28, 0x29,
}
FIXED_LEN_ATTRS = {0x2B: 5}


def master_key(game_dir: Path) -> bytes:
    init = (game_dir / "init.lua").read_bytes()
    return init[0:16] + init[48:64]


def decrypt_file(data: bytes, key: bytes) -> bytes | None:
    if len(data) <= 0x0F or (len(data) - 16) % 16 != 0:
        return None
    pt = AES.new(key, AES.MODE_CBC, data[0:16]).decrypt(data[16:])
    try:
        return zlib.decompress(pt)
    except zlib.error:
        return None


def parse_dat(data: bytes):
    sig = struct.unpack_from("<I", data, 0)[0]
    assert sig == SRC_DAT_SIGNATURE, f"bad dat sig {sig:#x}"
    counts = struct.unpack_from("<4H", data, 4)
    pos = 12

    def parse_record(rid: int):
        nonlocal pos
        while True:
            a = data[pos]
            pos += 1
            if a == 0xFF:
                break
            if a in FLAGS:
                pass
            elif a in U16_ATTRS:
                pos += 2
            elif a in U32_ATTRS:
                pos += 4
            elif a == 0x22:
                pos += 6
                n = struct.unpack_from("<H", data, pos)[0]
                pos += 2 + n + 4
            elif a == 0x2A:
                pos += 16
            elif a in FIXED_LEN_ATTRS:
                pos += FIXED_LEN_ATTRS[a]
            else:
                raise ValueError(f"rid {rid}: unknown attr {a:#x} at {pos-1:#x}")

        w, h = data[pos], data[pos + 1]
        pos += 2
        exact = 0
        if w > 1 or h > 1:
            exact = data[pos]
            pos += 1
        layers, px, py, pz, frames = struct.unpack_from("<5B", data, pos)
        pos += 5
        n = w * h * layers * px * py * pz * frames
        sids = list(struct.unpack_from(f"<{n}I", data, pos))
        pos += 4 * n
        return {
            "w": w,
            "h": h,
            "exact": exact,
            "layers": layers,
            "px": px,
            "py": py,
            "pz": pz,
            "frames": frames,
            "sids": sids,
        }

    cats = []
    for ci, expected in enumerate(counts):
        recs = []
        for i in range(expected):
            if pos >= len(data):
                break
            recs.append(parse_record(i))
        cats.append(recs)
        print(f"category {ci}: {len(recs)}/{expected} pos={pos:#x}")
    if pos != len(data):
        print(f"WARNING trailing: pos={pos:#x} size={len(data):#x}")
    return cats  # items, creatures, effects, missiles


def load_spr(game_dir: Path, key: bytes) -> bytes:
    parts_dir = game_dir / "data" / "things"
    parts = sorted(
        parts_dir.glob("things.spr.part*"),
        key=lambda p: int(p.name.rsplit("part", 1)[1]),
    )
    blobs: list[bytes] = []
    for part in parts:
        raw = part.read_bytes()
        out = decrypt_file(raw, key)
        if out is None:
            raise RuntimeError(f"failed decrypt {part.name}")
        blobs.append(out)
        print(f"decrypted {part.name} -> {len(out)} bytes")
    spr = b"".join(blobs)
    print(f"things.spr total {len(spr)} bytes from {len(parts)} parts")
    return spr


def decode_sprite(spr: bytes, sprite_id: int) -> Image.Image | None:
    """Decode one 32x32 RGBA sprite (1-based id)."""
    if sprite_id <= 0:
        return None
    sig, count = struct.unpack_from("<II", spr, 0)
    assert sig == SRC_SPR_SIGNATURE, f"bad spr sig {sig:#x}"
    off = struct.unpack_from("<I", spr, 8 + (sprite_id - 1) * 4)[0]
    if off == 0:
        return None
    data_size = struct.unpack_from("<H", spr, off + 3)[0]
    start = off + 5
    end = start + data_size
    pos = start
    pixels = bytearray(32 * 32 * 4)
    written = 0
    while written < 1024 and pos + 4 <= end:
        transparent, colored = struct.unpack_from("<HH", spr, pos)
        pos += 4
        written += transparent
        for _ in range(colored):
            if written >= 1024 or pos + 4 > end:
                break
            pixels[written * 4 : written * 4 + 4] = spr[pos : pos + 4]
            pos += 4
            written += 1
    return Image.frombytes("RGBA", (32, 32), bytes(pixels))


def compose_outfit(spr: bytes, rec: dict, pattern_x: int = 2, frame: int = 0) -> Image.Image:
    """Compose w*h tiles for one direction (patternX) / frame."""
    import sys
    from pathlib import Path as _Path

    _scripts = str(_Path(__file__).resolve().parent)
    if _scripts not in sys.path:
        sys.path.insert(0, _scripts)
    from sprite_compose import compose_outfit as _compose

    return _compose(decode_sprite, spr, rec, pattern_x=pattern_x, frame=frame)


def main() -> int:
    OUT.mkdir(exist_ok=True)
    key = master_key(GAME)

    dat_raw = (GAME / "data" / "things" / "things.dat").read_bytes()
    dat = decrypt_file(dat_raw, key)
    assert dat is not None, "dat decrypt failed"
    (OUT / "things.dat.decrypted").write_bytes(dat)
    print(f"dat decrypted {len(dat)} bytes")

    items, creatures, effects, missiles = parse_dat(dat)
    print(f"creatures={len(creatures)}")

    # Pick a multi-tile outfit that looks like a pokemon (w/h >= 1, px=4 dirs)
    candidates = []
    for i, rec in enumerate(creatures):
        if rec["px"] >= 4 and rec["w"] * rec["h"] >= 1 and any(rec["sids"]):
            candidates.append((i + 1, rec))  # creature ids from 1
    print(f"outfit-like creatures: {len(candidates)}")

    # Prefer lookType around common starters; also dump a few samples
    targets = []
    for look_id in (25, 1, 4, 7, 150, 94, 373):
        if 1 <= look_id <= len(creatures):
            targets.append((look_id, creatures[look_id - 1]))
    # plus first fat outfit
    for look_id, rec in candidates[:5]:
        if (look_id, rec) not in targets:
            targets.append((look_id, rec))

    spr = load_spr(GAME, key)
    sig = struct.unpack_from("<I", spr, 0)[0]
    count = struct.unpack_from("<I", spr, 4)[0]
    print(f"spr sig={sig:#x} count={count}")

    for look_id, rec in targets[:8]:
        print(
            f"lookType {look_id}: {rec['w']}x{rec['h']} layers={rec['layers']} "
            f"px={rec['px']} frames={rec['frames']} sids={len(rec['sids'])}"
        )
        img = compose_outfit(spr, rec, pattern_x=2, frame=0)
        # scale up for visibility
        big = img.resize((img.width * 4, img.height * 4), Image.NEAREST)
        path = OUT / f"looktype_{look_id}_sprite.png"
        big.save(path)
        print(f"  wrote {path} ({img.width}x{img.height} -> {big.width}x{big.height})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
