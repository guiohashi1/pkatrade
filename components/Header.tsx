"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconTrade } from "@/components/Icons";
import { NavLink } from "@/components/NavLink";
import type { AuthUser } from "@/lib/auth";
import { isProfileComplete } from "@/lib/auth";
import { AUTH_CHANGED_EVENT } from "@/lib/auth-nav";
import { clearLocalUser, readLocalUser } from "@/lib/auth-session";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function sync() {
      setUser(readLocalUser());
    }
    sync();
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function logout() {
    clearLocalUser();
    setUser(null);
    setMenuOpen(false);
  }

  const profileReady = isProfileComplete(user);

  return (
    <header className="rpg-panel-header sticky top-0 z-20">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:gap-6 sm:px-5 sm:py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 text-cream">
          <IconTrade className="shrink-0 text-[26px] text-gold" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-[family-name:var(--font-pixel)] text-[1.15rem] tracking-wide sm:text-[1.35rem]">
              pkatrade
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.18em] text-sky-soft/90 sm:block">
              bazar PokeAlliance
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 text-[13px] font-bold sm:flex">
          <NavLink href="/">Anúncios</NavLink>
          <NavLink href="/anunciar">Anunciar</NavLink>
          <NavLink href="/sobre">Sobre</NavLink>
          {user ? <NavLink href="/conta">Conta</NavLink> : null}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/anunciar"
            className="btn-brass hidden px-3 py-1.5 text-[13px] sm:inline-flex"
          >
            Criar anúncio
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/conta"
                className="max-w-[9rem] truncate border-2 border-sky/40 bg-navy-deep/40 px-3 py-1.5 text-[13px] font-bold text-sky-soft hover:border-gold/50"
                title={user.email}
              >
                {profileReady ? user.gameNick : "Completar perfil"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="border-2 border-sky/30 bg-transparent px-2.5 py-1.5 text-[12px] font-bold text-sky-soft/80 hover:text-cream"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/entrar"
              className="hidden border-2 border-sky/40 bg-navy-deep/40 px-3 py-1.5 text-[13px] font-bold text-sky-soft hover:border-gold/50 sm:block"
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border-2 border-sky/40 bg-navy-deep/40 text-sky-soft sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="flex flex-col gap-1" aria-hidden>
              <span
                className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t-2 border-navy-deep/60 bg-navy-deep/35 px-3 py-3 sm:hidden"
        >
          <nav className="flex flex-col gap-1 text-[14px] font-bold">
            <Link
              href="/"
              className="rounded-sm px-2 py-2 text-sky-soft hover:bg-navy-deep/50 hover:text-cream"
            >
              Anúncios
            </Link>
            <Link
              href="/anunciar"
              className="rounded-sm px-2 py-2 text-sky-soft hover:bg-navy-deep/50 hover:text-cream"
            >
              Anunciar
            </Link>
            <Link
              href="/sobre"
              className="rounded-sm px-2 py-2 text-sky-soft hover:bg-navy-deep/50 hover:text-cream"
            >
              Sobre
            </Link>
            {user ? (
              <Link
                href="/conta"
                className="rounded-sm px-2 py-2 text-sky-soft hover:bg-navy-deep/50 hover:text-cream"
              >
                Minha conta
              </Link>
            ) : null}
          </nav>

          <div className="mt-3 space-y-2 border-t border-sky/20 pt-3">
            <Link href="/anunciar" className="btn-brass block px-3 py-2 text-center text-[13px]">
              Criar anúncio
            </Link>

            {user ? (
              <>
                <Link
                  href="/conta"
                  className="block border-2 border-sky/40 bg-navy-deep/40 px-3 py-2 text-center text-[13px] font-bold text-sky-soft"
                >
                  {profileReady ? user.gameNick : "Completar perfil"}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full border-2 border-sky/30 bg-transparent px-3 py-2 text-[13px] font-bold text-sky-soft/85"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/entrar"
                className="block border-2 border-sky/40 bg-navy-deep/40 px-3 py-2 text-center text-[13px] font-bold text-sky-soft"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
