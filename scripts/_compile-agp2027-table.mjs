import fs from "fs";
import path from "path";

const dir = "scratchpad/agp2027-flights";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.includes("retry"));

function fmtRange(sorted) {
  if (!sorted || sorted.length === 0) return "—";
  return `$${Math.min(...sorted)}–${Math.max(...sorted)}`;
}

const rows = [];
for (const f of files) {
  const origin = f.replace(".json", "").replace(/_/g, " ");
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  rows.push({ origin, data });
}

rows.sort((a, b) => a.origin.localeCompare(b.origin));

for (const { origin, data } of rows) {
  const gf = data.googleFlights || { sorted: [], rawCount: 0 };
  const ky = data.kayak || { sorted: [], rawCount: 0 };
  const gfRange = fmtRange(gf.sorted);
  const kyRange = fmtRange(ky.sorted);
  const gfN = gf.rawCount ?? gf.sorted.length;
  const kyN = ky.rawCount ?? ky.sorted.length;

  console.log(`ORIGIN: ${origin}`);
  console.log(`  GF: ${gfRange} (n=${gfN})`);
  console.log(`  KY: ${kyRange} (n=${kyN})`);
  console.log(`  finalCostLow/High: ${data.finalCostLow ?? "—"} / ${data.finalCostHigh ?? "—"}`);
  if (data.combined) {
    console.log(`  combined: low=${data.combined.low} high=${data.combined.high} exclLow=${JSON.stringify(data.combined.excludedLow)} exclHigh=${JSON.stringify(data.combined.excludedHigh)}`);
  } else {
    console.log(`  combined: NONE (missing site data)`);
  }
  console.log("");
}
