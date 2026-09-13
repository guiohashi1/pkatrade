"use client";

import type { AuthProvider, AuthUser, UpdateProfileInput } from "@/lib/auth";
import { isProfileComplete, normalizeGameNick } from "@/lib/auth";
import { notifyAuthChanged } from "@/lib/auth-nav";

const STORAGE_KEY = "pkatrade.auth.user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readLocalUser(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser & {
      showNickOnListings?: boolean;
    };
    if (
      parsed.defaultShowNickOnListings === undefined &&
      typeof parsed.showNickOnListings === "boolean"
    ) {
      parsed.defaultShowNickOnListings = parsed.showNickOnListings;
    }
    if (parsed.defaultShowNickOnListings === undefined) {
      parsed.defaultShowNickOnListings = true;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeLocalUser(user: AuthUser | null) {
  if (!canUseStorage()) return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  notifyAuthChanged();
}

export function clearLocalUser() {
  writeLocalUser(null);
}

function mockId() {
  return `usr_mock_${Date.now().toString(36)}`;
}

/** Demo: qualquer email + código com 6 dígitos abre sessão. */
export function mockVerifyEmail(email: string, code: string): AuthUser | null {
  const cleaned = email.trim().toLowerCase();
  if (!cleaned.includes("@")) return null;
  if (!/^\d{6}$/.test(code.trim())) return null;

  const existing = readLocalUser();
  if (existing && existing.email === cleaned) {
    const providers = existing.providers.includes("email")
      ? existing.providers
      : ([...existing.providers, "email"] as AuthProvider[]);
    const next = { ...existing, providers };
    writeLocalUser(next);
    return next;
  }

  const user: AuthUser = {
    id: mockId(),
    email: cleaned,
    providers: ["email"],
    gameNick: null,
    world: null,
    defaultShowNickOnListings: true,
    createdAt: new Date().toISOString(),
  };
  writeLocalUser(user);
  return user;
}

/** Demo: “login Google” cria/atualiza sessão local. */
export function mockGoogleSignIn(): AuthUser {
  const existing = readLocalUser();
  if (existing) {
    const providers = existing.providers.includes("google")
      ? existing.providers
      : ([...existing.providers, "google"] as AuthProvider[]);
    const next = { ...existing, providers };
    writeLocalUser(next);
    return next;
  }

  const user: AuthUser = {
    id: mockId(),
    email: "treinador.google@gmail.com",
    providers: ["google"],
    gameNick: null,
    world: null,
    defaultShowNickOnListings: true,
    createdAt: new Date().toISOString(),
  };
  writeLocalUser(user);
  return user;
}

export function mockUpdateProfile(input: UpdateProfileInput): AuthUser | null {
  const user = readLocalUser();
  if (!user) return null;
  const next: AuthUser = {
    ...user,
    gameNick: normalizeGameNick(input.gameNick),
    world: input.world,
    defaultShowNickOnListings: input.defaultShowNickOnListings,
  };
  writeLocalUser(next);
  return next;
}

export function mockLinkGoogle(): AuthUser | null {
  const existing = readLocalUser();
  if (!existing) return null;
  if (existing.providers.includes("google")) return existing;
  const next: AuthUser = {
    ...existing,
    providers: [...existing.providers, "google"],
  };
  writeLocalUser(next);
  return next;
}
