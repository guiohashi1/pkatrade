"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleGlyph } from "@/components/GoogleGlyph";
import { useToast } from "@/components/ToastProvider";
import { googleAuthUrl, isApiConfigured, updateProfile } from "@/lib/api";
import {
  isProfileComplete,
  normalizeGameNick,
  type AuthUser,
} from "@/lib/auth";
import { entrarHref, safeReturnPath } from "@/lib/auth-nav";
import {
  mockLinkGoogle,
  mockUpdateProfile,
  readLocalUser,
  writeLocalUser,
} from "@/lib/auth-session";
import { worlds, type World } from "@/lib/listings";

export function ProfileSetupForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("next"), "/");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [gameNick, setGameNick] = useState("");
  const [world, setWorld] = useState<World | "">("");
  const [defaultShowNick, setDefaultShowNick] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const local = readLocalUser();
    if (!local) {
      router.replace(entrarHref(returnTo === "/" ? "/conta/perfil" : returnTo));
      return;
    }
    setUser(local);
    setGameNick(local.gameNick ?? "");
    setWorld(local.world ?? "");
    setDefaultShowNick(local.defaultShowNickOnListings);
    setReady(true);
  }, [returnTo, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const nick = normalizeGameNick(gameNick);
    if (nick.length < 2) {
      setError("Nick precisa ter pelo menos 2 caracteres.");
      return;
    }
    if (!world) {
      setError("Escolhe o mundo — é obrigatório.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        gameNick: nick,
        world,
        defaultShowNickOnListings: defaultShowNick,
      };

      if (isApiConfigured()) {
        const updated = await updateProfile(payload);
        if (!updated) {
          setError("Não deu pra salvar o perfil. Tenta de novo.");
          return;
        }
        writeLocalUser(updated);
        toast.push("Perfil salvo.", "success");
        router.push(returnTo === "/" ? "/conta" : returnTo);
        return;
      }

      const updated = mockUpdateProfile(payload);
      if (!updated) {
        setError("Sessão expirada. Entra de novo.");
        router.replace(entrarHref(returnTo));
        return;
      }
      setUser(updated);
      toast.push("Perfil salvo.", "success");
      router.push(returnTo === "/" ? "/conta" : returnTo);
    } finally {
      setBusy(false);
    }
  }

  function linkGoogle() {
    const url = googleAuthUrl("/conta/perfil");
    if (url) {
      window.location.href = url;
      return;
    }
    const next = mockLinkGoogle();
    if (!next) {
      toast.push("Faça login de novo.", "error");
      return;
    }
    setUser(next);
    toast.push("Google vinculado nesta conta.", "success");
  }

  if (!ready || !user) {
    return <p className="text-[13px] text-muted">Carregando perfil…</p>;
  }

  const editing = isProfileComplete(user);
  const hasGoogle = user.providers.includes("google");
  const hasEmail = user.providers.includes("email");

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="mb-6">
        <p className="rpg-label mb-0 tracking-[0.14em]">Perfil no jogo</p>
        <h1 className="mt-2 font-[family-name:var(--font-pixel)] text-[1.75rem] leading-tight tracking-wide text-navy">
          {editing ? "Seu personagem" : "Ligar conta ao jogo"}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          Nick e mundo identificam seu personagem. A visibilidade do nick você
          escolhe em cada anúncio.
        </p>
      </header>

      <form className="rpg-panel space-y-5 p-4 sm:p-5" onSubmit={onSubmit}>
        <p className="text-[12px] text-muted">
          Logado como{" "}
          <span className="font-bold text-ink-soft">{user.email}</span>
        </p>

        <label className="block">
          <span className="rpg-label">Nick no PokeAlliance</span>
          <input
            required
            minLength={2}
            maxLength={24}
            value={gameNick}
            onChange={(event) => setGameNick(event.target.value)}
            placeholder="Ex.: AshKetch"
            className="rpg-input"
          />
        </label>

        <label className="block">
          <span className="rpg-label">Mundo</span>
          <select
            required
            value={world}
            onChange={(event) => setWorld(event.target.value as World | "")}
            className="rpg-select"
          >
            <option value="" disabled>
              Selecione…
            </option>
            {worlds.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="mt-1.5 block text-[12px] text-muted">
            Servidor principal do personagem.
          </span>
        </label>

        <fieldset>
          <legend className="rpg-label mb-0">
            Preferência ao criar anúncio
          </legend>
          <div className="rpg-seg mt-2 flex w-full">
            <button
              type="button"
              data-active={defaultShowNick}
              onClick={() => setDefaultShowNick(true)}
              className="flex-1"
            >
              Mostrar nick
            </button>
            <button
              type="button"
              data-active={!defaultShowNick}
              onClick={() => setDefaultShowNick(false)}
              className="flex-1"
            >
              Anônimo
            </button>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Só o padrão do formulário. Em cada anúncio você pode mudar.
          </p>
        </fieldset>

        <div className="border-t border-line pt-4">
          <p className="rpg-label mb-0">Login vinculado</p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-ink-soft">
            <li>
              Email:{" "}
              <span className="font-bold">
                {hasEmail ? "ligado" : "não ligado"}
              </span>
            </li>
            <li>
              Google:{" "}
              <span className="font-bold">
                {hasGoogle ? "ligado" : "não ligado"}
              </span>
            </li>
          </ul>
          {!hasGoogle ? (
            <button
              type="button"
              onClick={linkGoogle}
              className="mt-3 flex w-full items-center justify-center gap-2 border-2 border-navy bg-card px-3 py-2 text-[13px] font-bold text-ink hover:bg-paper"
            >
              <GoogleGlyph className="text-[16px]" />
              Vincular Google
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="border-l-2 border-warn bg-warn-soft/40 px-3 py-2 text-[12px] text-warn">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="btn-brass w-full px-3 py-2.5 text-[13px] disabled:opacity-60"
        >
          {busy ? "Salvando…" : editing ? "Salvar" : "Concluir"}
        </button>

        {editing ? (
          <p className="text-center text-[12px] text-muted">
            <Link href="/conta" className="font-bold text-olive underline">
              Voltar à conta
            </Link>
            {" · "}
            <Link href="/conta/anuncios" className="font-bold text-olive underline">
              Meus anúncios
            </Link>
          </p>
        ) : null}
      </form>
    </div>
  );
}
