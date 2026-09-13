import fs from "fs";
import path from "path";

const c = fs.readFileSync(path.join(process.env.TEMP, "pka-wiki.js"), "utf8");

const words = [
  "Leftovers",
  "Choice Band",
  "Life Orb",
  "Focus Sash",
  "Assault Vest",
  "Lucky Egg",
  "Amulet Coin",
  "Black Belt",
  "Charcoal",
  "Miracle Seed",
  "Soft Sand",
  "Mystic Water",
  "helds",
  "Boost",
  "Addon",
  "treino",
  "Treinamento",
  "Star",
  "Mega",
];
for (const w of words) console.log((c.includes(w) ? "Y" : "N"), w);

const routes = [...c.matchAll(/"(\/sistemas\/[^"]+)"/g)].map((m) => m[1]);
console.log("ROUTES\n" + [...new Set(routes)].sort().join("\n"));

const md = [...c.matchAll(/[a-zA-Z0-9_./-]+\.md/g)].map((m) => m[0]);
console.log("MD", [...new Set(md)].slice(0, 50));

const files = [...c.matchAll(/["'](\/[a-zA-Z0-9_./-]+\.(?:json|md|yml|tsx?))["']/g)].map(
  (m) => m[1],
);
console.log("FILES", [...new Set(files)].slice(0, 50));

const chunks = [...c.matchAll(/["']([^"']*held[^"']*)["']/gi)].map((m) => m[1]);
console.log(
  "HELD STR",
  [...new Set(chunks)].filter((s) => s.length < 80).slice(0, 40),
);
