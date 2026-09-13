const WIKI = "https://wiki.pokealliance.com";

/** Artwork oficial da wiki do PokeAlliance (PNG real). */
export function artworkUrl(imagePath: string) {
  if (imagePath.startsWith("http")) return imagePath;
  return `${WIKI}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

export function artworkFromDex(dex: number, shiny = false) {
  const n = String(dex).padStart(3, "0");
  return artworkUrl(shiny ? `/pokemon/${n}.1.png` : `/pokemon/${n}.png`);
}
