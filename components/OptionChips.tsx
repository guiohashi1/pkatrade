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
      <legend className="text-[11px] uppercase tracking-[0.1em] text-muted">
        {label}
      </legend>
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
              onClick={() => onChange(option.id)}
              className={
                active
                  ? "border border-brass bg-brass/20 px-2.5 py-1.5 text-left text-[12px] text-ink"
                  : "border border-line bg-card px-2.5 py-1.5 text-left text-[12px] text-ink-soft hover:border-ink/35"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
