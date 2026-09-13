/**
 * Índice dos sprites de mapa exportados em public/sprites/map/.
 * Regenerar: npm run map-sprites
 *
 * Gen 1 normals (1–98): intencionalmente ausentes (lookTypes ainda não mapeados).
 * Gen 1 shinies (1–98): best-effort via lookType dex+404.
 * Normals 99–251: exportados quando lookType existe.
 */
import mapSpriteData from "@/data/map-sprites.json";

const NORMALS = new Set(mapSpriteData.normals as number[]);
const SHINIES = new Set(mapSpriteData.shinies as number[]);

export function hasMapSpriteFile(dex: number, shiny = false) {
  return shiny ? SHINIES.has(dex) : NORMALS.has(dex);
}

export function mapSpriteInventory() {
  return {
    normals: mapSpriteData.normals as number[],
    shinies: mapSpriteData.shinies as number[],
    generatedAt: mapSpriteData.generatedAt as string,
  };
}
