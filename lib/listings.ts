import { findPokemon } from "@/lib/catalog";
import { mergeAttrs, type ListingAttrs } from "@/lib/listing-attrs";

export type Side = "venda" | "procuro";

export type Listing = {
  id: string;
  catalogId: string;
  dex: number;
  number: string;
  name: string;
  displayName: string;
  shiny: boolean;
  image: string;
  generation: number;
  tier: string | number;
  /** Required Level da espécie na wiki/ficha do jogo. */
  requiredLevel: number;
  elements: string[];
  side: Side;
  world: string;
  priceBrl: number;
  seller: string;
  postedAt: string;
  note: string;
  attrs: ListingAttrs;
};

export const worlds = ["Sun", "Moon", "Titan", "Titan 2", "Titan 3"] as const;

type FromWiki =
  | "id"
  | "catalogId"
  | "dex"
  | "number"
  | "name"
  | "displayName"
  | "shiny"
  | "image"
  | "generation"
  | "tier"
  | "requiredLevel"
  | "elements";

function listingFromWiki(
  id: string,
  dex: number,
  shiny: boolean,
  rest: Omit<Listing, FromWiki>,
): Listing {
  const poke = findPokemon(dex, shiny);
  if (!poke) {
    throw new Error(`Pokémon #${dex} shiny=${shiny} não está na wiki`);
  }

  return {
    id,
    catalogId: poke.id,
    dex: poke.dex,
    number: poke.number,
    name: poke.name,
    displayName: poke.displayName,
    shiny: poke.shiny,
    image: poke.image,
    generation: poke.generation,
    tier: poke.tier,
    requiredLevel: poke.level,
    elements: poke.elements,
    ...rest,
  };
}

function attrs(
  partial: Parameters<typeof mergeAttrs>[0] = {},
): ListingAttrs {
  return mergeAttrs(partial);
}

