/**
 * Atributos do anúncio — espelham a ficha do cliente PokeAlliance.
 *
 * Na ficha do jogo aparecem: Required Level, Aura, Boost, Nickname, Star Level,
 * NPC Price, Itens Held, Addons, Treinamento (5 stats), Comida & Buffs.
 *
 * No marketplace:
 * - Required Level vem do catálogo da espécie (não é “level do Pokémon”).
 * - NPC Price e Comida & Buffs não entram (irrelevante / temporário).
 * - Helds: lista oficial X-/Y- (tiers) do PokeAlliance.
 */

export type TrainStatKey =
  | "attack"
  | "defense"
  | "critDamage"
  | "critChance"
  | "critResist";

export type TrainStat = {
  value: number | null;
  pct: number | null;
};

export type Training = Record<TrainStatKey, TrainStat>;

export type ListingAttrs = {
  aura: number | null;
  /** Valor do boost no jogo, ex: 25 → “+25”. */
  boost: number | null;
  nickname: string | null;
  starLevel: number | null;
  /** Até 2 helds (como na ficha). IDs de heldOptions. */
  helds: string[];
  /** Nome do addon/costume, ex: “kingdra coven costume”. */
  addon: string | null;
  training: Training;
};

export const TRAIN_STATS: {
  key: TrainStatKey;
  label: string;
}[] = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "critDamage", label: "Critical Damage" },
  { key: "critChance", label: "Critical Chance" },
  { key: "critResist", label: "Critical Resistance" },
];

export const emptyTraining: Training = {
  attack: { value: null, pct: null },
  defense: { value: null, pct: null },
  critDamage: { value: null, pct: null },
  critChance: { value: null, pct: null },
  critResist: { value: null, pct: null },
};

export const emptyAttrs: ListingAttrs = {
  aura: null,
  boost: null,
  nickname: null,
  starLevel: null,
  helds: [],
  addon: null,
  training: emptyTraining,
};

export const NONE = "none";
export const MAX_HELDS = 2;

export const starLevelOptions = [
  { id: NONE, label: "Não informar" },
  { id: "0", label: "0" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
] as const;

function heldSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export type HeldFamily = {
  id: string;
  name: string;
  group: "X" | "Y";
  tiers: readonly number[];
};

const X_HELDS = [
  "X-Attack",
  "X-Lucky",
  "X-Defense",
  "X-Critical",
  "X-Experience",
  "X-Boost",
  "X-Haste",
  "X-Agility",
  "X-Harden",
  "X-Strafe",
  "X-Rage",
] as const;

const Y_HELDS = ["Y-Teleport", "Y-Cure", "Y-Wing"] as const;
const FULL_TIERS = [1, 2, 3, 4, 5, 6, 7] as const;

export const heldFamilies: HeldFamily[] = [
  ...X_HELDS.map((name) => ({
    id: heldSlug(name),
    name,
    group: "X" as const,
    tiers: FULL_TIERS,
  })),
  ...Y_HELDS.map((name) => ({
    id: heldSlug(name),
    name,
    group: "Y" as const,
    tiers: FULL_TIERS,
  })),
  {
    id: "y-ghost",
    name: "Y-Ghost",
    group: "Y",
    tiers: [3],
  },
];

export function heldOptionId(familyId: string, tier: number) {
  return `${familyId}-t${tier}`;
}

export function heldLabel(id: string) {
  const match = /^(.+)-t(\d+)$/.exec(id);
  if (!match) return id;
  const family = heldFamilies.find((f) => f.id === match[1]);
  if (!family) return id;
  return `${family.name} Tier ${match[2]}`;
}

/** Helds oficiais do PokeAlliance (lista plana p/ lookup / feed). */
export const heldOptions: { id: string; label: string }[] = [
  { id: NONE, label: "Sem held" },
  ...heldFamilies.flatMap((family) =>
    family.tiers.map((tier) => ({
      id: heldOptionId(family.id, tier),
      label: `${family.name} Tier ${tier}`,
    })),
  ),
];

export function mergeTraining(
  partial?: Partial<Record<TrainStatKey, Partial<TrainStat>>>,
): Training {
  const next: Training = {
    attack: { ...emptyTraining.attack },
    defense: { ...emptyTraining.defense },
    critDamage: { ...emptyTraining.critDamage },
    critChance: { ...emptyTraining.critChance },
    critResist: { ...emptyTraining.critResist },
  };
  if (!partial) return next;
  for (const { key } of TRAIN_STATS) {
    if (partial[key]) {
      next[key] = { ...next[key], ...partial[key] };
    }
  }
  return next;
}

export function mergeAttrs(
  partial: Partial<Omit<ListingAttrs, "training">> & {
    training?: Partial<Record<TrainStatKey, Partial<TrainStat>>>;
  } = {},
): ListingAttrs {
  const { training, ...rest } = partial;
  return {
    ...emptyAttrs,
    ...rest,
    helds: rest.helds ?? [],
    training: mergeTraining(training),
  };
}

function hasTraining(training: Training) {
  return TRAIN_STATS.some(
    ({ key }) =>
      training[key].value != null || training[key].pct != null,
  );
}

export function formatAttrs(
  attrs: ListingAttrs,
  options?: { requiredLevel?: number | null },
) {
  const rows: { key: string; value: string }[] = [];

  if (options?.requiredLevel != null) {
    rows.push({ key: "Required Level", value: String(options.requiredLevel) });
  }
  if (attrs.aura != null) {
    rows.push({ key: "Aura", value: String(attrs.aura) });
  }
  if (attrs.boost != null) {
    rows.push({
      key: "Boost",
      value: attrs.boost >= 0 ? `+${attrs.boost}` : String(attrs.boost),
    });
  }
  if (attrs.nickname?.trim()) {
    rows.push({ key: "Nickname", value: attrs.nickname.trim() });
  }
  if (attrs.starLevel != null) {
    rows.push({ key: "Star Level", value: String(attrs.starLevel) });
  }

  if (attrs.helds.length === 0) {
    // omit unless explicitly emptied in form — show only when seller set none via UI
  } else {
    rows.push({
      key: "Itens Held",
      value: attrs.helds.map(heldLabel).join(", "),
    });
  }

  if (attrs.addon?.trim()) {
    rows.push({ key: "Addon", value: attrs.addon.trim() });
  }

  if (hasTraining(attrs.training)) {
    for (const { key, label } of TRAIN_STATS) {
      const stat = attrs.training[key];
      if (stat.value == null && stat.pct == null) continue;
      const bits: string[] = [];
      if (stat.value != null) bits.push(String(stat.value));
      if (stat.pct != null) bits.push(`(${stat.pct}%)`);
      rows.push({ key: label, value: bits.join(" ") });
    }
  }

  return rows;
}

/** Meta curta pro feed: o que muda preço no scan. */
export function feedAttrsMeta(attrs: ListingAttrs) {
  const bits: string[] = [];
  if (attrs.boost != null) {
    bits.push(attrs.boost >= 0 ? `Boost +${attrs.boost}` : `Boost ${attrs.boost}`);
  }
  if (attrs.starLevel != null) bits.push(`★${attrs.starLevel}`);
  if (attrs.helds.length > 0) {
    bits.push(attrs.helds.map(heldLabel).slice(0, 2).join(" + "));
  }
  if (bits.length < 2 && attrs.aura != null) bits.push(`Aura ${attrs.aura}`);
  return bits.slice(0, 2).join(" · ");
}

export function attrsSummary(attrs: ListingAttrs) {
  return formatAttrs(attrs)
    .map((row) => row.value)
    .join(" · ");
}
