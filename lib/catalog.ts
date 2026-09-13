import catalogData from "@/data/catalog.json";
import { canServePokeDbShiny } from "@/lib/art";

export type CatalogPokemon = {
  id: string;
  dex: number;
  number: string;
  name: string;
  displayName: string;
  generation: number;
  tier: string | number;
  level: number;
  role: string | null;
  shiny: boolean;
  image: string;
  elements: string[];
};

export type ShinyFilter = "all" | "normal" | "shiny";

export const catalog = catalogData.pokemon as CatalogPokemon[];

/**
 * Título de UI. Com `shiny: true`, prefixa "Shiny " (ex.: "Shiny Gengar").
 * Sem shiny, remove prefixo residual do catálogo.
 */
export function pokemonTitle(p: {
  name: string;
  displayName?: string;
  shiny?: boolean;
}) {
  const base =
    p.name.replace(/^Shiny\s+/i, "").trim() ||
    p.displayName?.replace(/^Shiny\s+/i, "").trim() ||
    p.name;
  if (p.shiny) return `Shiny ${base}`;
  return base;
}

/** Prefer base species rows over forme spam (Unown A, Smeargle Bug, …). */
function isPrimarySpeciesRow(p: CatalogPokemon) {
  if (p.dex === 201) return p.name === "Unown";
  if (p.dex === 235) return p.name === "Smeargle";
  return true;
}

function primaryNormal(dex: number) {
  return catalog.find(
    (p) => p.dex === dex && !p.shiny && isPrimarySpeciesRow(p),
  );
}

/** Monta variante shiny quando a wiki não tem linha, mas o PokémonDB tem sprite. */
function synthesizeShiny(base: CatalogPokemon): CatalogPokemon {
  const title = pokemonTitle(base);
  return {
    ...base,
    id: `${base.id}__shiny`,
    shiny: true,
    displayName: `Shiny ${title}`,
    image: `/pokemon/${base.number}.1.png`,
  };
}

export function findPokemon(dex: number, shiny = false) {
  const hit = catalog.find((p) => p.dex === dex && p.shiny === shiny);
  if (hit) return hit;
  if (!shiny) return undefined;
  const base = primaryNormal(dex);
  if (!base) return undefined;
  if (!canServePokeDbShiny(dex, base.name)) return undefined;
  return synthesizeShiny(base);
}

export function hasShinyVariant(dex: number) {
  if (catalog.some((p) => p.dex === dex && p.shiny)) return true;
  const base = primaryNormal(dex);
  return Boolean(base && canServePokeDbShiny(dex, base.name));
}

export function searchPokemon(
  query: string,
  limit = 12,
  opts?: { shiny?: boolean },
) {
  // shiny omitido → normal + shiny; true/false filtra só aquela variante.
  const pool = catalog.filter((p) => {
    if (!isPrimarySpeciesRow(p)) return false;
    if (opts?.shiny === undefined) return true;
    return p.shiny === opts.shiny;
  });

  // Completa shinies ausentes na wiki com síntese (ex.: Rampardos).
  if (opts?.shiny !== false) {
    const haveShiny = new Set(
      catalog.filter((p) => p.shiny).map((p) => p.dex),
    );
    for (const base of catalog) {
      if (base.shiny || !isPrimarySpeciesRow(base)) continue;
      if (haveShiny.has(base.dex)) continue;
      if (!canServePokeDbShiny(base.dex, base.name)) continue;
      if (opts?.shiny === true || opts?.shiny === undefined) {
        pool.push(synthesizeShiny(base));
      }
    }
  }

  const q = query.trim().toLowerCase();
  const ranked = (rows: CatalogPokemon[]) =>
    [...rows].sort(
      (a, b) => a.dex - b.dex || Number(a.shiny) - Number(b.shiny),
    );

  if (!q) return ranked(pool).slice(0, limit);

  const dexQuery = q.replace(/^#/, "");

  return ranked(
    pool.filter((p) => {
      const hay = `${p.name} ${p.displayName} ${p.number}`.toLowerCase();
      return hay.includes(q) || p.number.includes(dexQuery);
    }),
  ).slice(0, limit);
}

export const generations = [...new Set(catalog.map((p) => p.generation))].sort(
  (a, b) => a - b,
);

export const tiers = [...new Set(catalog.map((p) => String(p.tier)))].sort(
  (a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    if (!Number.isNaN(na)) return -1;
    if (!Number.isNaN(nb)) return 1;
    return a.localeCompare(b);
  },
);

export const elementLabels: Record<string, string> = {
  bug: "Inseto",
  dark: "Sombrio",
  dragon: "Dragão",
  electric: "Elétrico",
  fairy: "Fada",
  fighting: "Lutador",
  fire: "Fogo",
  flying: "Voador",
  ghost: "Fantasma",
  grass: "Grama",
  ground: "Terra",
  ice: "Gelo",
  normal: "Normal",
  poison: "Veneno",
  psychic: "Psíquico",
  rock: "Pedra",
  steel: "Aço",
  water: "Água",
};

/** Tons dessaturados para não brigar com o fundo de papel. */
export const elementColors: Record<string, string> = {
  bug: "#7c8a3c",
  dark: "#4b4348",
  dragon: "#4d5da4",
  electric: "#b08a24",
  fairy: "#ab7189",
  fighting: "#a3552f",
  fire: "#bb5a2a",
  flying: "#7f8db4",
  ghost: "#69598a",
  grass: "#588641",
  ground: "#a2833f",
  ice: "#6795a4",
  normal: "#877f72",
  poison: "#855687",
  psychic: "#b05e75",
  rock: "#948357",
  steel: "#76818d",
  water: "#4776a4",
};

export function elementColor(element: string) {
  return elementColors[element] ?? "var(--muted)";
}

export const catalogElements = [
  ...new Set(catalog.flatMap((p) => p.elements)),
].sort((a, b) =>
  (elementLabels[a] ?? a).localeCompare(elementLabels[b] ?? b, "pt-BR"),
);

const RARE_TIERS = new Set([
  "ULTIMATE",
  "Legendary",
  "Mythic",
  "Ultra Rare",
  "Super Rare",
]);

export function isRareTier(tier: string | number) {
  return RARE_TIERS.has(String(tier));
}

export function tierLabel(tier: string | number | null) {
  if (tier === null || tier === "" || tier === undefined) return "Sem tier";
  return Number.isNaN(Number(tier)) ? String(tier) : `Tier ${tier}`;
}

/** Nível visual do card colecionável (marketplace). */
export type CardRarity = "common" | "uncommon" | "rare" | "special" | "premium";

export function cardRarity(p: {
  tier: string | number;
  shiny?: boolean;
  priceBrl?: number;
}): CardRarity {
  const t = String(p.tier);
  if (t === "ULTIMATE" || t === "Mythic" || t === "Legendary") return "premium";
  if (p.shiny) return "special";
  if (isRareTier(t) || (p.priceBrl != null && p.priceBrl >= 5000)) return "rare";
  const n = Number(t);
  if (!Number.isNaN(n) && n <= 3) return "uncommon";
  return "common";
}
