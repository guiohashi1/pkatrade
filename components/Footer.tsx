import Link from "next/link";
import { IconTrade } from "@/components/Icons";

/** Selos pixel art originais (inspirados em badges de ginásio). */
const BADGES = [
  { id: 1, name: "Boulder" },
  { id: 2, name: "Cascade" },
  { id: 3, name: "Thunder" },
  { id: 4, name: "Rainbow" },
  { id: 5, name: "Soul" },
  { id: 6, name: "Marsh" },
  { id: 7, name: "Volcano" },
  { id: 8, name: "Earth" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t-[3px] border-navy bg-gradient-to-b from-navy to-navy-deep text-sky-soft">
      <div className="grid gap-5 px-4 py-6 sm:grid-cols-[1.2fr_1fr] sm:px-6 sm:py-7">
        <div className="flex gap-3">
          <IconTrade className="float-soft hidden shrink-0 text-[2.75rem] text-gold sm:block" />
          <div className="rpg-inset max-w-md border-sky/30 bg-card/95 p-3 text-ink">
            <p className="text-[12px] font-bold leading-snug">
              Dúvidas? Combinem no chat e fechem a troca no jogo — o site só
              conecta vendedores e compradores.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <ul
            className="flex flex-wrap items-center gap-1"
            aria-label="Selos pixel art"
          >
            {BADGES.map((badge) => (
              <li key={badge.id}>
                <span
                  className="badge-slot grid h-10 w-10 place-items-center"
                  title={`Selo ${badge.name}`}
                >
                  <img
                    src={`/badges/pixel-${badge.id}.png`}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="sr-only">Selo {badge.name}</span>
                </span>
              </li>
            ))}
          </ul>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-semibold">
            <Link href="/" className="hover:text-cream">
              Anúncios
            </Link>
            <Link href="/anunciar" className="hover:text-cream">
              Criar anúncio
            </Link>
            <Link href="/conta" className="hover:text-cream">
              Conta
            </Link>
            <Link href="/sobre" className="hover:text-cream">
              Sobre
            </Link>
            <a
              href="https://wiki.pokealliance.com/pokemon"
              className="hover:text-cream"
              target="_blank"
              rel="noreferrer"
            >
              Wiki
            </a>
          </nav>
          <p className="text-[11px] text-sky/70">
            pkatrade · classificados PokeAlliance · RMT sob risco das partes
          </p>
        </div>
      </div>
      <div
        className="h-3 border-t-2 border-navy-deep"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#5c8a48 0 10px,#4a6a38 10px 20px,#6a5238 20px 28px,#5c8a48 28px 38px)",
        }}
        aria-hidden
      />
    </footer>
  );
}
