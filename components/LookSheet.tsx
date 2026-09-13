import { formatAttrs, type ListingAttrs } from "@/lib/listing-attrs";

/**
 * Ficha no estilo look do cliente / PokeAlliance.
 * Os campos vêm do formulário, no mesmo formato da UI do jogo.
 */
export function LookSheet({
  title,
  attrs,
  requiredLevel = null,
}: {
  title: string;
  attrs: ListingAttrs;
  requiredLevel?: number | null;
}) {
  const rows = formatAttrs(attrs, { requiredLevel });

  return (
    <section className="look-sheet px-4 py-4 sm:px-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-look-dim">
        You see…
      </p>
      <p className="mt-2 font-serif text-[1.15rem] leading-tight text-[#e8f6df]">
        {title}
      </p>

      {rows.length === 0 ? (
        <p className="mt-3 text-[13px] leading-relaxed text-look-dim">
          Sem atributos ainda. Coloca aura, boost, held ou treino no formulário.
        </p>
      ) : (
        <dl className="mt-3 space-y-1 text-[12.5px] leading-relaxed tracking-tight text-look-ink">
          {rows.map((row) => (
            <div key={`${row.key}-${row.value}`} className="flex gap-2">
              <dt className="w-[7.5rem] shrink-0 text-look-dim">{row.key}</dt>
              <dd className="min-w-0 break-words">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
