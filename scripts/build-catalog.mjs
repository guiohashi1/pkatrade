import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const raw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/wiki-pokemon.json"), "utf8"),
);

const catalog = raw.pokemon.map((p) => {
  const shiny = p.variant === "shiny";
  const baseName = shiny
    ? String(p.name).replace(/^Shiny\s+/i, "")
    : String(p.name);

  return {
    id: p.path,
    dex: Number(p.number),
    number: String(p.number).padStart(3, "0"),
    name: baseName,
    displayName: shiny ? `Shiny ${baseName}` : baseName,
    generation: Number(p.generation),
    tier: p.displayTier ?? p.tier,
    level: p.level,
    role: p.role || null,
    shiny,
    image: p.image,
    elements: (p.elements || []).map((e) => e.name),
  };
});

const out = {
  source: "https://wiki.pokealliance.com/api/pokemon",
  wiki: "https://wiki.pokealliance.com/pokemon",
  count: catalog.length,
  generatedAt: new Date().toISOString(),
  pokemon: catalog,
};

fs.writeFileSync(
  path.join(__dirname, "../data/catalog.json"),
  JSON.stringify(out, null, 2),
);

console.log(
  `wrote ${catalog.length} entries (${catalog.filter((p) => p.shiny).length} shiny)`,
);
console.log(JSON.stringify(catalog.filter((p) => p.dex === 1), null, 2));

const check = [94, 6, 448, 150, 130, 445, 257, 635, 212, 282, 248, 778, 149, 901, 903, 700, 376, 151, 461, 373, 25];
for (const d of check) {
  const n = catalog.find((p) => p.dex === d && !p.shiny);
  const s = catalog.find((p) => p.dex === d && p.shiny);
  console.log(`#${d} normal=${n ? n.name : "MISSING"} shiny=${s ? s.name : "MISSING"}`);
}
