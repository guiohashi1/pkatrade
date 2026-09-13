/** Paths de retorno após login/perfil (evita open redirect). */
export function safeReturnPath(raw: string | null | undefined, fallback = "/") {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/entrar")) return fallback;
  return raw;
}

export function entrarHref(returnTo?: string) {
  const next = safeReturnPath(returnTo, "");
  if (!next || next === "/") return "/entrar";
  return `/entrar?next=${encodeURIComponent(next)}`;
}

export function perfilHref(returnTo?: string) {
  const next = safeReturnPath(returnTo, "");
  if (!next || next === "/") return "/conta/perfil";
  return `/conta/perfil?next=${encodeURIComponent(next)}`;
}

export const AUTH_CHANGED_EVENT = "pkatrade:auth-changed";

export function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
