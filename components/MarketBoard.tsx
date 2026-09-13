"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import {
  catalogElements,
  elementLabels,
  generations,
  tierLabel,
  tiers,
} from "@/lib/catalog";
import { listings, worlds, type Side } from "@/lib/listings";

type SortKey = "recente" | "barato" | "caro";

const SIDE_TABS: { value: "todos" | Side; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "venda", label: "Venda" },
  { value: "procuro", label: "Procura" },
];

type Chip = {
  id: string;
  label: string;
  clear: () => void;
};

export function MarketBoard() {
  const [query, setQuery] = useState("");
  const [world, setWorld] = useState("todos");
  const [side, setSide] = useState<"todos" | Side>("todos");
  const [onlyShiny, setOnlyShiny] = useState(false);
  const [generation, setGeneration] = useState("todos");
  const [tier, setTier] = useState("todos");
  const [element, setElement] = useState("todos");
  const [sort, setSort] = useState<SortKey>("recente");
  const [moreFilters, setMoreFilters] = useState(false);

  const matchesBase = useMemo(() => {
    const q = query.trim().toLowerCase();

    return listings.filter((item) => {
      if (
        q &&
        !item.displayName.toLowerCase().includes(q) &&
        !item.seller.toLowerCase().includes(q) &&
        !item.number.includes(q.replace(/^#/, ""))
      ) {
        return false;
      }
      if (world !== "todos" && item.world !== world) return false;
      if (onlyShiny && !item.shiny) return false;
      if (generation !== "todos" && item.generation !== Number(generation)) {
        return false;
      }
      if (tier !== "todos" && String(item.tier) !== tier) return false;
      if (element !== "todos" && !item.elements.includes(element)) return false;
      return true;
    });
  }, [query, world, onlyShiny, generation, tier, element]);

  const sideCounts = useMemo(() => {
    let venda = 0;
    let procuro = 0;
    for (const item of matchesBase) {
      if (item.side === "venda") venda += 1;
      else procuro += 1;
    }
    return {
      todos: matchesBase.length,
      venda,
      procuro,
    };
  }, [matchesBase]);

  const visible = useMemo(() => {
    const filtered =
      side === "todos"
        ? matchesBase
        : matchesBase.filter((item) => item.side === side);

    if (sort === "barato") {
      return [...filtered].sort((a, b) => a.priceBrl - b.priceBrl);
    }
    if (sort === "caro") {
      return [...filtered].sort((a, b) => b.priceBrl - a.priceBrl);
    }
    return filtered;
  }, [matchesBase, side, sort]);

  const dirtyExtra =
    world !== "todos" ||
    generation !== "todos" ||
    tier !== "todos" ||
    element !== "todos";

  function resetExtra() {
    setWorld("todos");
    setGeneration("todos");
    setTier("todos");
    setElement("todos");
  }

  function resetAll() {
    setQuery("");
    setSide("todos");
    setOnlyShiny(false);
    resetExtra();
  }

  const chips: Chip[] = [];
  if (query.trim()) {
    chips.push({
      id: "q",
      label: `“${query.trim()}”`,
      clear: () => setQuery(""),
    });
  }
  if (side !== "todos") {
    chips.push({
      id: "side",
      label: side === "venda" ? "Venda" : "Procura",
      clear: () => setSide("todos"),
    });
  }
  if (onlyShiny) {
    chips.push({
      id: "shiny",
      label: "Shiny",
      clear: () => setOnlyShiny(false),
    });
  }
  if (world !== "todos") {
    chips.push({
      id: "world",
      label: world,
      clear: () => setWorld("todos"),
    });
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

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="block w-full sm:max-w-md">
          <span className="sr-only">Buscar</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar Pokémon, número ou vendedor"
            className="w-full border border-line bg-card px-3 py-2.5 text-[14px] outline-none placeholder:text-muted/70 focus:border-brass"
          />
        </label>

        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
          <div className="flex min-w-0 flex-1 text-[13px] sm:flex-initial">
            {SIDE_TABS.map((tab, index) => {
              const count = sideCounts[tab.value];
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSide(tab.value)}
                  className={
                    side === tab.value
                      ? `min-w-0 flex-1 border border-brass bg-brass/25 px-2.5 py-1.5 text-ink sm:flex-initial sm:px-3 ${
                          index > 0 ? "-ml-px" : ""
                        }`
                      : `min-w-0 flex-1 border border-line bg-card px-2.5 py-1.5 text-muted hover:text-ink sm:flex-initial sm:px-3 ${
                          index > 0 ? "-ml-px" : ""
                        }`
                  }
                >
                  {tab.label}
                  <span className="tabular ml-1 text-[11px] opacity-70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOnlyShiny((value) => !value)}
            aria-pressed={onlyShiny}
            className={
              onlyShiny
                ? "border border-gold/45 bg-gold/10 px-3 py-1.5 text-[13px] text-gold"
                : "border border-line bg-card px-3 py-1.5 text-[13px] text-muted hover:text-ink"
            }
          >
            Shiny
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted">
        <p>
          <span className="tabular text-ink">{visible.length}</span> anúncio
          {visible.length === 1 ? "" : "s"}
        </p>

        <button
          type="button"
          onClick={() => setMoreFilters((open) => !open)}
          className="underline decoration-line underline-offset-2 hover:text-ink"
        >
          {moreFilters || dirtyExtra ? "Filtros" : "Mais filtros"}
        </button>

        {chips.length > 0 ? (
          <button type="button" onClick={resetAll} className="hover:text-ink">
            Limpar tudo
          </button>
        ) : null}

        <label className="ml-auto flex items-center gap-2">
          <span className="hidden text-muted sm:inline">Ordenar</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="field border border-line py-1 pl-2 text-[12px]"
            aria-label="Ordenar"
          >
            <option value="recente">Recentes</option>
            <option value="barato">Menor preço</option>
            <option value="caro">Maior preço</option>
          </select>
        </label>
      </div>

      {chips.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={chip.clear}
              className="filter-chip"
              title={`Remover ${chip.label}`}
            >
              {chip.label}
              <span aria-hidden className="text-muted">
                ×
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {moreFilters || dirtyExtra ? (
        <div className="mt-3 flex flex-wrap gap-2 border border-line bg-card/60 p-3 text-[13px]">
          <select
            value={world}
            onChange={(event) => setWorld(event.target.value)}
            className="field border border-line py-1.5 pl-2.5"
            aria-label="Mundo"
          >
            <option value="todos">Todos os mundos</option>
            {worlds.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={generation}
            onChange={(event) => setGeneration(event.target.value)}
            className="field border border-line py-1.5 pl-2.5"
            aria-label="Geração"
          >
            <option value="todos">Todas as gerações</option>
            {generations.map((g) => (
              <option key={g} value={g}>
                Geração {g}
              </option>
            ))}
          </select>

          <select
            value={tier}
            onChange={(event) => setTier(event.target.value)}
            className="field border border-line py-1.5 pl-2.5"
            aria-label="Tier"
          >
            <option value="todos">Todos os tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {tierLabel(t)}
              </option>
            ))}
          </select>

          <select
            value={element}
            onChange={(event) => setElement(event.target.value)}
            className="field border border-line py-1.5 pl-2.5"
            aria-label="Tipo"
          >
            <option value="todos">Todos os tipos</option>
            {catalogElements.map((el) => (
              <option key={el} value={el}>
                {elementLabels[el] ?? el}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="mt-10 py-14 text-center">
          <p className="text-[14px] text-muted">Nada com esse filtro.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {onlyShiny ? (
              <button
                type="button"
                onClick={() => setOnlyShiny(false)}
                className="border border-line bg-card px-3 py-1.5 text-[13px] text-ink-soft hover:border-brass"
              >
                Tirar shiny
              </button>
            ) : null}
            {element !== "todos" ? (
              <button
                type="button"
                onClick={() => setElement("todos")}
                className="border border-line bg-card px-3 py-1.5 text-[13px] text-ink-soft hover:border-brass"
              >
                Tirar tipo
              </button>
            ) : null}
            {query.trim() ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="border border-line bg-card px-3 py-1.5 text-[13px] text-ink-soft hover:border-brass"
              >
                Limpar busca
              </button>
            ) : null}
            <button
              type="button"
              onClick={resetAll}
              className="text-[13px] text-olive underline"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      ) : (
        <ul className="feed-rail mt-4">
          {visible.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}
