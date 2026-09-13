/**
 * Scan catalog artwork coverage: local map → Let's Go → wiki → home.
 * Writes a report under .tmp-sprite-test/sprite-gaps.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/catalog.json"), "utf8"),
).pokemon;
const mapDir = path.join(ROOT, "public/sprites/map");

const LETS_GO_SLUG_BY_DEX = {
  29: "nidoran-f",
  32: "nidoran-m",
  83: "farfetchd",
  122: "mr-mime",
  808: "meltan",
  809: "melmetal",
};

function slug(dex, name) {
  if (LETS_GO_SLUG_BY_DEX[dex]) return LETS_GO_SLUG_BY_DEX[dex];
  return String(name)
    .replace(/^Shiny\s+/i, "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-");
}

function lookTypeForDex(dex, shiny) {
  if (dex >= 1 && dex <= 98) return shiny ? dex + 404 : null;
  if (shiny) return null;
  if (dex >= 99 && dex <= 151) return dex - 98;
  if (dex >= 152 && dex <= 201) return dex - 4;
  if (dex >= 202 && dex <= 251) return dex + 22;
  return null;
}

function mapPath(dex, shiny) {
  if (lookTypeForDex(dex, shiny) == null) return null;
  const file = shiny
    ? `${String(dex).padStart(3, "0")}.1.png`
    : `${String(dex).padStart(3, "0")}.png`;
  const full = path.join(mapDir, file);
  return fs.existsSync(full) ? `/sprites/map/${file}` : null;
}

function canLetsGo(dex) {
  return (dex >= 1 && dex <= 151) || dex === 808 || dex === 809;
}

function base(p) {
  return {
    dex: p.dex,
    name: p.name,
    shiny: Boolean(p.shiny),
    image: p.image,
  };
}

async function headOk(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function poolMap(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return out;
}

async function main() {
  const unique = [];
  const seen = new Set();
  for (const p of catalog) {
    const key = `${p.dex}:${p.shiny ? 1 : 0}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }

  console.log(`Scanning ${unique.length} unique dex/variant entries…`);

  const results = await poolMap(unique, 16, async (p) => {
    const shiny = Boolean(p.shiny);
    const map = mapPath(p.dex, shiny);
    if (map) {
      return { ...base(p), source: "map", url: map, ok: true };
    }

    const s = slug(p.dex, p.name);
    if (!shiny && canLetsGo(p.dex)) {
      const lg = `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${s}.png`;
      if (await headOk(lg)) {
        return { ...base(p), source: "lets-go", url: lg, ok: true };
      }
    }

    const imagePath = p.image || `/pokemon/${String(p.dex).padStart(3, "0")}${shiny ? ".1" : ""}.png`;
    const wiki = `https://wiki.pokealliance.com${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
    if (await headOk(wiki)) {
      return { ...base(p), source: "wiki", url: wiki, ok: true };
    }

    const homeVariant = shiny ? "shiny" : "normal";
    const home = `https://img.pokemondb.net/sprites/home/${homeVariant}/${s}.png`;
    if (await headOk(home)) {
      return {
        ...base(p),
        source: "home-available",
        url: home,
        ok: false,
        wikiBroken: true,
      };
    }

    return {
      ...base(p),
      source: "none",
      url: null,
      ok: false,
      wikiBroken: true,
      triedHome: home,
    };
  });

  const gaps = results.filter((r) => !r.ok);
  const bySource = results.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + 1;
    return acc;
  }, {});

  const report = {
    scannedAt: new Date().toISOString(),
    total: results.length,
    bySource,
    gapCount: gaps.length,
    gaps: gaps.sort(
      (a, b) => a.dex - b.dex || Number(a.shiny) - Number(b.shiny),
    ),
  };

  const out = path.join(ROOT, ".tmp-sprite-test/sprite-gaps.json");
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(bySource, null, 2));
  console.log(`gaps: ${gaps.length}`);
  console.log(
    "sample gaps:",
    gaps
      .slice(0, 25)
      .map((g) => `${g.dex}${g.shiny ? "s" : ""} ${g.name} [${g.source}]`)
      .join("\n"),
  );
  console.log("wrote", out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
