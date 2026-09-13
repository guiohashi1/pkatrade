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
      <legend className="text-[11px] uppercase tracking-[0.1em] text-muted">
        Itens Held (até {MAX_HELDS})
      </legend>

      <div className="mt-2 min-h-[40px] rounded border border-line bg-card px-2.5 py-2">
        {value.length === 0 ? (
          <p className="text-[12px] text-muted">Nenhum held selecionado</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {value.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="inline-flex items-center gap-1.5 border border-brass/50 bg-brass/15 px-2 py-1 text-[12px] text-ink hover:bg-brass/25"
                  title="Remover"
                >
                  {heldLabel(id)}
                  <span aria-hidden className="text-muted">
                    ×
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="flex text-[13px]">
          {(["X", "Y"] as const).map((g, index) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGroup(g);
                setFamilyId(null);
              }}
              className={
                group === g
                  ? `border border-brass bg-brass/25 px-3 py-1.5 text-ink ${
                      index > 0 ? "-ml-px" : ""
                    }`
                  : `border border-line bg-card px-3 py-1.5 text-muted hover:text-ink ${
                      index > 0 ? "-ml-px" : ""
                    }`
              }
            >
              Held {g}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={clear}
          className="ml-auto text-[12px] text-muted underline decoration-line underline-offset-2 hover:text-ink"
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
              onClick={() =>
                setFamilyId((current) =>
                  current === family.id ? null : family.id,
                )
              }
              className={
                selected
                  ? "border border-brass bg-brass/20 px-2.5 py-2 text-left text-[13px] text-ink"
                  : "border border-line bg-card px-2.5 py-2 text-left text-[13px] text-ink-soft hover:border-brass/40"
              }
            >
              <span className="block text-[10px] uppercase tracking-[0.08em] text-muted">
                {family.group}
              </span>
              {short}
            </button>
          );
        })}
      </div>

      {activeFamily ? (
        <div className="mt-2 border border-line bg-paper-deep/40 px-3 py-3">
          <p className="text-[12px] text-ink-soft">
            Tier de <span className="text-ink">{activeFamily.name}</span>
            {full ? (
              <span className="text-muted">
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
                  onClick={() => addTier(tier)}
                  className={
                    active
                      ? "min-w-[2.75rem] border border-brass bg-brass px-3 py-2 text-[13px] font-medium text-ink"
                      : "min-w-[2.75rem] border border-line bg-card px-3 py-2 text-[13px] text-ink-soft hover:border-brass/50 hover:text-ink"
                  }
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
