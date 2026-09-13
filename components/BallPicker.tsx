"use client";

import { ballOptions, ballSprite, type BallOption } from "@/lib/balls";
import { NONE } from "@/lib/listing-attrs";

const NONE_OPTION = { id: NONE, label: "Não informar" } as const;

export function BallPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (ball: string | null) => void;
}) {
  const selected = value ?? NONE;

  function pick(id: string) {
    onChange(id === NONE ? null : id);
  }

  return (
    <fieldset>
      <legend className="rpg-label mb-0">Pokébola</legend>
      <p className="mt-1 text-[12px] text-muted">
        A bola de captura (no jogo aparece como “Aura: premier” etc.). Influi
        bastante no preço.
      </p>

      <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        <BallChip
          option={NONE_OPTION}
          active={selected === NONE}
          onClick={() => pick(NONE)}
        />
        {ballOptions.map((option) => (
          <BallChip
            key={option.id}
            option={option}
            active={selected === option.id}
            onClick={() => pick(option.id)}
            sprite
          />
        ))}
      </div>
    </fieldset>
  );
}

function BallChip({
  option,
  active,
  onClick,
  sprite = false,
}: {
  option: BallOption | typeof NONE_OPTION;
  active: boolean;
  onClick: () => void;
  sprite?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      title={option.label}
      className="rpg-chip flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-center"
    >
      {sprite ? (
        <img
          src={ballSprite(option.id)}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
          style={{ imageRendering: "pixelated" }}
        />
      ) : null}
      <span className="line-clamp-2 text-[9px] font-bold leading-tight">
        {option.label}
      </span>
    </button>
  );
}
