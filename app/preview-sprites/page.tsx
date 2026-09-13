import catalog from "@/data/catalog.json";
import { lookTypeForDex } from "@/lib/art";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Preview sprites (dex 1–251)",
};

type Poke = {
  dex: number;
  name: string;
  shiny: boolean;
};

const BLOCKS = [
  {
    title: "Gen 1 early · 1–98 (shiny map only; normals → wiki)",
    from: 1,
    to: 98,
    formula: "shiny = dex + 404; normal unmapped (+901 was Ditto transform)",
    shinyOnly: true,
  },
  {
    title: "Gen 1 late · 99–151",
    from: 99,
    to: 151,
    formula: "lookType = dex - 98",
    shinyOnly: false,
  },
  {
    title: "Gen 2 · 152–201",
    from: 152,
    to: 201,
    formula: "lookType = dex - 4",
    shinyOnly: false,
  },
  {
    title: "Gen 2 after Unown · 202–251",
    from: 202,
    to: 251,
    formula: "lookType = dex + 22",
    shinyOnly: false,
  },
] as const;

/** Só em desenvolvimento — escondido em build de produção. */
export default function PreviewSpritesPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const byDex = new Map(
    (catalog.pokemon as Poke[])
      .filter((p) => !p.shiny && p.dex >= 1 && p.dex <= 251)
      .map((p) => [p.dex, p]),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <p className="rpg-label mb-0">Dev only</p>
        <h1 className="font-[family-name:var(--font-pixel)] text-[1.75rem] text-navy">
          Map sprites · dex 1–251
        </h1>
        <p className="max-w-2xl text-[14px] text-muted">
          Página interna de QA. Em produção retorna 404.
        </p>
      </header>

      {BLOCKS.map((block) => {
        const sprites = [];
        for (let dex = block.from; dex <= block.to; dex++) {
          const p = byDex.get(dex);
          const shiny = block.shinyOnly;
          const lookType = lookTypeForDex(dex, shiny);
          if (!p || lookType == null) continue;
          const pad = String(dex).padStart(3, "0");
          sprites.push({
            dex,
            name: p.name,
            lookType,
            src: shiny
              ? `/sprites/map/${pad}.1.png`
              : `/sprites/map/${pad}.png`,
          });
        }

        return (
          <section key={block.title} className="mb-12">
            <div className="mb-4 space-y-1">
              <h2 className="text-[1.1rem] font-bold text-navy">{block.title}</h2>
              <p className="text-[13px] text-muted">
                {sprites.length} sprites ·{" "}
                <code className="text-price">{block.formula}</code>
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sprites.map((s) => (
                <li
                  key={s.dex}
                  className="rpg-inset flex flex-col items-center gap-2 p-3"
                >
                  <div className="art-well flex h-28 w-full items-center justify-center">
                    <img
                      src={`${s.src}?v=10`}
                      alt={s.name}
                      className="max-h-24 max-w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="w-full text-center">
                    <p className="truncate text-[13px] font-bold text-ink">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-muted">
                      dex {String(s.dex).padStart(3, "0")} · lt {s.lookType}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
