"use client";

import { useMemo, useState } from "react";
import {
  heldFamilies,
  heldLabel,
  heldOptionId,
  MAX_HELDS,
  type HeldFamily,
} from "@/lib/listing-attrs";

export function HeldPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (helds: string[]) => void;
}) {
  const [group, setGroup] = useState<"X" | "Y">("X");
  const [familyId, setFamilyId] = useState<string | null>(null);

  const families = useMemo(
    () => heldFamilies.filter((family) => family.group === group),
    [group],
  );

  const activeFamily: HeldFamily | null =
    families.find((family) => family.id === familyId) ?? null;

  const full = value.length >= MAX_HELDS;

  function remove(id: string) {
    onChange(value.filter((held) => held !== id));
  }

  function clear() {
    onChange([]);
    setFamilyId(null);
  }

  function addTier(tier: number) {
    if (!activeFamily) return;
    const id = heldOptionId(activeFamily.id, tier);
    if (value.includes(id)) {
      remove(id);
      return;
    }
    if (full) {
      onChange([...value.slice(1), id]);
    } else {
      onChange([...value, id]);
    }
    setFamilyId(null);
  }

  return (
    <fieldset>
      <legend className="rpg-label mb-0">Itens Held (até {MAX_HELDS})</legend>

      <div className="rpg-inset mt-2 min-h-[40px] px-2.5 py-2">
        {value.length === 0 ? (
          <p className="text-[12px] text-muted">Nenhum held selecionado</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {value.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="rpg-chip inline-flex items-center gap-1.5"
                  data-active="true"
                  title="Remover"
                >
                  {heldLabel(id)}
                  <span aria-hidden className="opacity-60">
                    ×
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="rpg-seg">
          {(["X", "Y"] as const).map((g) => (
            <button
              key={g}
              type="button"
              data-active={group === g}
              onClick={() => {
                setGroup(g);
                setFamilyId(null);
              }}
            >
              Held {g}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={clear}
          className="ml-auto text-[12px] font-bold text-olive underline underline-offset-2"
        >
          Sem held
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {families.map((family) => {
          const selected = familyId === family.id;
          const short = family.name.replace(/^[XY]-/, "");
          return (
            <button
              key={family.id}
              type="button"
              data-active={selected}
              onClick={() =>
                setFamilyId((current) =>
                  current === family.id ? null : family.id,
                )
              }
              className="rpg-chip"
            >
              <span className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70">
                {family.group}
              </span>
              {short}
            </button>
          );
        })}
      </div>

      {activeFamily ? (
        <div className="rpg-inset mt-2 px-3 py-3">
          <p className="text-[12px] font-semibold text-ink-soft">
            Tier de <span className="text-ink">{activeFamily.name}</span>
            {full ? (
              <span className="font-medium text-muted">
                {" "}
                · já tem 2: o próximo troca o mais antigo
              </span>
            ) : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeFamily.tiers.map((tier) => {
              const id = heldOptionId(activeFamily.id, tier);
              const active = value.includes(id);
              return (
                <button
                  key={tier}
                  type="button"
                  data-active={active}
                  onClick={() => addTier(tier)}
                  className="rpg-chip min-w-[2.75rem] text-center"
                >
                  T{tier}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[12px] text-muted">
          Escolhe o held e depois o tier.
        </p>
      )}
    </fieldset>
  );
}
