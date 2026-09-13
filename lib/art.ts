import { hasMapSpriteFile } from "@/lib/map-sprites";

const WIKI = "https://wiki.pokealliance.com";
const BLACK_WHITE = "https://img.pokemondb.net/sprites/black-white";
const HOME = "https://img.pokemondb.net/sprites/home";
const XY = "https://img.pokemondb.net/sprites/x-y";

/** Highest national dex with a verified map lookType export. */
export const MAP_SPRITE_MAX_DEX = 251;

/** Black/White (e animados) cobrem até Gen 5. */
const BLACK_WHITE_MAX_DEX = 649;

/**
 * Overrides manuais (dex:shiny) — só quando o fallback genérico erra a palette.
 * @see https://wiki.pokealliance.com/shiny/123_shiny_scyther
 * @see https://pokemondb.net/pokedex/gogoat
 */
const ART_OVERRIDES: Record<string, string> = {
  "123:1": `${WIKI}/pokemon/123.1.png`,
  "673:0": `${XY}/normal/gogoat.png`,
  "673:1": `${XY}/shiny/gogoat.png`,
};

/** Dex overrides for PokémonDB slug quirks. */
const PDB_SLUG_BY_DEX: Record<number, string> = {
  29: "nidoran-f",
  32: "nidoran-m",
  83: "farfetchd",
  122: "mr-mime",
  439: "mime-jr",
  772: "type-null",
  785: "tapu-koko",
  786: "tapu-lele",
  787: "tapu-bulu",
  788: "tapu-fini",
  808: "meltan",
  809: "melmetal",
};

/**
 * Dex → lookType (visually verified against things.dat outfits).
 *
 * Dex 1–98: normals NÃO mapeados — usam anim PokémonDB.
 * Shinies 1–98: best-effort (dex+404) se o arquivo existir no índice.
 */
export function lookTypeForDex(dex: number, shiny = false): number | null {
  if (dex >= 1 && dex <= 98) {
    if (shiny) return dex + 404;
    return null;
  }
  if (shiny) return null;
  if (dex >= 99 && dex <= 151) return dex - 98;
  if (dex >= 152 && dex <= 201) return dex - 4;
  if (dex >= 202 && dex <= 251) return dex + 22;
  return null;
}

/**
 * Path local do sprite de mapa — só se o arquivo estiver no índice
 * (evita 404 em Gen1 normal / gaps).
 */
export function mapSpritePath(dex: number, shiny = false): string | null {
  if (dex < 1 || dex > MAP_SPRITE_MAX_DEX) return null;
  if (lookTypeForDex(dex, shiny) == null) return null;
  if (!hasMapSpriteFile(dex, shiny)) return null;
  if (shiny) return `/sprites/map/${String(dex).padStart(3, "0")}.1.png`;
  return `/sprites/map/${String(dex).padStart(3, "0")}.png`;
}

/** Artwork oficial da wiki do PokeAlliance (PNG real). */
export function artworkUrl(imagePath: string) {
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/sprites/")) return imagePath;
  return `${WIKI}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

/** Slug usado em img.pokemondb.net. */
export function pokeDbSlug(dex: number, name?: string): string | null {
  const byDex = PDB_SLUG_BY_DEX[dex];
  if (byDex) return byDex;
  if (!name) return null;
  const cleaned = name
    .replace(/^Shiny\s+/i, "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-");
  return cleaned || null;
}

/** @deprecated use pokeDbSlug */
export function letsGoSlug(dex: number, name?: string) {
  return pokeDbSlug(dex, name);
}

/**
 * GIF animado Black/White (PokémonDB) — normal + shiny, Gen 1–5.
 * @see https://pokemondb.net/sprites/
 */
export function blackWhiteAnimSpriteUrl(
  dex: number,
  name?: string,
  shiny = false,
): string | null {
  if (dex < 1 || dex > BLACK_WHITE_MAX_DEX) return null;
  const slug = pokeDbSlug(dex, name);
  if (!slug) return null;
  return `${BLACK_WHITE}/anim/${shiny ? "shiny" : "normal"}/${slug}.gif`;
}

/** Sprite estática Black/White (PokémonDB) — fallback se o GIF falhar. */
export function blackWhiteSpriteUrl(
  dex: number,
  name?: string,
  shiny = false,
): string | null {
  if (dex < 1 || dex > BLACK_WHITE_MAX_DEX) return null;
  const slug = pokeDbSlug(dex, name);
  if (!slug) return null;
  return `${BLACK_WHITE}/${shiny ? "shiny" : "normal"}/${slug}.png`;
}

/**
 * Sprite Pokémon Home (PokémonDB) — cobre Gen 6+ (sem anim no CDN).
 */
export function homeSpriteUrl(
  dex: number,
  name?: string,
  shiny = false,
): string | null {
  const slug = pokeDbSlug(dex, name);
  if (!slug) return null;
  return `${HOME}/${shiny ? "shiny" : "normal"}/${slug}.png`;
}

/** True se dá para montar arte shiny via PokémonDB (mesmo sem linha na wiki). */
export function canServePokeDbShiny(dex: number, name?: string) {
  return (
    blackWhiteAnimSpriteUrl(dex, name, true) != null ||
    blackWhiteSpriteUrl(dex, name, true) != null ||
    homeSpriteUrl(dex, name, true) != null
  );
}

/**
 * Sem sprite do mapa (jogo):
 * 1) GIF animado BW (Gen 1–5)
 * 2) PNG Home (Gen 6+)
 * 3) PNG BW estático
 * 4) wiki
 */
function resolveArtwork(
  dex: number,
  shiny: boolean,
  name?: string,
  wikiImage?: string,
) {
  const forced = ART_OVERRIDES[`${dex}:${shiny ? 1 : 0}`];
  if (forced) return forced;

  const map = mapSpritePath(dex, shiny);
  if (map) return map;

  const anim = blackWhiteAnimSpriteUrl(dex, name, shiny);
  if (anim) return anim;

  const home = homeSpriteUrl(dex, name, shiny);
  if (home) return home;

  const bw = blackWhiteSpriteUrl(dex, name, shiny);
  if (bw) return bw;

  if (wikiImage) return artworkUrl(wikiImage);
  const n = String(dex).padStart(3, "0");
  return artworkUrl(shiny ? `/pokemon/${n}.1.png` : `/pokemon/${n}.png`);
}

/**
 * Fallback: override → mapa (jogo) → BW anim → Home → BW → wiki.
 */
export function artworkFromDex(dex: number, shiny = false, name?: string) {
  return resolveArtwork(dex, shiny, name);
}

/** Resolve arte (mapa do jogo quando houver; senão animado PokémonDB). */
export function artworkForPokemon(p: {
  dex: number;
  shiny?: boolean;
  image: string;
  name?: string;
}) {
  return resolveArtwork(p.dex, Boolean(p.shiny), p.name, p.image);
}
