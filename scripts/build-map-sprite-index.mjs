#!/usr/bin/env node
/**
 * Lista public/sprites/map/*.png → data/map-sprites.json
 * Uso: node scripts/build-map-sprite-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "sprites", "map");
const out = path.join(root, "data", "map-sprites.json");

const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith(".png"))
  : [];

const normals = [];
const shinies = [];

for (const file of files.sort()) {
  const m = file.match(/^(\d{3})(\.1)?\.png$/);
  if (!m) continue;
  const dex = Number(m[1]);
  if (m[2]) shinies.push(dex);
  else normals.push(dex);
}

const payload = {
  generatedAt: new Date().toISOString(),
  normals,
  shinies,
  notes: [
    "Normals 1–98 ausentes de propósito (lookType do jogo ainda não mapeado).",
    "Shinies 1–98: best-effort (dex+404).",
    "Normals 99–251: exportados quando lookType existe.",
  ],
};

fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${out} (${normals.length} normals, ${shinies.length} shinies)`,
);
