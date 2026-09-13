"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleGlyph } from "@/components/GoogleGlyph";
import { useToast } from "@/components/ToastProvider";
import {
  googleAuthUrl,
  isApiConfigured,
  requestEmailCode,
  verifyEmailCode,
} from "@/lib/api";
import { isProfileComplete, type AuthUser } from "@/lib/auth";
import { perfilHref, safeReturnPath } from "@/lib/auth-nav";
import {
  mockGoogleSignIn,
  mockVerifyEmail,
  readLocalUser,
  writeLocalUser,
} from "@/lib/auth-session";

type Step = "email" | "code";

export function AuthPanel() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("next"), "/");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<AuthUser | null>(null);

  useEffect(() => {
    const user = readLocalUser();
    if (!user) return;
    if (isProfileComplete(user)) {
      router.replace(returnTo);
      return;
    }
    setExisting(user);
  }, [returnTo, router]);

  function afterAuth(user: AuthUser) {
    toast.push(
      isProfileComplete(user) ? "Bem-vindo de volta." : "Conta ok — completa o perfil.",
      "success",
    );
    if (isProfileComplete(user)) {
      router.push(returnTo);
      return;
    }
    router.push(perfilHref(returnTo));
  }

  async function onRequestCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await requestEmailCode(email);
      if (!result.ok) {
        setError(result.error ?? "Não deu pra enviar o código. Tenta de novo.");
        return;
      }
      setDemoCode(result.demoCode ?? null);
      setStep("code");
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isApiConfigured()) {
        const user = await verifyEmailCode(email, code);
        if (!user) {
          setError("Código inválido ou expirado.");
          return;
        }
        writeLocalUser(user);
        afterAuth(user);
        return;
      }

      const user = mockVerifyEmail(email, code);
      if (!user) {
        setError("Usa um email válido e o código de 6 dígitos.");
        return;
      }
      afterAuth(user);
    } finally {
      setBusy(false);
    }
  }

  function onGoogle() {
    setError(null);
    const url = googleAuthUrl(perfilHref(returnTo));
    if (url) {
      window.location.href = url;
      return;
    }
    const user = mockGoogleSignIn();
    afterAuth(user);
  }

  if (existing && !isProfileComplete(existing)) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rpg-panel space-y-4 p-4 sm:p-5">
          <p className="rpg-label mb-0">Quase lá</p>
          <h1 className="font-[family-name:var(--font-pixel)] text-[1.5rem] text-navy">
            Você já entrou
          </h1>
          <p className="text-[14px] text-muted">
            Falta nick e mundo pra anunciar. Conta:{" "}
            <span className="font-bold text-ink-soft">{existing.email}</span>
          </p>
          <Link
            href={perfilHref(returnTo)}
            className="btn-brass inline-block px-4 py-2.5 text-[13px]"
          >
            Completar perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-6">
        <p className="rpg-label mb-0 tracking-[0.14em]">Conta</p>
        <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy">
          Entrar ou criar conta
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          Email com código ou Google. Depois você liga o nick e o mundo do
          PokeAlliance.
        </p>
      </header>

      <div className="rpg-panel space-y-5 p-4 sm:p-5">
        <button
          type="button"
          onClick={onGoogle}
          className="flex w-full items-center justify-center gap-2 border-2 border-navy bg-card px-3 py-2.5 text-[13px] font-bold text-ink hover:bg-paper"
        >
          <GoogleGlyph className="text-[18px]" />
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
          <span className="h-px flex-1 bg-line" />
          ou email
          <span className="h-px flex-1 bg-line" />
        </div>

        {step === "email" ? (
          <form className="space-y-4" onSubmit={onRequestCode}>
            <label className="block">
              <span className="rpg-label">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="treinador@email.com"
                className="rpg-input"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="btn-brass w-full px-3 py-2.5 text-[13px] disabled:opacity-60"
            >
              {busy ? "Enviando…" : "Receber código"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onVerifyCode}>
            <p className="text-[13px] text-muted">
              Código enviado para{" "}
              <span className="font-bold text-ink-soft">{email}</span>
            </p>
            {demoCode ? (
              <p className="rpg-inset px-3 py-2 text-[12px] text-ink-soft">
                Modo local: código{" "}
                <span className="font-extrabold tabular text-navy">
                  {demoCode}
                </span>
              </p>
            ) : null}
            <label className="block">
              <span className="rpg-label">Código</span>
              <input
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoComplete="one-time-code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6 dígitos"
                className="rpg-input tabular tracking-[0.2em]"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setDemoCode(null);
                  setError(null);
                }}
                className="border-2 border-navy/30 bg-paper px-3 py-2.5 text-[13px] font-bold text-ink-soft"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="btn-brass flex-1 px-3 py-2.5 text-[13px] disabled:opacity-60"
              >
                {busy ? "Validando…" : "Entrar"}
              </button>
            </div>
          </form>
        )}

        {error ? (
          <p className="border-l-2 border-warn bg-warn-soft/40 px-3 py-2 text-[12px] text-warn">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
