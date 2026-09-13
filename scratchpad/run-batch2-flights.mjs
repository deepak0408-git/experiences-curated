import { spawnSync } from "child_process";

// Batch 2 — Asia-Pacific, Latin America, Africa origin markets.
// Mexico City itself excluded (same-city, $0 direct seed, no research).
const routes = [
  ["Bangalore", "BLR"],
  ["Beijing", "PEK"],
  ["Doha", "DOH"],
  ["Dubai", "DXB"],
  ["Hong Kong", "HKG"],
  ["Manila", "MNL"],
  ["Melbourne", "MEL"],
  ["Mumbai", "BOM"],
  ["New Delhi", "DEL"],
  ["Seoul", "ICN"],
  ["Shanghai", "PVG"],
  ["Singapore", "SIN"],
  ["Sydney", "SYD"],
  ["Tokyo", "NRT"],
  ["Buenos Aires", "EZE"],
  ["Rio de Janeiro", "GIG"],
  ["Sao Paulo", "GRU"],
  ["Cairo", "CAI"],
  ["Casablanca", "CMN"],
  ["Johannesburg", "JNB"],
  ["Nairobi", "NBO"],
];

for (const [city, iata] of routes) {
  const outFile = `scratchpad/flights-${city.toLowerCase().replace(/[^a-z]/g, "-")}-mexico.json`;
  const start = Date.now();
  console.log(`\n=== ${city} (${iata}) — starting ${new Date().toISOString()} ===`);
  const result = spawnSync("node", [
    "scripts/_flight-research-tool.mjs",
    city, iata, "Mexico City", "MEX", "2026-10-25", "2026-11-06", outFile,
  ], { stdio: "inherit", timeout: 120000, killSignal: "SIGKILL" });

  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  if (result.error || result.signal) {
    console.log(`TIMEOUT/FAILED: ${city} after ${elapsed}s (signal: ${result.signal ?? "none"}, error: ${result.error?.message ?? "none"})`);
  } else {
    console.log(`(${city} took ${elapsed}s)`);
  }
}
console.log("\n=== BATCH 2 COMPLETE ===");
