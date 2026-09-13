import { findPokemon } from "@/lib/catalog";
import {
  emptyTraining,
  type ListingAttrs,
  type Training,
} from "@/lib/listing-attrs";
import type { Listing } from "@/lib/listings";

/**
 * Anúncios de demonstração enquanto o backend não está no ar.
 * Campos de espécie (arte, tier, gen, level…) vêm do catálogo.
 */

type MockSeed = {
  id: string;
  dex: number;
  shiny: boolean;
  world: Listing["world"];
  priceBrl: number;
  seller: string;
  /** Default true. Alguns mocks usam anônimo pra demonstrar. */
  showSellerNick?: boolean;
  postedAt: string;
  note: string;
  attrs: Omit<Partial<ListingAttrs>, "training"> & {
    training?: Partial<Training>;
  };
};

function train(
  partial: Partial<Training> = {},
): Training {
  return {
    attack: partial.attack ?? { value: null, pct: null },
    defense: partial.defense ?? { value: null, pct: null },
    critDamage: partial.critDamage ?? { value: null, pct: null },
    critChance: partial.critChance ?? { value: null, pct: null },
    critResist: partial.critResist ?? { value: null, pct: null },
  };
}

function attrsFrom(seed: MockSeed["attrs"]): ListingAttrs {
  return {
    ball: seed.ball ?? null,
    aura: seed.aura ?? null,
    boost: seed.boost ?? null,
    nickname: seed.nickname ?? null,
    starLevel: seed.starLevel ?? null,
    helds: seed.helds ?? [],
    addon: seed.addon ?? null,
    training: train(seed.training),
  };
}

