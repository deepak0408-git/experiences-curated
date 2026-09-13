import { spawnSync } from "child_process";

const routes = [
  ["Rome", "FCO"],
  ["Stockholm", "ARN"],
  ["Zurich", "ZRH"],
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
console.log("\n=== BATCH 3 COMPLETE ===");