export const listings: Listing[] = [
  listingFromWiki("gengar-shiny-alliance", 94, true, {
    side: "venda",
    world: "Sun",
    priceBrl: 420,
    seller: "marcos_ht",
    postedAt: "hoje, 18h",
    note: "Entrego no DP de Saffron.",
    attrs: attrs({
      aura: 2100,
      boost: 10,
      nickname: null,
      starLevel: 1,
      helds: [],
      addon: "gengar shadow cloak",
      training: {
        attack: { value: 38, pct: 55 },
        defense: { value: 28, pct: 30 },
        critChance: { value: 18, pct: 70 },
      },
    }),
  }),
  listingFromWiki("charizard-shiny-wildscape", 6, true, {
    side: "venda",
    world: "Moon",
    priceBrl: 890,
    seller: "luna.k",
    postedAt: "hoje, 14h",
    note: "Moveset de special. Aceito diamonds se fechar hoje.",
    attrs: attrs({
      aura: 3400,
      boost: 25,
      starLevel: 2,
      helds: ["x-attack-t5"],
      addon: "charizard coven costume",
      training: {
        attack: { value: 52, pct: 80 },
        defense: { value: 35, pct: 40 },
        critDamage: { value: 22, pct: 45 },
        critChance: { value: 16, pct: 60 },
        critResist: { value: 12, pct: 25 },
      },
    }),
  }),
  listingFromWiki("lucario-alliance", 448, false, {
    side: "venda",
    world: "Titan",
    priceBrl: 150,
    seller: "rafael.s",
    postedAt: "ontem",
    note: "Criado do zero.",
    attrs: attrs({
      aura: 1800,
      boost: 5,
      starLevel: 0,
      helds: ["x-attack-t4"],
      training: {
        attack: { value: 44, pct: 65 },
        defense: { value: 25, pct: 20 },
      },
    }),
  }),
  listingFromWiki("mewtwo-procuro", 150, false, {
    side: "procuro",
    world: "Sun",
    priceBrl: 2500,
    seller: "_nath",
    postedAt: "ontem",
    note: "Sem nickname feio. Pago à vista.",
    attrs: attrs({
      aura: 4000,
      boost: 25,
      starLevel: 3,
      helds: ["x-attack-t5"],
      training: {
        attack: { value: 50, pct: 90 },
        critChance: { value: 20, pct: 80 },
      },
    }),
  }),
  listingFromWiki("gyarados-shiny", 130, true, {
    side: "venda",
    world: "Moon",
    priceBrl: 310,
    seller: "diego_fisher",
    postedAt: "2 dias",
    note: "Intimidate.",
    attrs: attrs({
      aura: 1600,
      boost: 0,
      starLevel: 1,
      helds: ["x-defense-t3"],
      training: {
        attack: { value: 30, pct: 35 },
        defense: { value: 22, pct: 15 },
      },
    }),
  }),
  listingFromWiki("garchomp-alliance", 445, false, {
    side: "venda",
    world: "Sun",
    priceBrl: 220,
    seller: "camila",
    postedAt: "2 dias",
    note: "Leftovers incluso se fechar em R$ 250.",
    attrs: attrs({
      aura: 2500,
      boost: 15,
      starLevel: 1,
      helds: ["x-defense-t3"],
      addon: "garchomp dune wrap",
      training: {
        attack: { value: 48, pct: 70 },
        defense: { value: 36, pct: 45 },
        critDamage: { value: 18, pct: 30 },
      },
    }),
  }),
  listingFromWiki("blaziken-wildscape", 257, false, {
    side: "venda",
    world: "Moon",
    priceBrl: 95,
    seller: "otto",
    postedAt: "3 dias",
    note: "Bom pra começar.",
    attrs: attrs({
      aura: 900,
      boost: 0,
      starLevel: 0,
      helds: ["x-haste-t2"],
      training: {
        attack: { value: 20, pct: 10 },
      },
    }),
  }),
  listingFromWiki("hydreigon-alliance", 635, false, {
    side: "venda",
    world: "Titan 2",
    priceBrl: 380,
    seller: "yuri.pkmn",
    postedAt: "3 dias",
    note: "Moves de special já ensinados.",
    attrs: attrs({
      aura: 2800,
      boost: 20,
      nickname: "Triad",
      starLevel: 2,
      helds: ["x-critical-t4"],
      training: {
        attack: { value: 42, pct: 60 },
        critChance: { value: 14, pct: 55 },
        critDamage: { value: 20, pct: 40 },
      },
    }),
  }),
  listingFromWiki("scizor-shiny", 212, true, {
    side: "venda",
    world: "Sun",
    priceBrl: 640,
    seller: "marcos_ht",
    postedAt: "4 dias",
    note: "Technician. Entrego depois das 21h.",
    attrs: attrs({
      aura: 3200,
      boost: 25,
      starLevel: 2,
      helds: ["x-attack-t6", "x-experience-t3"],
      addon: "scizor steel veil",
      training: {
        attack: { value: 55, pct: 95 },
        defense: { value: 40, pct: 50 },
        critChance: { value: 18, pct: 75 },
        critDamage: { value: 24, pct: 55 },
        critResist: { value: 16, pct: 35 },
      },
    }),
  }),
  listingFromWiki("gardevoir-procuro", 282, true, {
    side: "procuro",
    world: "Moon",
    priceBrl: 700,
    seller: "luna.k",
    postedAt: "4 dias",
    note: "Sem pressa.",
    attrs: attrs({
      aura: 3000,
      boost: 20,
      starLevel: 2,
      helds: ["x-attack-t5"],
      training: {
        attack: { value: 45, pct: 85 },
        critChance: { value: 15, pct: 70 },
      },
    }),
  }),
  listingFromWiki("tyranitar-alliance", 248, false, {
    side: "venda",
    world: "Sun",
    priceBrl: 180,
    seller: "rafael.s",
    postedAt: "5 dias",
    note: "Parado no box.",
    attrs: attrs({
      aura: 2000,
      boost: 5,
      starLevel: 1,
      helds: ["x-defense-t3"],
      training: {
        defense: { value: 42, pct: 55 },
        critResist: { value: 20, pct: 40 },
      },
    }),
  }),
  listingFromWiki("mimikyu-alliance", 778, false, {
    side: "venda",
    world: "Sun",
    priceBrl: 60,
    seller: "camila",
    postedAt: "5 dias",
    note: "Tenho dois, por isso o preço.",
    attrs: attrs({
      aura: 700,
      boost: 0,
      starLevel: 0,
      helds: [],
    }),
  }),
  listingFromWiki("dragonite-wildscape", 149, false, {
    side: "venda",
    world: "Moon",
    priceBrl: 130,
    seller: "diego_fisher",
    postedAt: "6 dias",
    note: "Sem nickname.",
    attrs: attrs({
      aura: 1900,
      boost: 10,
      starLevel: 1,
      helds: ["x-defense-t3"],
      training: {
        attack: { value: 36, pct: 45 },
        defense: { value: 30, pct: 35 },
      },
    }),
  }),
  listingFromWiki("rayquaza-alliance", 384, false, {
    side: "venda",
    world: "Titan 3",
    priceBrl: 3200,
    seller: "yuri.pkmn",
    postedAt: "1 semana",
    note: "Ultimate. Só Pix.",
    attrs: attrs({
      aura: 5200,
      boost: 25,
      nickname: "Sky King",
      starLevel: 4,
      helds: ["x-boost-t7", "x-rage-t5"],
      addon: "rayquaza emerald aura",
      training: {
        attack: { value: 60, pct: 100 },
        defense: { value: 48, pct: 70 },
        critDamage: { value: 30, pct: 80 },
        critChance: { value: 22, pct: 90 },
        critResist: { value: 25, pct: 60 },
      },
    }),
  }),
  listingFromWiki("sylveon-shiny", 700, true, {
    side: "venda",
    world: "Moon",
    priceBrl: 270,
    seller: "_nath",
    postedAt: "1 semana",
    note: "Eevee shiny de evento velho.",
    attrs: attrs({
      aura: 2200,
      boost: 15,
      starLevel: 1,
      helds: ["x-defense-t3"],
      training: {
        defense: { value: 34, pct: 50 },
        critResist: { value: 18, pct: 45 },
      },
    }),
  }),
  listingFromWiki("metagross-alliance", 376, false, {
    side: "venda",
    world: "Titan",
    priceBrl: 200,
    seller: "otto",
    postedAt: "1 semana",
    note: "Bom de ataque.",
    attrs: attrs({
      aura: 2100,
      boost: 0,
      starLevel: 1,
      helds: ["x-attack-t4"],
      training: {
        attack: { value: 40, pct: 55 },
        defense: { value: 38, pct: 50 },
      },
    }),
  }),
  listingFromWiki("mew-procuro", 151, false, {
    side: "procuro",
    world: "Sun",
    priceBrl: 1800,
    seller: "luna.k",
    postedAt: "8 dias",
    note: "Sem histórico duvidoso.",
    attrs: attrs({
      aura: 3500,
      boost: 20,
      starLevel: 2,
      training: {
        attack: { value: 40, pct: 70 },
        defense: { value: 40, pct: 70 },
      },
    }),
  }),
  listingFromWiki("weavile-wildscape", 461, false, {
    side: "venda",
    world: "Titan 2",
    priceBrl: 85,
    seller: "diego_fisher",
    postedAt: "9 dias",
    note: "Pressure.",
    attrs: attrs({
      aura: 1100,
      boost: 0,
      starLevel: 0,
      helds: ["x-haste-t2"],
      training: {
        attack: { value: 28, pct: 25 },
        critChance: { value: 12, pct: 40 },
      },
    }),
  }),
  listingFromWiki("salamence-shiny", 373, true, {
    side: "venda",
    world: "Sun",
    priceBrl: 1100,
    seller: "marcos_ht",
    postedAt: "9 dias",
    note: "Prefiro Pix.",
    attrs: attrs({
      aura: 3800,
      boost: 25,
      nickname: "Harai Goshi",
      starLevel: 3,
      helds: ["x-attack-t5"],
      addon: "salamence coven costume",
      training: {
        attack: { value: 46, pct: 44 },
        defense: { value: 40, pct: 17 },
        critDamage: { value: 14, pct: 3 },
        critChance: { value: 15, pct: 64 },
        critResist: { value: 22, pct: 48 },
      },
    }),
  }),
  listingFromWiki("pikachu-alliance", 25, false, {
    side: "venda",
    world: "Sun",
    priceBrl: 25,
    seller: "camila",
    postedAt: "10 dias",
    note: "Conta que vou dropar.",
    attrs: attrs({
      aura: 400,
      boost: 0,
      starLevel: 0,
      helds: ["x-lucky-t2"],
    }),
  }),
];

export function getListing(id: string) {
  return listings.find((item) => item.id === id);
}

export function relatedListings(listing: Listing, limit = 3) {
  const sameWorld = listings.filter(
    (item) => item.id !== listing.id && item.world === listing.world,
  );
  const rest = listings.filter(
    (item) => item.id !== listing.id && item.world !== listing.world,
  );
  return [...sameWorld, ...rest].slice(0, limit);
}

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function sideLabel(side: Side) {
  return side === "venda" ? "Vendendo" : "Procurando";
}
