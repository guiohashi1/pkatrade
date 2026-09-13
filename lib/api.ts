import type { AuthUser, UpdateProfileInput } from "@/lib/auth";
import { errResult, okResult, type ApiResult } from "@/lib/api-result";
import type { ListingAttrs } from "@/lib/listing-attrs";
import type { Listing, World } from "@/lib/listings";
import {
  getMockListing,
  getMockRelated,
  mockListings,
} from "@/lib/mock-listings";
import type { OwnedListing } from "@/lib/my-listings";

/**
 * Camada de API do front.
 * Sem NEXT_PUBLIC_API_URL: usa mocks (anúncios + auth local) para a UI.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export type ListingsQuery = {
  q?: string;
  world?: World | "todos";
  shiny?: boolean;
  generation?: number | "todos";
  tier?: string | "todos";
  element?: string | "todos";
  sort?: "recente" | "barato" | "caro";
};

export type CreateListingInput = {
  dex: number;
  shiny: boolean;
  side: "venda";
  world: string;
  priceBrl: number;
  note: string;
  showSellerNick: boolean;
  attrs: ListingAttrs;
};

async function apiGetRaw(path: string): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
}

async function apiPostRaw(path: string, body: unknown): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function apiGet<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await apiGetRaw(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await apiPostRaw(path, body);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function buildQuery(params: ListingsQuery) {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.world && params.world !== "todos") sp.set("world", params.world);
  if (params.shiny) sp.set("shiny", "1");
  if (params.generation && params.generation !== "todos") {
    sp.set("generation", String(params.generation));
  }
  if (params.tier && params.tier !== "todos") sp.set("tier", String(params.tier));
  if (params.element && params.element !== "todos") {
    sp.set("element", params.element);
  }
  if (params.sort) sp.set("sort", params.sort);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** GET /listings — com erro tipado pra UI. */
export async function fetchListingsResult(
  params: ListingsQuery = {},
): Promise<ApiResult<Listing[]>> {
  if (!API_URL) return okResult(mockListings, "mock");

  try {
    const res = await apiGetRaw(`/listings${buildQuery(params)}`);
    if (!res.ok) {
      return errResult(
        mockListings,
        `Falha ao carregar anúncios (${res.status}). Mostrando mocks.`,
        res.status,
        "mock",
      );
    }
    const data = (await res.json()) as Listing[] | { items: Listing[] };
    const items = Array.isArray(data) ? data : (data.items ?? []);
    return okResult(items, "api");
  } catch {
    return errResult(
      mockListings,
      "Sem conexão com a API. Mostrando mocks locais.",
      undefined,
      "mock",
    );
  }
}

/** GET /listings */
export async function fetchListings(
  params: ListingsQuery = {},
): Promise<Listing[]> {
  const result = await fetchListingsResult(params);
  return result.data;
}

/** GET /listings/:id */
export async function fetchListing(id: string): Promise<Listing | null> {
  if (!API_URL) return getMockListing(id);
  return (
    (await apiGet<Listing>(`/listings/${encodeURIComponent(id)}`)) ??
    getMockListing(id)
  );
}

/** GET /listings/:id/related */
export async function fetchRelatedListings(
  listing: Listing,
  limit = 3,
): Promise<Listing[]> {
  if (!API_URL) return getMockRelated(listing, limit);
  return getMockRelated(listing, limit);
}

/** POST /listings */
export async function createListing(
  input: CreateListingInput,
): Promise<ApiResult<Listing | null>> {
  if (!API_URL) {
    return errResult(null, "API não configurada. Salvo só na conta local.", undefined, "mock");
  }
  try {
    const res = await apiPostRaw("/listings", input);
    if (!res.ok) {
      return errResult(null, `Não deu pra publicar (${res.status}).`, res.status);
    }
    const data = (await res.json()) as Listing;
    return okResult(data, "api");
  } catch {
    return errResult(null, "Falha de rede ao publicar.");
  }
}

/** GET /me/listings — ou storage local no demo. */
export async function fetchMyListingsResult(): Promise<
  ApiResult<OwnedListing[]>
> {
  if (!API_URL) {
    const { readOwnedListings } = await import("@/lib/my-listings");
    return okResult(readOwnedListings(), "mock");
  }
  try {
    const res = await apiGetRaw("/me/listings");
    if (!res.ok) {
      return errResult([], `Não deu pra carregar seus anúncios (${res.status}).`, res.status);
    }
    const data = (await res.json()) as OwnedListing[] | { items: OwnedListing[] };
    const items = Array.isArray(data) ? data : (data.items ?? []);
    return okResult(items, "api");
  } catch {
    return errResult([], "Sem conexão ao carregar seus anúncios.");
  }
}

export function googleAuthUrl(returnTo = "/conta/perfil") {
  if (!API_URL) return null;
  const qs = new URLSearchParams({ returnTo });
  return `${API_URL}/auth/google?${qs.toString()}`;
}

export async function requestEmailCode(
  email: string,
): Promise<{ ok: boolean; demoCode?: string; error?: string }> {
  if (!API_URL) {
    return { ok: true, demoCode: "123456" };
  }
  try {
    const res = await apiPostRaw("/auth/email/request", { email });
    if (!res.ok) {
      return { ok: false, error: `Não deu pra enviar o código (${res.status}).` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Falha de rede ao pedir o código." };
  }
}

export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<AuthUser | null> {
  if (!API_URL) return null;
  return apiPost<AuthUser>("/auth/email/verify", { email, code });
}

export async function fetchMe(): Promise<AuthUser | null> {
  if (!API_URL) return null;
  return apiGet<AuthUser>("/auth/me");
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<AuthUser | null> {
  if (!API_URL) return null;
  return apiPost<AuthUser>("/auth/profile", input);
}

export function isApiConfigured() {
  return Boolean(API_URL);
}
