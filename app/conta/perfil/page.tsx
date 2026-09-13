import { Suspense } from "react";
import type { Metadata } from "next";
import { ProfileSetupForm } from "@/components/ProfileSetupForm";

export const metadata: Metadata = {
  title: "Perfil · pkatrade",
  description: "Ligue seu nick e mundo do PokeAlliance à conta.",
};

export default function ContaPerfilPage() {
  return (
    <div className="px-3 py-8 sm:px-6 sm:py-10">
      <Suspense
        fallback={<p className="text-[13px] text-muted">Carregando perfil…</p>}
      >
        <ProfileSetupForm />
      </Suspense>
    </div>
  );
}
