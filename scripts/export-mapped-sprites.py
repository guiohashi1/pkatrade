"""Export map sprites for dex 1-251 into public/sprites/map/.

Normals → {dex:03d}.png
Early-gen shinies (1–98) → {dex:03d}.1.png

Dex 1–98 normals are intentionally skipped (Ditto-transform remakes at +901).
"""
from __future__ import annotations

import json
import sys
from importlib.machinery import SourceFileLoader
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from looktype_map import formula_label, looktype_for_dex  # noqa: E402
from sprite_compose import export_outfit_png  # noqa: E402

mod = SourceFileLoader(
    "extract_sprite_test",
    str(Path(__file__).resolve().parent / "extract-sprite-test.py"),
).load_module()

OUT = ROOT / "public" / "sprites" / "map"
CATALOG = ROOT / "data" / "catalog.json"


def export_one(creatures, spr, look: int, path: Path):
    rec = creatures[look - 1]
    if not any(rec["sids"]):
        return None
    img = export_outfit_png(
        mod.decode_sprite, spr, rec, pattern_x=2, frame=0, scale=3
    )
    img.save(path, format="PNG")
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    # Remove stale early-gen normals (were Ditto transforms).
    for dex in range(1, 99):
        stale = OUT / f"{dex:03d}.png"
        if stale.exists():
            stale.unlink()
            print(f"removed ditto-normal {stale.name}")

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))["pokemon"]
    by_dex: dict[int, dict] = {}
    for p in catalog:
        if p["shiny"] or not (1 <= p["dex"] <= 251):
            continue
        by_dex.setdefault(p["dex"], p)
    entries = [by_dex[d] for d in sorted(by_dex)]

    key = mod.master_key(mod.GAME)
    dat = mod.decrypt_file(
        (mod.GAME / "data" / "things" / "things.dat").read_bytes(), key
    )
    assert dat is not None
    _items, creatures, _effects, _missiles = mod.parse_dat(dat)
    spr = mod.load_spr(mod.GAME, key)

    mapping = []
    skipped = []
    for p in entries:
        dex = p["dex"]
        look = looktype_for_dex(dex, shiny=False)
        if look is None:
            skipped.append(
                {
                    "dex": dex,
                    "name": p["name"],
                    "reason": formula_label(dex, shiny=False),
                }
            )
        elif not (1 <= look <= len(creatures)):
            skipped.append(
                {
                    "dex": dex,
                    "name": p["name"],
                    "reason": f"lookType {look} out of range",
                }
            )
        else:
            path = OUT / f"{dex:03d}.png"
            img = export_one(creatures, spr, look, path)
            if img is None:
                skipped.append(
                    {"dex": dex, "name": p["name"], "reason": "empty sprites"}
                )
            else:
                mapping.append(
                    {
                        "dex": dex,
                        "name": p["name"],
                        "lookType": look,
                        "shiny": False,
                        "formula": formula_label(dex, shiny=False),
                        "src": f"/sprites/map/{dex:03d}.png",
                        "w": img.width,
                        "h": img.height,
                    }
                )
                print(
                    f"dex {dex:03d} {p['name']:16s} normal lt={look:4d} "
                    f"({formula_label(dex)}) -> {img.width}x{img.height}"
                )

        shiny_look = looktype_for_dex(dex, shiny=True)
        if shiny_look is None:
            continue
        if not (1 <= shiny_look <= len(creatures)):
            continue
        shiny_path = OUT / f"{dex:03d}.1.png"
        img = export_one(creatures, spr, shiny_look, shiny_path)
        if img is None:
            continue
        mapping.append(
            {
                "dex": dex,
                "name": p["name"],
                "lookType": shiny_look,
                "shiny": True,
                "formula": formula_label(dex, shiny=True),
                "src": f"/sprites/map/{dex:03d}.1.png",
                "w": img.width,
                "h": img.height,
            }
        )
        print(
            f"dex {dex:03d} {p['name']:16s} shiny  lt={shiny_look:4d} "
            f"({formula_label(dex, shiny=True)}) -> {img.width}x{img.height}"
        )

    meta = {
        "range": [1, 251],
        "count": len(mapping),
        "skipped": skipped,
        "formulas": {
            "1-98 normal": "unmapped (wiki) — (dex+404)+901 is Ditto transform",
            "1-98 shiny": "lookType = dex + 404 (best-effort; verify)",
            "99-151": "lookType = dex - 98",
            "152-201": "lookType = dex - 4",
            "202-251": "lookType = dex + 22",
        },
        "sprites": mapping,
    }
    (OUT / "index.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"\nexported {len(mapping)} sprites -> {OUT}")
    print(f"skipped normals: {len(skipped)}")


if __name__ == "__main__":
    main()
