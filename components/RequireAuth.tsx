"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isProfileComplete } from "@/lib/auth";
import { AUTH_CHANGED_EVENT, entrarHref, perfilHref } from "@/lib/auth-nav";
import { readLocalUser } from "@/lib/auth-session";

type Gate = "auth" | "profile";

/**
 * Guarda client-side: exige sessão e, se pedido, perfil completo (nick+mundo).
 * Enquanto decide, mostra um placeholder leve pra não flashar o form.
 */
export function RequireAuth({
  children,
  requireProfile = true,
}: {
  children: ReactNode;
  requireProfile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [gate, setGate] = useState<"loading" | "ok" | Gate>("loading");

  useEffect(() => {
    function check() {
      const user = readLocalUser();
      if (!user) {
        setGate("auth");
        router.replace(entrarHref(pathname));
        return;
      }
      if (requireProfile && !isProfileComplete(user)) {
        setGate("profile");
        router.replace(perfilHref(pathname));
        return;
      }
      setGate("ok");
    }

    check();
    window.addEventListener(AUTH_CHANGED_EVENT, check);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, check);
  }, [pathname, requireProfile, router]);

  if (gate !== "ok") {
    return (
      <div className="px-3 py-10 sm:px-6">
        <div className="rpg-inset mx-auto max-w-md px-4 py-5 text-center">
          <p className="rpg-label mb-0">Acesso</p>
          <p className="mt-2 text-[14px] text-ink-soft">
            {gate === "auth"
              ? "Redirecionando para entrar…"
              : gate === "profile"
                ? "Complete nick e mundo pra anunciar…"
                : "Verificando sessão…"}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
