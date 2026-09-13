import Link from "next/link";
import { TierBadge } from "@/components/TierBadge";
import { artworkUrl } from "@/lib/art";
import {
  elementColor,
  elementLabels,
  isRareTier,
} from "@/lib/catalog";
import { feedAttrsMeta } from "@/lib/listing-attrs";
import { formatPrice, sideLabel, type Listing } from "@/lib/listings";

function typeLine(elements: string[]) {
  return elements.map((el) => elementLabels[el] ?? el).join(" / ");
}

export function ListingCard({ listing }: { listing: Listing }) {
  const meta = feedAttrsMeta(listing.attrs);
  const primary = listing.elements[0];
  const tint = primary ? elementColor(primary) : "#6d7c5c";
  const rare = isRareTier(listing.tier);
  const types = typeLine(listing.elements);
  const priceText =
    listing.side === "procuro"
      ? `até ${formatPrice(listing.priceBrl)}`
      : formatPrice(listing.priceBrl);

  return (
    <li className="border-b border-line-soft last:border-0">
      <Link
        href={`/anuncio/${listing.id}`}
        className={
          listing.shiny
            ? "feed-row feed-row-shiny group grid grid-cols-[3px_64px_minmax(0,1fr)] items-center gap-2.5 py-3 sm:grid-cols-[4px_88px_minmax(0,1fr)] sm:gap-3.5 sm:py-3.5"
            : "feed-row group grid grid-cols-[3px_64px_minmax(0,1fr)] items-center gap-2.5 py-3 sm:grid-cols-[4px_88px_minmax(0,1fr)] sm:gap-3.5 sm:py-3.5"
        }
      >
        <span
          aria-hidden
          className="self-stretch"
          style={{ backgroundColor: tint }}
        />

        <div
          className={
            listing.shiny
              ? "art-well relative aspect-square overflow-hidden ring-1 ring-gold/35"
              : "art-well relative aspect-square overflow-hidden"
          }
          style={{ ["--type-tint" as string]: tint }}
        >
          <img
            src={artworkUrl(listing.image)}
            alt=""
            className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-[1.05]"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={
                listing.side === "venda"
                  ? "text-[11px] uppercase tracking-[0.08em] text-olive"
                  : "text-[11px] uppercase tracking-[0.08em] text-warn"
              }
            >
              {sideLabel(listing.side)}
            </span>
            <span className="text-[11px] text-muted">{listing.world}</span>
            <TierBadge tier={listing.tier} />
            {listing.shiny ? (
              <span className="border border-gold/40 bg-gold-soft/70 px-1 py-px text-[10px] uppercase tracking-[0.1em] text-gold">
                shiny
              </span>
            ) : null}
          </div>

          <div className="mt-0.5 flex items-baseline justify-between gap-3">
            <h2 className="min-w-0 truncate font-serif text-[1.2rem] leading-tight tracking-tight text-ink group-hover:underline sm:text-[1.35rem]">
              {listing.displayName}
            </h2>
            <p
              className={
                rare || listing.shiny
                  ? "tabular shrink-0 font-serif text-[1.15rem] leading-none text-price sm:text-[1.35rem]"
                  : "tabular shrink-0 font-serif text-[1.1rem] leading-none text-price sm:text-[1.3rem]"
              }
            >
              {priceText}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
            {types ? <span>{types}</span> : null}
            {types && meta ? <span className="text-line">·</span> : null}
            {meta ? <span className="truncate text-ink-soft">{meta}</span> : null}
          </div>

          <p className="mt-1 truncate text-[11px] text-muted/80 sm:text-[12px]">
            {listing.seller}
            <span className="mx-1.5 text-line">·</span>
            {listing.postedAt}
          </p>
        </div>
      </Link>
    </li>
  );
}
