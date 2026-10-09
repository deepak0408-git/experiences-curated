import fs from "fs";
import path from "path";

const dir = "scratchpad/bgt-flights";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

const rows = [];
for (const file of files) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
  const gfRange = d.googleFlights.sorted.length ? `$${Math.min(...d.googleFlights.sorted)}-${Math.max(...d.googleFlights.sorted)}` : "—";
  const kyRange = d.kayak.sorted.length ? `$${Math.min(...d.kayak.sorted)}-${Math.max(...d.kayak.sorted)}` : "—";
  const gfN = d.googleFlights.rawCount ?? 0;
  const kyN = d.kayak.rawCount ?? 0;
  let exclusions = "none";
  let singleSource = null;
  if (d.singleSourceFallback) {
    singleSource = d.singleSourceFallback.source.includes("google") ? "Google Flights only" : "Kayak only";
    const exLow = d.singleSourceFallback.excludedLow?.length ?? 0;
    const exHigh = d.singleSourceFallback.excludedHigh?.length ?? 0;
    exclusions = `single-source (${singleSource}); ${exLow} low / ${exHigh} high outliers excluded`;
  } else if (d.combined) {
    const exLow = d.combined.excludedLow?.length ?? 0;
    const exHigh = d.combined.excludedHigh?.length ?? 0;
    exclusions = (exLow === 0 && exHigh === 0) ? "none" : `${exLow} low outlier(s), ${exHigh} high outlier(s) excluded`;
  }
  rows.push({
    origin: d.origin,
    gfRange, gfN, kyRange, kyN,
    finalRange: `$${d.finalCostLow}-${d.finalCostHigh}`,
    exclusions,
    singleSource: !!singleSource,
  });
}
rows.sort((a, b) => a.origin.localeCompare(b.origin));
fs.writeFileSync("scratchpad/bgt-flights-table.json", JSON.stringify(rows, null, 2));
console.log(`Compiled ${rows.length} rows`);
console.table(rows.map(r => ({ Origin: r.origin, GF: r.gfRange, 'GF n': r.gfN, Kayak: r.kyRange, 'Kayak n': r.kyN, Final: r.finalRange, SingleSource: r.singleSource })));
