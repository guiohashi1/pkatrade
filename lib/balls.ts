/**
 * Pokébolas do anúncio (catch ball).
 * No cliente PokeAlliance isso aparece como “Aura: premier” etc. —
 * distinto do atributo numérico `attrs.aura`.
 *
 * Sprites: pokesprite (msikma), espelhados em /public/balls.
 */

export type BallOption = {
  id: string;
  label: string;
};

export const ballOptions: BallOption[] = [
  { id: "poke", label: "Poké Ball" },
  { id: "great", label: "Great Ball" },
  { id: "ultra", label: "Ultra Ball" },
  { id: "master", label: "Master Ball" },
  { id: "premier", label: "Premier Ball" },
  { id: "luxury", label: "Luxury Ball" },
  { id: "dusk", label: "Dusk Ball" },
  { id: "net", label: "Net Ball" },
  { id: "nest", label: "Nest Ball" },
  { id: "repeat", label: "Repeat Ball" },
  { id: "timer", label: "Timer Ball" },
  { id: "safari", label: "Safari Ball" },
  { id: "dive", label: "Dive Ball" },
  { id: "heal", label: "Heal Ball" },
  { id: "quick", label: "Quick Ball" },
  { id: "cherish", label: "Cherish Ball" },
  { id: "fast", label: "Fast Ball" },
  { id: "level", label: "Level Ball" },
  { id: "lure", label: "Lure Ball" },
  { id: "heavy", label: "Heavy Ball" },
  { id: "love", label: "Love Ball" },
  { id: "friend", label: "Friend Ball" },
  { id: "moon", label: "Moon Ball" },
  { id: "sport", label: "Sport Ball" },
  { id: "park", label: "Park Ball" },
  { id: "dream", label: "Dream Ball" },
  { id: "beast", label: "Beast Ball" },
];

const byId = new Map(ballOptions.map((b) => [b.id, b]));

export function ballLabel(id: string | null | undefined) {
  if (!id) return "";
  return byId.get(id)?.label ?? id;
}

export function ballSprite(id: string) {
  return `/balls/${id}.png`;
}

export function isBallId(id: string | null | undefined): id is string {
  return Boolean(id && byId.has(id));
}
