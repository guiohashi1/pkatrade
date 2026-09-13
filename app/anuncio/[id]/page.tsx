import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ChatPanel } from "@/components/ChatPanel";
import { ElementDots } from "@/components/ElementDots";
import { ListingCard } from "@/components/ListingCard";
import { LookSheet } from "@/components/LookSheet";
import { TierBadge } from "@/components/TierBadge";
import { artworkUrl } from "@/lib/art";
import { elementColor, elementLabels } from "@/lib/catalog";
import {
  formatPrice,
  getListing,
  relatedListings,
  sideLabel,
} from "@/lib/listings";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) notFound();

  const related = relatedListings(listing);

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[12px] text-muted">
        <Link href="/" className="hover:text-ink">
          Anúncios
        </Link>
        <span className="text-line">/</span>
        <span>{listing.world}</span>
        <span className="text-line">/</span>
        <span className="text-ink">{listing.displayName}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                listing.side === "venda"
                  ? "bg-olive-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-olive"
                  : "bg-warn-soft px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-warn"
              }
            >
              {sideLabel(listing.side)}
            </span>
            {listing.shiny ? (
              <span className="border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-gold">
                shiny
              </span>
            ) : null}
            <TierBadge tier={listing.tier} />
          </div>

          <h1 className="mt-3 font-serif text-[2rem] leading-[1.12] tracking-tight sm:text-[2.4rem]">
            {listing.displayName}
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
                src={artworkUrl(listing.image)}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
                {listing.side === "venda" ? "Preço pedido" : "Pago até"}
              </p>
              <p className="tabular mt-1 font-serif text-[2.1rem] leading-none text-price">
                {formatPrice(listing.priceBrl)}
              </p>

              <dl className="mt-6 divide-y divide-line-soft border-y border-line-soft text-[14px]">
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
                  <dd>{listing.seller}</dd>
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
              title={listing.displayName}
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
          <ChatPanel seller={listing.seller} />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="font-serif text-[1.3rem] leading-none">
            Outros anúncios
          </h2>
          <ul className="feed-rail mt-4 px-1 sm:px-2">
            {related.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
