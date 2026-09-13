import { worlds, type World } from "@/lib/listings";

export type AuthProvider = "email" | "google";

export type AuthUser = {
  id: string;
  email: string;
  providers: AuthProvider[];
  /** Nick do personagem no PokeAlliance. */
  gameNick: string | null;
  /** Mundo principal — obrigatório para fechar o perfil. */
  world: World | null;
  /**
   * Preferência ao criar anúncio (default do form).
   * A escolha final é por anúncio: Listing.showSellerNick.
   */
  defaultShowNickOnListings: boolean;
  createdAt: string;
};

export type UpdateProfileInput = {
  gameNick: string;
  world: World;
  defaultShowNickOnListings: boolean;
};

export function isWorld(value: string): value is World {
  return (worlds as readonly string[]).includes(value);
}

export function isProfileComplete(user: AuthUser | null | undefined) {
  if (!user) return false;
  return Boolean(user.gameNick?.trim() && user.world && isWorld(user.world));
}

/** Preferência padrão ao abrir o formulário de anúncio. */
export function defaultShowNickPreference(
  user: Pick<AuthUser, "defaultShowNickOnListings"> | null | undefined,
) {
  return user?.defaultShowNickOnListings ?? true;
}

export function normalizeGameNick(raw: string) {
  return raw.trim().replace(/\s+/g, " ").slice(0, 24);
}
