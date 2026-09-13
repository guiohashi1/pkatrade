import type { Listing } from "@/lib/listings";

export type ListingStatus = "active" | "sold" | "archived";

export type OwnedListing = Listing & {
  status: ListingStatus;
  ownerId: string;
};

const STORAGE_KEY = "pkatrade.my.listings";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readOwnedListings(): OwnedListing[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OwnedListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeOwnedListings(items: OwnedListing[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertOwnedListing(item: OwnedListing) {
  const items = readOwnedListings();
  const idx = items.findIndex((x) => x.id === item.id);
  if (idx >= 0) items[idx] = item;
  else items.unshift(item);
  writeOwnedListings(items);
  return items;
}

export function setOwnedListingStatus(id: string, status: ListingStatus) {
  const items = readOwnedListings().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  writeOwnedListings(items);
  return items;
}

export function statusLabel(status: ListingStatus) {
  if (status === "sold") return "Vendido";
  if (status === "archived") return "Arquivado";
  return "Ativo";
}
