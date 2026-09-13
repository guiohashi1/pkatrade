import catalogData from "@/data/catalog.json";

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

export const catalog = catalogData.pokemon as CatalogPokemon[];

export function findPokemon(dex: number, shiny = false) {
  return catalog.find((p) => p.dex === dex && p.shiny === shiny);
}

export function searchPokemon(query: string, limit = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return catalog.filter((p) => !p.shiny).slice(0, limit);

  return catalog
    .filter((p) => {
      const hay = `${p.displayName} ${p.number}`.toLowerCase();
      return hay.includes(q) || p.number.includes(q.replace(/^#/, ""));
    })
    .slice(0, limit);
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
