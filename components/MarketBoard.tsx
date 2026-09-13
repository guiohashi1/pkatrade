"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  IconAll,
  IconNormal,
  IconSearch,
  IconShiny,
  IconTrade,
} from "@/components/Icons";
import { ListingCard } from "@/components/ListingCard";
import {
  catalogElements,
  elementLabels,
  generations,
  isRareTier,
  pokemonTitle,
  tierLabel,
  tiers,
  type ShinyFilter,
} from "@/lib/catalog";
import { fetchListingsResult, isApiConfigured } from "@/lib/api";
import { worlds, type Listing } from "@/lib/listings";
import { useToast } from "@/components/ToastProvider";

type SortKey = "recente" | "barato" | "caro";

type Chip = {
  id: string;
  label: string;
  clear: () => void;
};

const VARIANT_OPTS: {
  id: ShinyFilter;
  label: string;
  Icon: typeof IconAll;
}[] = [
  { id: "all", label: "Todos", Icon: IconAll },
  { id: "normal", label: "Normal", Icon: IconNormal },
  { id: "shiny", label: "Shiny", Icon: IconShiny },
];

export function MarketBoard() {
  const toast = useToast();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState("todos");
  const [shinyFilter, setShinyFilter] = useState<ShinyFilter>("all");
  const [generation, setGeneration] = useState("todos");
  const [tier, setTier] = useState("todos");
  const [element, setElement] = useState("todos");
  const [sort, setSort] = useState<SortKey>("recente");
  const [levelMin, setLevelMin] = useState("");
  const [levelMax, setLevelMax] = useState("");

  function loadListings() {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetchListingsResult()
      .then((result) => {
        if (cancelled) return;
        setItems(result.data);
        if (result.error) {
          setLoadError(result.error.message);
          toast.push(result.error.message, "error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }

  useEffect(() => {
    return loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minLv = levelMin === "" ? null : Number(levelMin);
    const maxLv = levelMax === "" ? null : Number(levelMax);

    const filtered = items.filter((item) => {
      if (item.side !== "venda") return false;
      if (
        q &&
        !pokemonTitle(item).toLowerCase().includes(q) &&
        !(item.showSellerNick && item.seller.toLowerCase().includes(q)) &&
        !item.number.includes(q.replace(/^#/, ""))
      ) {
        return false;
      }
      if (world !== "todos" && item.world !== world) return false;
      if (shinyFilter === "shiny" && !item.shiny) return false;
      if (shinyFilter === "normal" && item.shiny) return false;
      if (generation !== "todos" && item.generation !== Number(generation)) {
        return false;
      }
      if (tier !== "todos" && String(item.tier) !== tier) return false;
      if (element !== "todos" && !item.elements.includes(element)) return false;
      if (minLv != null && Number.isFinite(minLv) && item.requiredLevel < minLv) {
        return false;
      }
      if (maxLv != null && Number.isFinite(maxLv) && item.requiredLevel > maxLv) {
        return false;
      }
      return true;
    });

    if (sort === "barato") {
      return [...filtered].sort((a, b) => a.priceBrl - b.priceBrl);
    }
    if (sort === "caro") {
      return [...filtered].sort((a, b) => b.priceBrl - a.priceBrl);
    }
    return filtered;
  }, [
    items,
    query,
    world,
    shinyFilter,
    generation,
    tier,
    element,
    sort,
    levelMin,
    levelMax,
  ]);

  const featured = useMemo(() => {
    return visible
      .filter((i) => i.shiny || isRareTier(i.tier) || i.priceBrl >= 2000)
      .slice(0, 4);
  }, [visible]);

  function resetAll() {
    setQuery("");
    setShinyFilter("all");
    setWorld("todos");
    setGeneration("todos");
    setTier("todos");
    setElement("todos");
    setLevelMin("");
    setLevelMax("");
  }

  const chips: Chip[] = [];
  if (query.trim()) {
    chips.push({
      id: "q",
      label: `“${query.trim()}”`,
      clear: () => setQuery(""),
    });
  }
  if (shinyFilter === "shiny") {
    chips.push({
      id: "shiny",
      label: "Só shiny",
      clear: () => setShinyFilter("all"),
    });
  }
  if (shinyFilter === "normal") {
    chips.push({
      id: "normal",
      label: "Só normal",
      clear: () => setShinyFilter("all"),
    });
  }
  if (world !== "todos") {
    chips.push({ id: "world", label: world, clear: () => setWorld("todos") });
  }
  if (generation !== "todos") {
    chips.push({
      id: "gen",
      label: `Geração ${generation}`,
      clear: () => setGeneration("todos"),
    });
  }
  if (tier !== "todos") {
    chips.push({
      id: "tier",
      label: tierLabel(tier),
      clear: () => setTier("todos"),
    });
  }
  if (element !== "todos") {
    chips.push({
      id: "el",
      label: elementLabels[element] ?? element,
      clear: () => setElement("todos"),
    });
  }

  const emptySource = !loading && items.length === 0;

  function runSearch(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <div
      id="feed"
      className="grid gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[240px_minmax(0,1fr)]"
    >
      <aside className="rpg-sidebar h-fit p-3 lg:sticky lg:top-[4.5rem]">
        <p className="font-[family-name:var(--font-pixel)] text-[12px] tracking-wide text-navy">
          Variante
        </p>
        <ul className="mt-2 space-y-0.5">
          {VARIANT_OPTS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                type="button"
                data-active={shinyFilter === id}
                className="cat-item"
                onClick={() => setShinyFilter(id)}
              >
                <span className="cat-glyph" aria-hidden>
                  <Icon className="text-[14px]" />
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>

        <form
          onSubmit={runSearch}
          className="mt-4 space-y-2 border-t-2 border-line-soft pt-3"
        >
          <p className="font-[family-name:var(--font-pixel)] text-[12px] tracking-wide text-navy">
            Filtros
          </p>
          <label className="block">
            <span className="rpg-label">Busca</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome, # ou vendedor"
              disabled={emptySource}
              className="rpg-input"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="rpg-label">Lv mín</span>
              <input
                inputMode="numeric"
                value={levelMin}
                onChange={(e) => setLevelMin(e.target.value.replace(/\D/g, ""))}
                className="rpg-input tabular"
              />
            </label>
            <label className="block">
              <span className="rpg-label">Lv máx</span>
              <input
                inputMode="numeric"
                value={levelMax}
                onChange={(e) => setLevelMax(e.target.value.replace(/\D/g, ""))}
                className="rpg-input tabular"
              />
            </label>
          </div>
          <label className="block">
            <span className="rpg-label">Servidor</span>
            <select
              value={world}
              onChange={(e) => setWorld(e.target.value)}
              className="rpg-select"
            >
              <option value="todos">Todos</option>
              {worlds.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="rpg-label">Geração</span>
            <select
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              className="rpg-select"
            >
              <option value="todos">Todas</option>
              {generations.map((g) => (
                <option key={g} value={g}>
                  Gen {g}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="rpg-label">Tipo</span>
            <select
              value={element}
              onChange={(e) => setElement(e.target.value)}
              className="rpg-select"
            >
              <option value="todos">Todos</option>
              {catalogElements.map((el) => (
                <option key={el} value={el}>
                  {elementLabels[el] ?? el}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="rpg-label">Tier</span>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="rpg-select"
            >
              <option value="todos">Todos</option>
              {tiers.map((t) => (
                <option key={t} value={t}>
                  {tierLabel(t)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="btn-navy flex w-full items-center justify-center gap-2 py-2 text-[13px]"
          >
            <IconSearch className="text-[16px]" />
            Buscar
          </button>
        </form>

        <div className="rpg-inset mt-4 flex items-center gap-2 p-2.5">
          <IconTrade className="shrink-0 text-[18px] text-navy" />
          <ul className="text-[11px] font-bold leading-relaxed text-navy">
            <li>Rápido</li>
            <li>Direto no jogo</li>
            <li>Sem custódia</li>
          </ul>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <IconTrade className="text-[18px] text-navy" />
            <h2 className="font-[family-name:var(--font-pixel)] text-[1.05rem] text-navy sm:text-[1.2rem]">
              Destaques do feed
            </h2>
          </div>
          <span className="border-2 border-navy/25 bg-sky-soft/60 px-2 py-0.5 text-[11px] font-extrabold text-navy">
            {loading ? "…" : `${visible.length} anúncios`}
          </span>

          <label className="ml-auto">
            <span className="sr-only">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rpg-select w-auto min-w-[9.5rem] text-[12px]"
              aria-label="Ordenar"
            >
              <option value="recente">Recentes</option>
              <option value="barato">Menor preço</option>
              <option value="caro">Maior preço</option>
            </select>
          </label>
        </div>

        {chips.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.clear}
                className="filter-chip"
                title={`Remover ${chip.label}`}
              >
                {chip.label}
                <span aria-hidden>×</span>
              </button>
            ))}
            <button
              type="button"
              onClick={resetAll}
              className="text-[12px] font-bold text-olive underline"
            >
              Limpar
            </button>
          </div>
        ) : null}

        {loadError ? (
          <div className="mt-4 border-l-2 border-warn bg-warn-soft/40 px-3 py-2 text-[13px] text-warn">
            {loadError}{" "}
            <button
              type="button"
              onClick={() => loadListings()}
              className="font-extrabold underline"
            >
              Tentar de novo
            </button>
          </div>
        ) : null}

        {!loading && !emptySource && featured.length > 0 ? (
          <div className="rpg-inset mt-4 p-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-navy-mid">
              Em destaque
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((listing) => (
                <ListingCard key={`feat-${listing.id}`} listing={listing} />
              ))}
            </ul>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-10 py-14 text-center text-[14px] text-muted">
            Carregando anúncios…
          </div>
        ) : emptySource ? (
          <div className="rpg-inset mt-6 py-12 text-center">
            <p className="font-[family-name:var(--font-pixel)] text-[1.1rem] text-navy">
              Ainda não tem anúncio
            </p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
              {isApiConfigured()
                ? "Quando o back responder, a lista aparece aqui."
                : "Mocks saíram. Liga o back com NEXT_PUBLIC_API_URL pra popular o feed."}
            </p>
            <Link
              href="/anunciar"
              className="btn-brass mt-5 inline-block px-4 py-2 text-[13px]"
            >
              Vender Pokémon
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10 py-14 text-center">
            <p className="text-[14px] font-bold text-muted">
              Nada com esse filtro.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-3 text-[13px] font-bold text-olive underline"
            >
              Limpar tudo
            </button>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
