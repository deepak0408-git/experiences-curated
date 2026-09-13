import { spawnSync } from "child_process";

// Batch 1 continuation — Los Angeles onward. Chicago ($437-1064), Dallas
// ($338-1137), Atlanta ($439-1044), Boston ($630-1257) already completed
// in earlier runs. Using spawnSync with an explicit killSignal + shorter
// per-route timeout (120s) after LA hung for over an hour under
// execFileSync's timeout, which did not reliably kill the Playwright
// child process tree.
const routes = [
  ["Los Angeles", "LAX"],
  ["Miami", "MIA"],
  ["Montreal", "YUL"],
  ["New York City", "JFK"],
  ["Philadelphia", "PHL"],
  ["San Francisco", "SFO"],
  ["Toronto", "YYZ"],
  ["Vancouver", "YVR"],
  ["Washington D.C.", "IAD"],
  ["Amsterdam", "AMS"],
  ["Barcelona", "BCN"],
  ["Berlin", "BER"],
  ["Dublin", "DUB"],
  ["London", "LHR"],
  ["Madrid", "MAD"],
  ["Manchester", "MAN"],
  ["Milan", "MXP"],
  ["Moscow", "SVO"],
  ["Munich", "MUC"],
  ["Paris", "CDG"],
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
console.log("\n=== BATCH 1 COMPLETE ===");
