import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="hero-scene enter-fade mx-3 mt-3 sm:mx-5">
      <Image
        src="/hero/banner.png?v=gba1"
        alt=""
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, 1200px"
        className="hero-scene__art"
        aria-hidden
      />
      <div className="hero-scene__veil" aria-hidden />

      <div className="relative z-[1] flex min-h-[13.5rem] items-center px-4 py-5 sm:min-h-[16.5rem] sm:px-6 sm:py-7 lg:min-h-[18rem] lg:px-8">
        <div className="rpg-inset max-w-xl p-4 sm:p-5">
          <p className="font-[family-name:var(--font-pixel)] text-[1.35rem] leading-none tracking-wide text-navy sm:text-[1.7rem]">
            pkatrade
          </p>
          <h1 className="mt-3 text-[15px] font-bold leading-snug text-navy sm:text-[17px]">
            Seus Pokémon favoritos estão aqui
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
            Anuncie, encontre e combine a negociação direto com outros jogadores
            do PokeAlliance.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/anunciar" className="btn-brass px-3.5 py-2 text-[13px]">
              Vender agora
            </Link>
            <a href="#feed" className="btn-navy px-3.5 py-2 text-[13px]">
              Ver anúncios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
