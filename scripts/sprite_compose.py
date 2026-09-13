"""Shared sprite composition helpers for PokeAlliance things.spr outfits."""
from __future__ import annotations

from PIL import Image


def compose_outfit(
    decode_sprite,
    spr: bytes,
    rec: dict,
    pattern_x: int = 2,
    frame: int = 0,
) -> Image.Image:
    """
    Compose w*h tiles for one direction.

    OTClient draws width tiles right-to-left (tx=0 on the right). Y uses
    bottom-row anchor so dat ty=0 ends up as the top of the standing sprite.
    """
    w, h = rec["w"], rec["h"]
    layers, px, py, pz, frames = (
        rec["layers"],
        rec["px"],
        rec["py"],
        rec["pz"],
        rec["frames"],
    )

    def idx(f, z, y, x, layer, ty, tx):
        return (((((f * pz + z) * py + y) * px + x) * layers + layer) * h + ty) * w + tx

    canvas = Image.new("RGBA", (w * 32, h * 32), (0, 0, 0, 0))
    f = min(frame, max(frames - 1, 0))
    xdir = min(pattern_x, max(px - 1, 0))
    for layer in range(layers):
        for ty in range(h):
            for tx in range(w):
                sid = rec["sids"][idx(f, 0, 0, xdir, layer, ty, tx)]
                tile = decode_sprite(spr, sid)
                if tile is None:
                    continue
                canvas.alpha_composite(
                    tile,
                    ((w - 1 - tx) * 32, (h - 1 - ty) * 32),
                )
    return canvas


def export_outfit_png(
    decode_sprite,
    spr: bytes,
    rec: dict,
    *,
    pattern_x: int = 2,
    frame: int = 0,
    scale: int = 3,
    pad: int = 2,
) -> Image.Image:
    """Compose one direction, tight alpha bbox, light pad, nearest scale."""
    img = compose_outfit(decode_sprite, spr, rec, pattern_x=pattern_x, frame=frame)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    if pad > 0:
        canvas = Image.new(
            "RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0)
        )
        canvas.alpha_composite(img, (pad, pad))
        img = canvas
    if scale != 1:
        img = img.resize((img.width * scale, img.height * scale), Image.NEAREST)
    return img
