import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ChatPanel } from "@/components/ChatPanel";
import { ElementDots } from "@/components/ElementDots";
import { IconTrade, ShinyMark } from "@/components/Icons";
import { ListingCard } from "@/components/ListingCard";
import { LookSheet } from "@/components/LookSheet";
import { TierBadge } from "@/components/TierBadge";
import { fetchListing, fetchRelatedListings } from "@/lib/api";
import { artworkForPokemon } from "@/lib/art";
import { elementColor, elementLabels, pokemonTitle } from "@/lib/catalog";
import { formatPrice, listingSellerLabel } from "@/lib/listings";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await fetchListing(id);

  if (!listing) notFound();

  const related = await fetchRelatedListings(listing);

  return (
    <div className="px-3 py-5 sm:px-6 sm:py-7">
      <nav className="text-[12px] font-bold text-muted">
        <Link href="/" className="hover:text-navy">
          Anúncios
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-ink">{pokemonTitle(listing)}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-olive-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-olive">
              <IconTrade className="text-[14px]" />
              À venda
            </span>
            {listing.shiny ? (
              <ShinyMark className="text-[11px] font-medium text-price/85" />
            ) : null}
            <TierBadge tier={listing.tier} />
          </div>

          <h1 className="mt-3 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-[1.15] tracking-wide text-navy sm:text-[2.2rem]">
            {pokemonTitle(listing)}
          </h1>
          <p className="mt-2 text-[13px] text-muted">
            #{listing.number}
            <span className="mx-2 text-line">·</span>
            Geração {listing.generation}
            <span className="mx-2 text-line">·</span>
            {listing.world}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
            <div
              className="art-well aspect-square p-6"
              style={{
                ["--type-tint" as string]: listing.elements[0]
                  ? elementColor(listing.elements[0])
                  : "#6d7c5c",
              }}
            >
              <img
                src={artworkForPokemon(listing)}
                alt=""
                className="h-full w-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Preço
              </p>
              <p className="tabular mt-1 font-serif text-[2.1rem] leading-none text-price">
                {formatPrice(listing.priceBrl)}
              </p>

              <dl className="mt-6 divide-y divide-line-soft border-y border-line-soft text-[13px]">
                <div className="flex gap-4 py-2">
                  <dt className="w-24 shrink-0 text-muted">Tipo</dt>
                  <dd>Pokémon</dd>
                </div>
                <div className="flex gap-4 py-2">
                  <dt className="w-24 shrink-0 text-muted">Elemento</dt>
                  <dd className="flex items-center gap-2">
                    <ElementDots elements={listing.elements} />
                    <span>
                      {listing.elements
                        .map((e) => elementLabels[e] ?? e)
                        .join(" / ")}
                    </span>
                  </dd>
                </div>
                <div className="flex gap-4 py-2">
                  <dt className="w-24 shrink-0 text-muted">Anunciante</dt>
                  <dd>{listingSellerLabel(listing)}</dd>
                </div>
                <div className="flex gap-4 py-2">
                  <dt className="w-24 shrink-0 text-muted">Publicado</dt>
                  <dd>{listing.postedAt}</dd>
                </div>
              </dl>
            </div>
          </div>

          <section className="mt-8">
            <LookSheet
              title={pokemonTitle(listing)}
              attrs={listing.attrs}
              requiredLevel={listing.requiredLevel}
            />
          </section>

          <section className="mt-8">
            <h2 className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Nota do vendedor
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-ink-soft">
              {listing.note}
            </p>
          </section>

          <p className="mt-8 border-l-2 border-line pl-3 text-[12px] leading-relaxed text-muted">
            O pkatrade não intermedia pagamento. Confere o personagem e combina a
            entrega antes de mandar qualquer valor.
          </p>

          <div className="mt-10">
            <AdSlot id="listing-after-note" />
          </div>
        </article>

        <div className="lg:sticky lg:top-20">
          <ChatPanel seller={listingSellerLabel(listing)} />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-14 border-t-2 border-line pt-8">
          <h2 className="font-[family-name:var(--font-pixel)] text-[1.15rem] text-navy">
            Outros anúncios
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
