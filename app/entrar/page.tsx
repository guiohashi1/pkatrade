import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";

export const metadata: Metadata = {
  title: "Entrar · pkatrade",
  description: "Entre com email ou Google para anunciar no pkatrade.",
};

function AuthFallback() {
  return (
    <p className="mx-auto max-w-md text-[13px] text-muted">Carregando…</p>
  );
}

export default function EntrarPage() {
  return (
    <div className="px-3 py-8 sm:px-6 sm:py-10">
      <Suspense fallback={<AuthFallback />}>
        <AuthPanel />
      </Suspense>
    </div>
  );
}
