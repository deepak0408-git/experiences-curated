import { spawn } from "child_process";
import fs from "fs";

const batchFile = process.argv[2];
const outDir = process.argv[3];
const routes = fs.readFileSync(batchFile, "utf-8").trim().split("\n").map(l => l.trim().split(/\s+/));

const DEP = "2026-11-22";
const RET = "2026-12-04";
const DEST_CITY = "Doha";
const DEST_IATA = "DOH";

function runOne(originCity, originIata) {
  return new Promise((resolve) => {
    const outFile = `${outDir}/${originCity}.json`;
    const proc = spawn("node", [
      "scripts/_flight-research-tool.mjs",
      originCity, originIata, DEST_CITY, DEST_IATA, DEP, RET, outFile
    ], { stdio: "inherit" });
    proc.on("close", (code) => {
      console.log(`\n=== Done: ${originCity} (exit ${code}) ===\n`);
      resolve();
    });
    proc.on("error", (err) => {
      console.error(`Error running ${originCity}:`, err);
      resolve();
    });
  });
}

(async () => {
  for (const [city, iata] of routes) {
    console.log(`\n--- Researching ${city} (${iata}) -> Doha ---`);
    await runOne(city, iata);
  }
  console.log("BATCH COMPLETE");
})();
