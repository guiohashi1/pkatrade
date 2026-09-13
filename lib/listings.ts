import type { ListingAttrs } from "@/lib/listing-attrs";

/** MVP: só venda. */
export type Side = "venda";

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
  /** Nick real do vendedor (interno). A UI pública usa listingSellerLabel. */
  seller: string;
  /**
   * Por anúncio: se false, o card/detalhe mostram "Anônimo".
   * O chat da negociação ainda pode usar o nick real.
   */
  showSellerNick: boolean;
  postedAt: string;
  note: string;
  attrs: ListingAttrs;
};

export const worlds = ["Sun", "Moon", "Titan", "Titan 2", "Titan 3"] as const;

export type World = (typeof worlds)[number];

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function sideLabel(_side: Side = "venda") {
  return "À venda";
}

/** Nome público no feed/card (respeita anonimato do anúncio). */
export function listingSellerLabel(
  listing: Pick<Listing, "seller" | "showSellerNick">,
) {
  return listing.showSellerNick ? listing.seller : "Anônimo";
}