const SEEDS: MockSeed[] = [
  {
    id: "mock-salamence-shiny",
    dex: 373,
    shiny: true,
    world: "Sun",
    priceBrl: 1100,
    seller: "Harai",
    postedAt: "2026-09-12T18:40:00.000Z",
    note: "Prefiro Pix. Entrego no DP de Sun.",
    attrs: {
      ball: "premier",
      aura: 3800,
      boost: 25,
      nickname: "Harai Goshi",
      starLevel: 3,
      helds: ["x-attack-t5", "y-teleport-t2"],
      addon: "salamence coven costume",
      training: {
        attack: { value: 46, pct: 44 },
        defense: { value: 40, pct: 17 },
        critDamage: { value: 14, pct: 3 },
        critChance: { value: 15, pct: 64 },
        critResist: { value: 22, pct: 48 },
      },
    },
  },
  {
    id: "mock-charizard",
    dex: 6,
    shiny: false,
    world: "Moon",
    priceBrl: 450,
    seller: "AshKetch",
    postedAt: "2026-09-13T10:15:00.000Z",
    note: "Aceito diamonds. Online à noite.",
    attrs: {
      ball: "ultra",
      aura: 2100,
      boost: 10,
      starLevel: 2,
      helds: ["x-boost-t4"],
      training: {
        attack: { value: 30, pct: 22 },
        defense: { value: 18, pct: 10 },
      },
    },
  },
  {
    id: "mock-gengar-shiny",
    dex: 94,
    shiny: true,
    world: "Titan",
    priceBrl: 890,
    seller: "ShadowTrade",
    showSellerNick: false,
    postedAt: "2026-09-11T21:05:00.000Z",
    note: "Só Pix. Entrega no CP.",
    attrs: {
      ball: "dusk",
      aura: 3200,
      boost: 20,
      nickname: "Haunt",
      starLevel: 4,
      helds: ["x-critical-t6", "y-ghost-t3"],
      training: {
        critChance: { value: 28, pct: 70 },
        critDamage: { value: 20, pct: 35 },
        attack: { value: 38, pct: 40 },
      },
    },
  },
  {
    id: "mock-scyther-shiny",
    dex: 123,
    shiny: true,
    world: "Sun",
    priceBrl: 620,
    seller: "BugCatcher",
    postedAt: "2026-09-13T08:30:00.000Z",
    note: "Sprite shiny ok. Sem addon.",
    attrs: {
      ball: "net",
      aura: 2750,
      boost: 15,
      starLevel: 1,
      helds: ["x-attack-t3", "x-haste-t2"],
      training: {
        attack: { value: 42, pct: 55 },
        critChance: { value: 12, pct: 20 },
      },
    },
  },
  {
    id: "mock-dragonite",
    dex: 149,
    shiny: false,
    world: "Titan 2",
    priceBrl: 980,
    seller: "LanceFan",
    postedAt: "2026-09-10T14:00:00.000Z",
    note: "Farm pronto. Aceito oferta séria.",
    attrs: {
      ball: "luxury",
      aura: 4100,
      boost: 30,
      nickname: "Tempest",
      starLevel: 5,
      helds: ["x-defense-t7", "y-wing-t4"],
      addon: "dragonite royal cape",
      training: {
        attack: { value: 50, pct: 60 },
        defense: { value: 48, pct: 52 },
        critResist: { value: 30, pct: 40 },
      },
    },
  },
  {
    id: "mock-mewtwo",
    dex: 150,
    shiny: false,
    world: "Titan 3",
    priceBrl: 3500,
    seller: "LegendVault",
    postedAt: "2026-09-09T19:45:00.000Z",
    note: "ULTIMATE. Negocio só com garantia.",
    attrs: {
      ball: "master",
      aura: 5200,
      boost: 40,
      starLevel: 5,
      helds: ["x-boost-t7", "y-teleport-t5"],
      training: {
        attack: { value: 55, pct: 80 },
        defense: { value: 40, pct: 45 },
        critDamage: { value: 25, pct: 50 },
      },
    },
  },
  {
    id: "mock-scizor",
    dex: 212,
    shiny: false,
    world: "Moon",
    priceBrl: 740,
    seller: "SteelPulse",
    postedAt: "2026-09-12T11:20:00.000Z",
    note: "Bom pra hunt. Entrego rápido.",
    attrs: {
      ball: "repeat",
      aura: 2900,
      boost: 18,
      starLevel: 2,
      helds: ["x-harden-t5"],
      training: {
        defense: { value: 44, pct: 48 },
        attack: { value: 35, pct: 30 },
      },
    },
  },
  {
    id: "mock-tyranitar-shiny",
    dex: 248,
    shiny: true,
    world: "Titan",
    priceBrl: 1250,
    seller: "RockSolid",
    postedAt: "2026-09-08T16:10:00.000Z",
    note: "Shiny limpo. Preferência Titan.",
    attrs: {
      ball: "heavy",
      aura: 3600,
      boost: 22,
      nickname: "Mountain",
      starLevel: 3,
      helds: ["x-rage-t4", "x-defense-t5"],
      training: {
        attack: { value: 48, pct: 50 },
        defense: { value: 52, pct: 55 },
        critResist: { value: 18, pct: 25 },
      },
    },
  },
  {
    id: "mock-lucario",
    dex: 448,
    shiny: false,
    world: "Sun",
    priceBrl: 680,
    seller: "AuraMaster",
    postedAt: "2026-09-13T12:00:00.000Z",
    note: "Sem pressa. Pix ou diamonds.",
    attrs: {
      ball: "love",
      aura: 3050,
      boost: 12,
      starLevel: 2,
      helds: ["x-agility-t3", "y-cure-t2"],
      training: {
        attack: { value: 40, pct: 38 },
        critChance: { value: 16, pct: 42 },
      },
    },
  },
  {
    id: "mock-pikachu",
    dex: 25,
    shiny: false,
    world: "Moon",
    priceBrl: 80,
    seller: "NewbieSeller",
    postedAt: "2026-09-13T13:40:00.000Z",
    note: "Barato pra começar. Entrego no depot.",
    attrs: {
      ball: "poke",
      aura: 400,
      boost: 0,
      starLevel: 0,
      helds: [],
      training: emptyTraining,
    },
  },
  {
    id: "mock-gyarados",
    dex: 130,
    shiny: false,
    world: "Titan 2",
    priceBrl: 520,
    seller: "WaveRider",
    postedAt: "2026-09-11T09:55:00.000Z",
    note: "Boa base. Treino parcial.",
    attrs: {
      ball: "dive",
      aura: 2400,
      boost: 8,
      starLevel: 1,
      helds: ["x-lucky-t2"],
      training: {
        attack: { value: 22, pct: 15 },
        defense: { value: 20, pct: 12 },
      },
    },
  },
  {
    id: "mock-rayquaza-shiny",
    dex: 384,
    shiny: true,
    world: "Titan 3",
    priceBrl: 4200,
    seller: "SkyLord",
    showSellerNick: false,
    postedAt: "2026-09-07T22:30:00.000Z",
    note: "Shiny ULTIMATE. Só proposta alta.",
    attrs: {
      ball: "cherish",
      aura: 6000,
      boost: 50,
      nickname: "Ozone",
      starLevel: 5,
      helds: ["x-boost-t7", "y-wing-t7"],
      addon: "rayquaza celestial aura",
      training: {
        attack: { value: 60, pct: 90 },
        defense: { value: 45, pct: 60 },
        critDamage: { value: 30, pct: 70 },
        critChance: { value: 25, pct: 55 },
        critResist: { value: 28, pct: 40 },
      },
    },
  },
];

function listingFromSeed(seed: MockSeed): Listing | null {
  const pokemon = findPokemon(seed.dex, seed.shiny);
  if (!pokemon) return null;

  return {
    id: seed.id,
    catalogId: pokemon.id,
    dex: pokemon.dex,
    number: pokemon.number,
    name: pokemon.name,
    displayName: pokemon.displayName,
    shiny: pokemon.shiny,
    image: pokemon.image,
    generation: pokemon.generation,
    tier: pokemon.tier,
    requiredLevel: pokemon.level,
    elements: pokemon.elements,
    side: "venda",
    world: seed.world,
    priceBrl: seed.priceBrl,
    seller: seed.seller,
    showSellerNick: seed.showSellerNick ?? true,
    postedAt: seed.postedAt,
    note: seed.note,
    attrs: attrsFrom(seed.attrs),
  };
}

export const mockListings: Listing[] = SEEDS.map(listingFromSeed).filter(
  (item): item is Listing => item != null,
);

export function getMockListing(id: string) {
  return mockListings.find((item) => item.id === id) ?? null;
}

export function getMockRelated(listing: Listing, limit = 3) {
  return mockListings
    .filter((item) => item.id !== listing.id)
    .filter(
      (item) =>
        item.elements.some((el) => listing.elements.includes(el)) ||
        item.generation === listing.generation,
    )
    .slice(0, limit);
}
