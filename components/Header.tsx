import Link from "next/link";
import { NavLink } from "@/components/NavLink";

export function Header() {
  return (
    <header className="site-panel-header sticky top-0 z-20">
      <div className="flex items-center gap-5 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="pokeball-mark" aria-hidden />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.35rem] tracking-tight text-ink">
              pkatrade
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-brass">
              bazar PokeAlliance
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-4 text-[13px] sm:gap-5">
          <NavLink href="/">Anúncios</NavLink>
          <NavLink href="/sobre">Sobre</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/anunciar" className="btn-brass px-3 py-1.5 text-[13px]">
            Criar anúncio
          </Link>
          <button
            type="button"
            disabled
            title="Login ainda não ligado"
            className="hidden border border-line bg-card px-3 py-1.5 text-[13px] text-muted sm:block"
          >
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
}
