"""Dex → lookType formulas discovered from visual sprite matching."""
from __future__ import annotations

# Early gen1 (dex 1–98) has TWO parallel silhouette blocks:
#   dex + 404      → shiny-colored map outfits (Charmander@408 charcoal)
#   (dex + 404)+901 → SAME body, Ditto face + normal colors (Charmander@1309)
# Those +901 remakes are Ditto *transforms*, not real species normals.
# Real non-Ditto normal lookTypes for dex 1–98 are still unmapped → wiki art.
EARLY_SHINY_OFFSET = 404
EARLY_DITTO_PAIR = 901  # ditto-transform lookType = shiny lookType + 901


def looktype_for_dex(dex: int, *, shiny: bool = False) -> int | None:
    """
    Map national dex to creature lookType (things.dat outfit id).

    Blocks (visually verified):
      1–98:   shiny map = dex + 404 (may still be Ditto-faced shiny copies —
              treat as best-effort shiny until real normals are found)
              normal map = None (Ditto remakes at +901 must NOT be used)
      99–151: lookType = dex - 98  (Kingler@1 … Mew@53)
      152–201: lookType = dex - 4  (Chikorita@148 … Unown A@197)
      202–251: lookType = dex + 22 (Wobbuffet@224 … Celebi@273)

    Gen 3+ (dex ≥ 252): no linear formula found yet.
    """
    if 1 <= dex <= 98:
        if shiny:
            return dex + EARLY_SHINY_OFFSET
        return None

    if shiny:
        return None

    if 99 <= dex <= 151:
        return dex - 98
    if 152 <= dex <= 201:
        return dex - 4
    if 202 <= dex <= 251:
        return dex + 22
    return None


def ditto_transform_looktype(dex: int) -> int | None:
    """Ditto-as-species lookType for early gen1 (NOT for marketplace normals)."""
    if 1 <= dex <= 98:
        return dex + EARLY_SHINY_OFFSET + EARLY_DITTO_PAIR
    return None


def formula_label(dex: int, *, shiny: bool = False) -> str:
    if 1 <= dex <= 98:
        if shiny:
            return "dex + 404 (early shiny block; verify vs ditto)"
        return "normal unmapped (wiki; +901 is ditto transform)"
    if shiny:
        return "shiny unmapped"
    if 99 <= dex <= 151:
        return "dex - 98"
    if 152 <= dex <= 201:
        return "dex - 4"
    if 202 <= dex <= 251:
        return "dex + 22"
    return "unknown"
