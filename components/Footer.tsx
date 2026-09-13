import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-deep/50">
      <div className="grid gap-6 px-4 py-7 text-[12px] leading-relaxed text-muted sm:grid-cols-[1fr_auto] sm:px-6">
        <div className="max-w-md">
          <p className="flex items-center gap-2 font-serif text-[1.1rem] leading-none text-ink">
            <span className="pokeball-mark" aria-hidden />
            pkatrade
          </p>
          <p className="mt-2.5">
            Classificados de Pokémon no PokeAlliance. O site não segura dinheiro:
            vocês combinam no chat e entregam no jogo. RMT é permitido no
            servidor, o risco é de quem negocia.
          </p>
        </div>

        <nav className="flex gap-8 sm:justify-end">
          <div className="space-y-1.5">
            <Link href="/" className="block hover:text-ink">
              Anúncios
            </Link>
            <Link href="/anunciar" className="block hover:text-ink">
              Criar anúncio
            </Link>
            <Link href="/sobre" className="block hover:text-ink">
              Sobre
            </Link>
          </div>
          <div className="space-y-1.5">
            <a
              href="https://wiki.pokealliance.com/pokemon"
              className="block hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              Wiki
            </a>
            <a
              href="https://pokealliance.com"
              className="block hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              PokeAlliance
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
