import fs from "fs";
import path from "path";

const dir = "scratchpad";
const files = fs.readdirSync(dir).filter(f => f.startsWith("flights-") && (f.endsWith("-mexico.json") || f.endsWith("-mexico-google-only.json")));

const rows = [];

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
  const gf = data.googleFlights || { sorted: [], rawCount: 0 };
  const ky = data.kayak || { sorted: [], rawCount: 0 };
  const combined = data.combined;

  const gfRange = gf.sorted.length ? `$${Math.min(...gf.sorted)}-${Math.max(...gf.sorted)}` : "—";
  const kyRange = ky.sorted.length ? `$${Math.min(...ky.sorted)}-${Math.max(...ky.sorted)}` : "—";

  let finalLow = data.finalCostLow;
  let finalHigh = data.finalCostHigh;
  let exclusions = "";

  if (combined) {
    finalLow = finalLow ?? combined.low;
    finalHigh = finalHigh ?? combined.high;
    const exLow = combined.excludedLow?.length || 0;
    const exHigh = combined.excludedHigh?.length || 0;
    const parts = [];
    if (exLow) parts.push(`${exLow} low outlier${exLow > 1 ? "s" : ""}`);
    if (exHigh) parts.push(`${exHigh} high outlier${exHigh > 1 ? "s" : ""} (sparse tail)`);
    exclusions = parts.length ? parts.join(", ") : "none";
  } else if (gf.sorted.length === 0 && ky.sorted.length > 0) {
    exclusions = "GF returned 0 results — Kayak-only, density-boundary applied manually";
  } else if (ky.sorted.length === 0 && gf.sorted.length > 0) {
    exclusions = "Kayak returned 0/timeout — Google Flights-only (known gap)";
  }

  // Manual overrides for single-source routes handled outside the tool
  const origin = data.origin;
  if (origin === "Moscow") {
    finalLow = 2806; finalHigh = 3287;
    exclusions = "Kayak timeout (known gap for this route) — Google Flights only, all 3 points used";
  }
  if (origin === "Nairobi") {
    finalLow = 1385; finalHigh = 1499;
    exclusions = "GF returned 0 results — Kayak-only; density-boundary applied manually (1817, 2020 excluded as sparse tail)";
  }

  rows.push({
    origin,
    gfRange, gfCount: gf.rawCount,
    kyRange, kyCount: ky.rawCount,
    finalRange: (finalLow != null && finalHigh != null) ? `$${finalLow}-${finalHigh}` : "—",
    exclusions,
  });
}

rows.push({
  origin: "Mexico City",
  gfRange: "—", gfCount: 0,
  kyRange: "—", kyCount: 0,
  finalRange: "$0-0",
  exclusions: "Same-city origin — no research, $0 direct seed per standing rule",
});

rows.sort((a, b) => a.origin.localeCompare(b.origin));

console.log("| Origin | GF Range | GF n | Kayak Range | Kayak n | Proposed Final Range | Exclusions |");
console.log("|---|---|---|---|---|---|---|");
for (const r of rows) {
  console.log(`| ${r.origin} | ${r.gfRange} | ${r.gfCount} | ${r.kyRange} | ${r.kyCount} | ${r.finalRange} | ${r.exclusions} |`);
}
