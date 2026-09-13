"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ElementDots } from "@/components/ElementDots";
import { HeldPicker } from "@/components/HeldPicker";
import { IconShiny } from "@/components/Icons";
import { LookSheet } from "@/components/LookSheet";
import { OptionChips } from "@/components/OptionChips";
import { TierBadge } from "@/components/TierBadge";
import { useToast } from "@/components/ToastProvider";
import { createListing, isApiConfigured } from "@/lib/api";
import { artworkForPokemon } from "@/lib/art";
import { defaultShowNickPreference } from "@/lib/auth";
import { readLocalUser } from "@/lib/auth-session";
import {
  findPokemon,
  hasShinyVariant,
  pokemonTitle,
  searchPokemon,
  type CatalogPokemon,
} from "@/lib/catalog";
import {
  emptyAttrs,
  NONE,
  starLevelOptions,
  TRAIN_STATS,
  type ListingAttrs,
  type TrainStatKey,
} from "@/lib/listing-attrs";
import { formatPrice, worlds, type Listing } from "@/lib/listings";
import { upsertOwnedListing } from "@/lib/my-listings";

export function CreateAdForm() {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatalogPokemon | null>(null);
  const [world, setWorld] = useState<string>(worlds[0]);
  const [price, setPrice] = useState("420");
  const [note, setNote] = useState("");
  const [attrs, setAttrs] = useState<ListingAttrs>(emptyAttrs);
  const [showSellerNick, setShowSellerNick] = useState(true);
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = readLocalUser();
    setShowSellerNick(defaultShowNickPreference(user));
    if (user?.world) setWorld(user.world);
  }, []);

  // Busca normal + shiny; toggle de variante continua disponível após escolher.
  const suggestions = useMemo(() => searchPokemon(query, 10), [query]);
  const priceNumber = Number(price.replace(/\D/g, "")) || 0;
  const canShiny = selected ? hasShinyVariant(selected.dex) : false;
  const title = selected ? pokemonTitle(selected) : null;

  function resolveVariant(dex: number, shiny: boolean) {
    return findPokemon(dex, shiny) ?? findPokemon(dex, false) ?? null;
  }

  function pick(pokemon: CatalogPokemon) {
    setSelected(pokemon);
    setQuery(pokemonTitle(pokemon));
  }

  function setShiny(shiny: boolean) {
    if (!selected) return;
    const next = resolveVariant(selected.dex, shiny);
    if (!next) return;
    setSelected(next);
    setQuery(pokemonTitle(next));
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const user = readLocalUser();
    if (!user?.gameNick) {
      toast.push("Complete o perfil antes de publicar.", "error");
      return;
    }

    setBusy(true);
    try {
      const input = {
        dex: selected.dex,
        shiny: selected.shiny,
        side: "venda" as const,
        world,
        priceBrl: priceNumber,
        note,
        showSellerNick,
        attrs,
      };

      const localListing: Listing = {
        id: `local_${Date.now().toString(36)}`,
        catalogId: selected.id,
        dex: selected.dex,
        number: selected.number,
        name: selected.name,
        displayName: selected.displayName,
        shiny: selected.shiny,
        image: selected.image,
        generation: selected.generation,
        tier: selected.tier,
        requiredLevel: selected.level,
        elements: selected.elements,
        side: "venda",
        world,
        priceBrl: priceNumber,
        seller: user.gameNick,
        showSellerNick,
        postedAt: new Date().toISOString(),
        note,
        attrs,
      };

      if (isApiConfigured()) {
        const result = await createListing(input);
        if (result.error || !result.data) {
          toast.push(
            result.error?.message ?? "Não deu pra publicar.",
            "error",
          );
          // Ainda salva localmente pra não perder o rascunho na conta.
          upsertOwnedListing({
            ...localListing,
            ownerId: user.id,
            status: "active",
          });
          setPublished(true);
          return;
        }
        upsertOwnedListing({
          ...result.data,
          ownerId: user.id,
          status: "active",
        });
        toast.push("Anúncio publicado.", "success");
        router.push("/conta/anuncios");
        return;
      }

      upsertOwnedListing({
        ...localListing,
        ownerId: user.id,
        status: "active",
      });
      setPublished(true);
      toast.push("Salvo na sua conta local (API ainda off).", "success");
    } finally {
      setBusy(false);
    }
  }

  const previewTitle = title ?? "Escolhe um Pokémon";

  return (
    <div>
      <header className="border-b border-line pb-6">
        <p className="rpg-label mb-0 tracking-[0.14em]">Novo anúncio</p>
        <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy sm:text-[2rem]">
          Vender Pokémon
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
          Monta o anúncio com os campos da ficha: aura, boost, star, helds,
          addon e treino. Required Level vem da espécie. Comida e buffs ficam
          de fora porque passam.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <form className="max-w-xl space-y-7" onSubmit={onSubmit}>
          <div>
            <label className="block">
              <span className="rpg-label">Pokémon</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(null);
                }}
                placeholder="Nome ou número (#094)"
                autoComplete="off"
                className="rpg-input mt-0"
              />
            </label>

            {!selected && query.trim() ? (
              <ul className="rpg-menu mt-1 max-h-64 overflow-y-auto">
                {suggestions.length === 0 ? (
                  <li className="px-3 py-2.5 text-[13px] text-muted">
                    Nada na wiki com esse nome.
                  </li>
                ) : (
                  suggestions.map((pokemon) => (
                    <li key={pokemon.id}>
                      <button
                        type="button"
                        onClick={() => pick(pokemon)}
                        className="rpg-menu-item flex items-center gap-3 px-2.5 py-2 text-[13px]"
                      >
                        <span className="art-well h-9 w-9 shrink-0 p-0.5">
                          <img
                            src={artworkForPokemon(pokemon)}
                            alt=""
                            className="h-full w-full object-contain"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {pokemonTitle(pokemon)}
                          {pokemon.shiny ? (
                            <IconShiny
                              className="ml-1 inline-block align-[-1px] text-[11px] text-price/70"
                              title="Shiny"
                            />
                          ) : null}
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
              <div className="mt-2 space-y-2">
                <div className="rpg-inset flex items-center gap-3 p-2.5">
                  <span className="art-well h-12 w-12 shrink-0 p-1">
                    <img
                      src={artworkForPokemon(selected)}
                      alt=""
                      className="h-full w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </span>
                  <div className="min-w-0 flex-1 text-[13px]">
                    <p className="truncate font-serif text-[1.05rem]">
                      {title}
                      {selected.shiny ? (
                        <IconShiny
                          className="ml-1.5 inline-block align-[-1px] text-[12px] text-price/65"
                          title="Shiny"
                        />
                      ) : null}
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
                    className="shrink-0 text-[12px] font-bold text-olive underline"
                  >
                    trocar
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rpg-label mb-0">Variante</span>
                  <div className="rpg-seg">
                    <button
                      type="button"
                      data-active={!selected.shiny}
                      onClick={() => setShiny(false)}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      data-active={selected.shiny}
                      onClick={() => setShiny(true)}
                      disabled={!canShiny}
                      title={
                        canShiny
                          ? "Usar variante shiny"
                          : "Sem shiny nesta espécie"
                      }
                    >
                      Shiny
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="rpg-label">Mundo</span>
              <select
                value={world}
                onChange={(event) => setWorld(event.target.value)}
                className="rpg-select"
              >
                {worlds.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="rpg-label">Preço em reais</span>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode="numeric"
                className="rpg-input tabular"
              />
            </label>
          </div>

          <fieldset>
            <legend className="rpg-label mb-0">Visibilidade neste anúncio</legend>
            <div className="rpg-seg mt-2 flex w-full max-w-sm">
              <button
                type="button"
                data-active={showSellerNick}
                onClick={() => setShowSellerNick(true)}
                className="flex-1"
              >
                Mostrar nick
              </button>
              <button
                type="button"
                data-active={!showSellerNick}
                onClick={() => setShowSellerNick(false)}
                className="flex-1"
              >
                Anônimo
              </button>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Vale só pra este anúncio. No chat da negociação o nick ainda pode
              aparecer pra combinar a entrega.
              {showSellerNick ? null : (
                <>
                  {" "}
                  Prévia: <span className="font-bold text-ink-soft">Anônimo</span>
                </>
              )}
            </p>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="rpg-label">Aura</span>
              <input
                type="number"
                min={0}
                value={attrs.aura ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setAttr("aura", raw === "" ? null : Number(raw));
                }}
                placeholder="ex: 3525"
                className="rpg-input tabular"
              />
            </label>
            <label className="block">
              <span className="rpg-label">Boost</span>
              <input
                type="number"
                min={0}
                value={attrs.boost ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setAttr("boost", raw === "" ? null : Number(raw));
                }}
                placeholder="ex: 25 → +25"
                className="rpg-input tabular"
              />
            </label>
          </div>

          <label className="block">
            <span className="rpg-label">Nickname</span>
            <input
              value={attrs.nickname ?? ""}
              onChange={(event) =>
                setAttr("nickname", event.target.value || null)
              }
              placeholder="Opcional"
              className="rpg-input"
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
            <span className="rpg-label">Addon / costume</span>
            <input
              value={attrs.addon ?? ""}
              onChange={(event) =>
                setAttr("addon", event.target.value || null)
              }
              placeholder="ex: kingdra coven costume"
              className="rpg-input"
            />
          </label>

          <fieldset>
            <legend className="rpg-label mb-0">Treinamento</legend>
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
                  <span className="text-[12px] font-semibold text-ink-soft">
                    {label}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={attrs.training[key].value ?? ""}
                    onChange={(event) =>
                      setTrain(key, "value", event.target.value)
                    }
                    placeholder="val"
                    aria-label={`${label} valor`}
                    className="rpg-input tabular px-2 py-1.5 text-[12px]"
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
                    className="rpg-input tabular px-2 py-1.5 text-[12px]"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="rpg-label">Nota livre</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Onde entrega, horário, se aceita diamonds…"
              className="rpg-textarea"
            />
          </label>

          <div className="flex items-center gap-4 border-t border-line pt-5">
            <button
              type="submit"
              disabled={!selected || busy}
              className="btn-brass px-4 py-2 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Publicando…" : "Publicar anúncio"}
            </button>
            <p className="text-[12px] text-muted">
              {published ? (
                <>
                  Salvo em{" "}
                  <Link
                    href="/conta/anuncios"
                    className="font-bold text-olive underline"
                  >
                    Meus anúncios
                  </Link>
                  .
                </>
              ) : selected ? (
                "Olha a ficha ao lado."
              ) : (
                "Escolhe um Pokémon pra seguir."
              )}
            </p>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <div>
            <p className="rpg-label">Prévia do card</p>
            <div className="rpg-panel mt-2 overflow-hidden">
              <div className="art-well relative aspect-[4/3] p-5">
                {selected ? (
                  <img
                    src={artworkForPokemon(selected)}
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="grid h-full place-items-center text-center text-[12px] text-muted">
                    A arte aparece aqui
                  </div>
                )}
                <div className="absolute left-2 top-2">
                  <span className="border-2 border-olive/40 bg-olive-soft px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-olive">
                    À venda
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h2 className="truncate font-serif text-[1.2rem] leading-tight">
                  {title ?? "Sem Pokémon"}
                  {selected?.shiny ? (
                    <IconShiny
                      className="ml-1.5 inline-block align-[-2px] text-[13px] text-price/65"
                      title="Shiny"
                    />
                  ) : null}
                </h2>
                {selected ? (
                  <>
                    <p className="mt-1.5 text-[12px] text-muted">
                      <ElementDots elements={selected.elements} withLabels />
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <TierBadge tier={selected.tier} />
                      <span className="border-2 border-navy/25 bg-paper-deep px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">
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
