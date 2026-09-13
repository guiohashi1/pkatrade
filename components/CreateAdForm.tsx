"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ElementDots } from "@/components/ElementDots";
import { HeldPicker } from "@/components/HeldPicker";
import { LookSheet } from "@/components/LookSheet";
import { OptionChips } from "@/components/OptionChips";
import { TierBadge } from "@/components/TierBadge";
import { artworkUrl } from "@/lib/art";
import { searchPokemon, type CatalogPokemon } from "@/lib/catalog";
import {
  emptyAttrs,
  NONE,
  starLevelOptions,
  TRAIN_STATS,
  type ListingAttrs,
  type TrainStatKey,
} from "@/lib/listing-attrs";
import { formatPrice, worlds } from "@/lib/listings";

export function CreateAdForm() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatalogPokemon | null>(null);
  const [side, setSide] = useState<"venda" | "procuro">("venda");
  const [world, setWorld] = useState<string>(worlds[0]);
  const [price, setPrice] = useState("420");
  const [note, setNote] = useState("");
  const [attrs, setAttrs] = useState<ListingAttrs>(emptyAttrs);
  const [published, setPublished] = useState(false);

  const suggestions = useMemo(() => searchPokemon(query, 8), [query]);
  const priceNumber = Number(price.replace(/\D/g, "")) || 0;

  function pick(pokemon: CatalogPokemon) {
    setSelected(pokemon);
    setQuery(pokemon.displayName);
  }

  function setAttr<K extends keyof ListingAttrs>(key: K, value: ListingAttrs[K]) {
    setAttrs((prev) => ({ ...prev, [key]: value }));
  }

  function setTrain(
    key: TrainStatKey,
    field: "value" | "pct",
    raw: string,
  ) {
    const num = raw === "" ? null : Number(raw);
    setAttrs((prev) => ({
      ...prev,
      training: {
        ...prev.training,
        [key]: {
          ...prev.training[key],
          [field]: num != null && Number.isFinite(num) ? num : null,
        },
      },
    }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setPublished(true);
  }

  const previewTitle = selected ? selected.displayName : "Escolhe um Pokémon";

  return (
    <div>
      <header className="border-b border-line pb-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          Novo anúncio
        </p>
        <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-tight">
          Montar anúncio
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
          Os campos batem com a ficha do jogo: aura, boost, star, helds, addon e
          treino. Required Level vem da espécie. Comida e buffs ficam de fora
          porque passam.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <form className="max-w-xl space-y-7" onSubmit={onSubmit}>
          <fieldset>
            <legend className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Intenção
            </legend>
            <div className="mt-2 flex border border-line bg-card p-0.5 text-[13px]">
              <button
                type="button"
                onClick={() => setSide("venda")}
                className={
                  side === "venda"
                    ? "flex-1 border border-brass bg-brass/15 px-3 py-1.5 text-ink"
                    : "flex-1 px-3 py-1.5 text-muted hover:text-ink"
                }
              >
                Estou vendendo
              </button>
              <button
                type="button"
                onClick={() => setSide("procuro")}
                className={
                  side === "procuro"
                    ? "flex-1 border border-brass bg-brass/15 px-3 py-1.5 text-ink"
                    : "flex-1 px-3 py-1.5 text-muted hover:text-ink"
                }
              >
                Estou procurando
              </button>
            </div>
          </fieldset>

          <div>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Pokémon
              </span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(null);
                }}
                placeholder="Nome ou número (#094)"
                autoComplete="off"
                className="mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none placeholder:text-muted/70 focus:border-ink"
              />
            </label>

            {!selected && query.trim() ? (
              <ul className="mt-1 max-h-64 overflow-y-auto border border-line bg-card">
                {suggestions.length === 0 ? (
                  <li className="px-3 py-2.5 text-[13px] text-muted">
                    Nada na wiki com esse nome.
                  </li>
                ) : (
                  suggestions.map((pokemon) => (
                    <li
                      key={pokemon.id}
                      className="border-b border-line-soft last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => pick(pokemon)}
                        className="flex w-full items-center gap-3 px-2.5 py-2 text-left text-[13px] hover:bg-paper-deep"
                      >
                        <span className="art-well h-9 w-9 shrink-0 p-0.5">
                          <img
                            src={artworkUrl(pokemon.image)}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {pokemon.displayName}
                        </span>
                        <span className="tabular shrink-0 text-[12px] text-muted">
                          #{pokemon.number}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}

            {selected ? (
              <div className="mt-2 flex items-center gap-3 border border-line bg-card p-2.5">
                <span className="art-well h-12 w-12 shrink-0 p-1">
                  <img
                    src={artworkUrl(selected.image)}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="truncate font-serif text-[1.05rem]">
                    {selected.displayName}
                  </p>
                  <p className="text-[12px] text-muted">
                    #{selected.number} · Req. Level {selected.level} · Gen{" "}
                    {selected.generation}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setQuery("");
                  }}
                  className="shrink-0 text-[12px] text-muted underline hover:text-ink"
                >
                  trocar
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Mundo
              </span>
              <select
                value={world}
                onChange={(event) => setWorld(event.target.value)}
                className="field mt-2 w-full border border-line py-2 pl-3 text-[14px]"
              >
                {worlds.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Preço em reais
              </span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode="numeric"
                className="tabular mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none focus:border-ink"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Aura
              </span>
              <input
                type="number"
                min={0}
                value={attrs.aura ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setAttr("aura", raw === "" ? null : Number(raw));
                }}
                placeholder="ex: 3525"
                className="tabular mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                Boost
              </span>
              <input
                type="number"
                min={0}
                value={attrs.boost ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setAttr("boost", raw === "" ? null : Number(raw));
                }}
                placeholder="ex: 25 → +25"
                className="tabular mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none focus:border-ink"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Nickname
            </span>
            <input
              value={attrs.nickname ?? ""}
              onChange={(event) =>
                setAttr("nickname", event.target.value || null)
              }
              placeholder="Opcional"
              className="mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none placeholder:text-muted/70 focus:border-ink"
            />
          </label>

          <OptionChips
            label="Star Level"
            options={starLevelOptions}
            value={
              attrs.starLevel == null ? NONE : String(attrs.starLevel)
            }
            onChange={(id) =>
              setAttr("starLevel", id === NONE ? null : Number(id))
            }
            columns={3}
          />

          <HeldPicker
            value={attrs.helds}
            onChange={(helds) => setAttr("helds", helds)}
          />

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Addon / costume
            </span>
            <input
              value={attrs.addon ?? ""}
              onChange={(event) =>
                setAttr("addon", event.target.value || null)
              }
              placeholder="ex: kingdra coven costume"
              className="mt-2 w-full border border-line bg-card px-3 py-2 text-[14px] outline-none placeholder:text-muted/70 focus:border-ink"
            />
          </label>

          <fieldset>
            <legend className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Treinamento
            </legend>
            <p className="mt-1 text-[12px] text-muted">
              Valor e % iguais aos da ficha. Deixa em branco o que não quiser
              mostrar.
            </p>
            <div className="mt-3 space-y-2.5">
              {TRAIN_STATS.map(({ key, label }) => (
                <div
                  key={key}
                  className="grid grid-cols-[1fr_72px_72px] items-center gap-2"
                >
                  <span className="text-[12px] text-ink-soft">{label}</span>
                  <input
                    type="number"
                    min={0}
                    value={attrs.training[key].value ?? ""}
                    onChange={(event) =>
                      setTrain(key, "value", event.target.value)
                    }
                    placeholder="val"
                    aria-label={`${label} valor`}
                    className="tabular w-full border border-line bg-card px-2 py-1.5 text-[12px] outline-none focus:border-ink"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={attrs.training[key].pct ?? ""}
                    onChange={(event) =>
                      setTrain(key, "pct", event.target.value)
                    }
                    placeholder="%"
                    aria-label={`${label} %`}
                    className="tabular w-full border border-line bg-card px-2 py-1.5 text-[12px] outline-none focus:border-ink"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Nota livre
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Onde entrega, horário, se aceita diamonds…"
              className="mt-2 w-full resize-y border border-line bg-card px-3 py-2 text-[14px] leading-relaxed outline-none placeholder:text-muted/70 focus:border-ink"
            />
          </label>

          <div className="flex items-center gap-4 border-t border-line pt-5">
            <button
              type="submit"
              disabled={!selected}
              className="btn-brass px-4 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Publicar anúncio
            </button>
            <p className="text-[12px] text-muted">
              {published
                ? "Ainda não salva nada. Só o esboço."
                : selected
                  ? "Olha a ficha ao lado."
                  : "Escolhe um Pokémon pra seguir."}
            </p>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
              Prévia do card
            </p>
            <div className="mt-2 border border-line bg-card">
              <div className="art-well relative aspect-[4/3] p-5">
                {selected ? (
                  <img
                    src={artworkUrl(selected.image)}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-center text-[12px] text-muted">
                    A arte aparece aqui
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  <span
                    className={
                      side === "venda"
                        ? "bg-olive-soft px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-olive"
                        : "bg-warn-soft px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-warn"
                    }
                  >
                    {side === "venda" ? "Vendendo" : "Procurando"}
                  </span>
                  {selected?.shiny ? (
                    <span className="border border-gold/40 bg-card/85 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-gold">
                      shiny
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-3">
                <h2 className="truncate font-serif text-[1.2rem] leading-tight">
                  {selected ? selected.displayName : "Sem Pokémon"}
                </h2>
                {selected ? (
                  <>
                    <p className="mt-1.5 text-[12px] text-muted">
                      <ElementDots elements={selected.elements} withLabels />
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <TierBadge tier={selected.tier} />
                      <span className="border border-line bg-paper-deep px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted">
                        Gen {selected.generation}
                      </span>
                    </div>
                  </>
                ) : null}
                <div className="rule-top mt-3 h-px" />
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-[12px] text-muted">{world}</p>
                  <p className="tabular text-[1.1rem] leading-none text-price">
                    {formatPrice(priceNumber)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <LookSheet
            title={previewTitle}
            attrs={attrs}
            requiredLevel={selected?.level ?? null}
          />

          {note.trim() ? (
            <p className="border-l-2 border-line pl-3 text-[12px] leading-relaxed text-muted">
              {note}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
