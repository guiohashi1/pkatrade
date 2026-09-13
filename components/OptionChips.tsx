"use client";

type Option = { id: string; label: string };

export function OptionChips({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: {
  label: string;
  options: readonly Option[];
  value: string | null;
  onChange: (id: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="rpg-label mb-0">{label}</legend>
      <div
        className={
          columns === 3
            ? "mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3"
            : "mt-2 grid grid-cols-2 gap-1.5"
        }
      >
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              data-active={active}
              onClick={() => onChange(option.id)}
              className="rpg-chip"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
