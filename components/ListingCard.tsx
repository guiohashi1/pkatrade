import Link from "next/link";
import { IconShiny, IconTrade, IconType } from "@/components/Icons";
import { TierBadge } from "@/components/TierBadge";
import { artworkForPokemon } from "@/lib/art";
import {
  cardRarity,
  elementColor,
  elementLabels,
  pokemonTitle,
} from "@/lib/catalog";
import { feedAttrsMeta } from "@/lib/listing-attrs";
import { formatPrice, listingSellerLabel, type Listing } from "@/lib/listings";

function typePips(elements: string[]) {
  return elements.slice(0, 2).map((el) => (
    <span key={el} className="type-pip" title={elementLabels[el] ?? el}>
      <IconType element={el} className="text-[16px] sm:text-[18px]" />
    </span>
  ));
}

/** Barra decorativa de “vitalidade” visual (não é HP real do jogo). */
function vitalityPct(listing: Listing) {
  const base = Math.min(92, 28 + listing.requiredLevel * 0.9);
  const bump = listing.shiny ? 8 : 0;
  const rare = cardRarity(listing) === "premium" ? 6 : 0;
  return Math.round(Math.min(98, base + bump + rare));
}

export function ListingCard({ listing }: { listing: Listing }) {
  const meta = feedAttrsMeta(listing.attrs);
  const primary = listing.elements[0];
  const tint = primary ? elementColor(primary) : "#6a849e";
  const rarity = cardRarity(listing);
  const priceText = formatPrice(listing.priceBrl);
  const pct = vitalityPct(listing);
  const title = pokemonTitle(listing);

  return (
    <li className="enter-fade min-w-0">
      <Link
        href={`/anuncio/${listing.id}`}
        data-rarity={rarity}
        className="collect-card group h-full min-w-0"
      >
        {/* Header: status + badge — empilha se apertar */}
        <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1 border-b-2 border-navy/20 px-2 py-1.5 sm:px-2.5 sm:py-2">
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-olive sm:text-[10px] sm:tracking-[0.1em]">
            <IconTrade className="shrink-0 text-[13px] sm:text-[14px]" />
            <span className="max-[340px]:sr-only">À venda</span>
          </span>
          <div className="flex min-w-0 max-w-full items-center justify-end gap-1">
            {listing.shiny ? (
              <IconShiny
                className="shrink-0 text-[11px] text-price/80"
                title="Shiny"
              />
            ) : null}
            <TierBadge tier={listing.tier} compact />
          </div>
        </div>

        <div
          className="art-well relative mx-1.5 mt-1.5 aspect-square overflow-hidden border-2 border-navy/25 sm:mx-2 sm:mt-2"
          style={{ ["--type-tint" as string]: tint }}
        >
          <img
            src={artworkForPokemon(listing)}
            alt=""
            className="h-full w-full object-contain p-1.5 sm:p-2 transition-transform duration-300 group-hover:scale-[1.06]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 px-2 pb-2 pt-1.5 sm:gap-1.5 sm:px-2.5 sm:pb-2.5 sm:pt-2">
          {/* Nome + tipos: tipos sobem pra linha de baixo no estreito */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-1.5">
              <h2
                className="min-w-0 flex-1 font-[family-name:var(--font-pixel)] text-[0.82rem] leading-snug text-navy sm:text-[0.95rem] sm:leading-tight"
                title={title}
              >
                <span className="line-clamp-2 break-words hyphens-auto">
                  {title}
                </span>
              </h2>
              <div className="hidden shrink-0 gap-0.5 sm:flex">
                {typePips(listing.elements)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:hidden">
              {typePips(listing.elements)}
            </div>
          </div>

          <p className="truncate text-[10px] font-bold text-muted sm:text-[11px]">
            Lv. {listing.requiredLevel}
            <span className="mx-1 text-line">·</span>
            {listing.world}
          </p>

          {meta ? (
            <p className="truncate text-[10px] text-ink-soft sm:text-[11px]">
              {meta}
            </p>
          ) : null}

          <div className="mt-auto space-y-1 pt-1 sm:space-y-1.5">
            <div className="hp-bar" title="Destaque visual">
              <span style={{ width: `${pct}%` }} />
            </div>
            <div className="flex min-w-0 items-end justify-between gap-1.5">
              <p className="min-w-0 truncate text-[9px] text-muted sm:text-[10px]">
                {listingSellerLabel(listing)}
              </p>
              <p className="tabular shrink-0 font-[family-name:var(--font-pixel)] text-[0.8rem] leading-none text-price sm:text-[0.95rem]">
                {priceText}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
