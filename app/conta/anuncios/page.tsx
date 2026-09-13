"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useToast } from "@/components/ToastProvider";
import { fetchMyListingsResult, isApiConfigured } from "@/lib/api";
import { artworkForPokemon } from "@/lib/art";
import { pokemonTitle } from "@/lib/catalog";
import { readLocalUser } from "@/lib/auth-session";
import { formatPrice, listingSellerLabel } from "@/lib/listings";
import { getMockListing } from "@/lib/mock-listings";
import {
  setOwnedListingStatus,
  statusLabel,
  writeOwnedListings,
  type ListingStatus,
  type OwnedListing,
} from "@/lib/my-listings";

const DEMO_IDS = [
  "mock-charizard",
  "mock-pikachu",
  "mock-lucario",
] as const;

function seedDemoListings(ownerId: string, seller: string): OwnedListing[] {
  const seeded: OwnedListing[] = [];
  for (const id of DEMO_IDS) {
    const base = getMockListing(id);
    if (!base) continue;
    seeded.push({
      ...base,
      id: `mine-${id}`,
      seller,
      showSellerNick: true,
      ownerId,
      status: "active",
    });
  }
  writeOwnedListings(seeded);
  return seeded;
}

function publicListingHref(id: string) {
  return `/anuncio/${id.startsWith("mine-") ? id.slice("mine-".length) : id}`;
}

function MyListingsPanel() {
  const toast = useToast();
  const [items, setItems] = useState<OwnedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ListingStatus | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchMyListingsResult();
    if (result.error) {
      setError(result.error.message);
    }
    setItems(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function seedExamples() {
    const user = readLocalUser();
    if (!user?.gameNick) {
      toast.push("Complete o perfil antes.", "error");
      return;
    }
    const seeded = seedDemoListings(user.id, user.gameNick);
    setItems(seeded);
    toast.push("Exemplos locais carregados.", "success");
  }

  function setStatus(id: string, status: ListingStatus) {
    if (isApiConfigured()) {
      toast.push("Status no servidor entra quando o back ligar.", "info");
      return;
    }
    const next = setOwnedListingStatus(id, status);
    setItems(next);
    toast.push(
      `Anúncio marcado como ${statusLabel(status).toLowerCase()}.`,
      "success",
    );
  }

  const visible =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  return (
    <div className="px-3 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="rpg-label mb-0 tracking-[0.14em]">Conta</p>
          <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy">
            Meus anúncios
          </h1>
          <p className="mt-2 max-w-lg text-[14px] text-muted">
            {isApiConfigured()
              ? "Lista vinda da API."
              : "Lista local neste navegador. Quando o back subir, sincroniza sozinho."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/conta"
            className="border-2 border-navy/30 bg-card px-3 py-2 text-[12px] font-bold"
          >
            Voltar
          </Link>
          <Link href="/anunciar" className="btn-brass px-3 py-2 text-[12px]">
            Novo anúncio
          </Link>
        </div>
      </header>

      <div className="rpg-seg mb-5 inline-flex max-w-full flex-wrap">
        {(
          [
            ["all", "Todos"],
            ["active", "Ativos"],
            ["sold", "Vendidos"],
            ["archived", "Arquivados"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            data-active={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-4 border-l-2 border-warn bg-warn-soft/50 px-3 py-2 text-[13px] text-warn">
          {error}{" "}
          <button
            type="button"
            onClick={() => void load()}
            className="font-extrabold underline"
          >
            Tentar de novo
          </button>
        </div>
      ) : null}

      {loading ? (
        <p className="py-10 text-center text-[14px] text-muted">Carregando…</p>
      ) : visible.length === 0 ? (
        <div className="rpg-inset py-12 text-center">
          <p className="font-[family-name:var(--font-pixel)] text-[1.1rem] text-navy">
            Nenhum anúncio aqui
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted">
            Publique um Pokémon ou carregue exemplos locais pra ver a área.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/anunciar" className="btn-brass px-4 py-2 text-[13px]">
              Criar anúncio
            </Link>
            {!isApiConfigured() ? (
              <button
                type="button"
                onClick={seedExamples}
                className="border-2 border-navy bg-card px-4 py-2 text-[13px] font-bold"
              >
                Carregar exemplos
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="rpg-inset overflow-hidden">
              <div className="grid gap-3 p-3 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center">
                <div className="art-well mx-auto aspect-square w-20 border-2 border-navy/20 p-1 sm:mx-0">
                  <img
                    src={artworkForPokemon(item)}
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-[family-name:var(--font-pixel)] text-[1.05rem] text-navy">
                    {pokemonTitle(item)}
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    {item.world}
                    <span className="mx-1.5 text-line">·</span>
                    {formatPrice(item.priceBrl)}
                    <span className="mx-1.5 text-line">·</span>
                    {listingSellerLabel(item)}
                  </p>
                  <p className="mt-1.5 inline-flex border-2 border-navy/20 bg-paper-deep px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                    {statusLabel(item.status)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:flex-col sm:items-stretch">
                  <Link
                    href={publicListingHref(item.id)}
                    className="border-2 border-navy/30 bg-card px-2.5 py-1.5 text-center text-[12px] font-bold"
                  >
                    Ver
                  </Link>
                  {item.status === "active" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatus(item.id, "sold")}
                        className="border-2 border-olive/40 bg-olive-soft px-2.5 py-1.5 text-[12px] font-bold text-olive"
                      >
                        Vendido
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(item.id, "archived")}
                        className="border-2 border-navy/25 bg-paper px-2.5 py-1.5 text-[12px] font-bold text-muted"
                      >
                        Arquivar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, "active")}
                      className="border-2 border-navy/30 bg-card px-2.5 py-1.5 text-[12px] font-bold"
                    >
                      Reativar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ContaAnunciosPage() {
  return (
    <RequireAuth requireProfile>
      <MyListingsPanel />
    </RequireAuth>
  );
}
