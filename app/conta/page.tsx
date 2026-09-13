"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { isProfileComplete } from "@/lib/auth";
import { readLocalUser } from "@/lib/auth-session";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { AUTH_CHANGED_EVENT } from "@/lib/auth-nav";

function ContaHub() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    function sync() {
      setUser(readLocalUser());
    }
    sync();
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, []);

  const ready = isProfileComplete(user);

  return (
    <div className="mx-auto max-w-xl px-3 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <p className="rpg-label mb-0 tracking-[0.14em]">Conta</p>
        <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy">
          Sua área
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          {user?.email ? (
            <>
              Logado como{" "}
              <span className="font-bold text-ink-soft">{user.email}</span>
            </>
          ) : (
            "Gerencie perfil e anúncios."
          )}
        </p>
      </header>

      <div className="space-y-3">
        <Link
          href="/conta/anuncios"
          className="rpg-inset block p-4 transition hover:border-navy"
        >
          <p className="font-[family-name:var(--font-pixel)] text-[1.05rem] text-navy">
            Meus anúncios
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Ativos, vendidos e arquivados.
          </p>
        </Link>

        <Link
          href="/conta/perfil"
          className="rpg-inset block p-4 transition hover:border-navy"
        >
          <p className="font-[family-name:var(--font-pixel)] text-[1.05rem] text-navy">
            {ready ? "Perfil no jogo" : "Completar perfil"}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {ready
              ? `${user?.gameNick} · ${user?.world}`
              : "Nick e mundo obrigatórios pra anunciar."}
          </p>
        </Link>

        <Link href="/anunciar" className="btn-brass mt-2 inline-block px-4 py-2 text-[13px]">
          Criar anúncio
        </Link>
      </div>
    </div>
  );
}

export default function ContaPage() {
  return (
    <RequireAuth requireProfile={false}>
      <ContaHub />
    </RequireAuth>
  );
}
