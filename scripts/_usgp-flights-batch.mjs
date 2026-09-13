import { execFileSync } from "child_process";
import fs from "fs";

const ORIGINS = [
  ["Atlanta", "ATL"], ["Boston", "BOS"], ["Chicago", "ORD"], ["Dallas", "DFW"],
  ["Los Angeles", "LAX"], ["Miami", "MIA"], ["Montreal", "YUL"], ["New York City", "JFK"],
  ["Philadelphia", "PHL"], ["San Francisco", "SFO"], ["Toronto", "YYZ"], ["Vancouver", "YVR"],
  ["Washington D.C.", "IAD"],
  ["Amsterdam", "AMS"], ["Barcelona", "BCN"], ["Berlin", "BER"], ["Dublin", "DUB"],
  ["London", "LHR"], ["Madrid", "MAD"], ["Manchester", "MAN"], ["Milan", "MXP"],
  ["Moscow", "SVO"], ["Munich", "MUC"], ["Paris", "CDG"], ["Rome", "FCO"],
  ["Stockholm", "ARN"], ["Zurich", "ZRH"],
  ["Bangalore", "BLR"], ["Beijing", "PEK"], ["Doha", "DOH"], ["Dubai", "DXB"],
  ["Hong Kong", "HKG"], ["Manila", "MNL"], ["Melbourne", "MEL"], ["Mumbai", "BOM"],
  ["New Delhi", "DEL"], ["Seoul", "ICN"], ["Shanghai", "PVG"], ["Singapore", "SIN"],
  ["Sydney", "SYD"], ["Tokyo", "NRT"],
  ["Buenos Aires", "EZE"], ["Mexico City", "MEX"], ["Rio de Janeiro", "GIG"], ["Sao Paulo", "GRU"],
  ["Cairo", "CAI"], ["Casablanca", "CMN"], ["Johannesburg", "JNB"], ["Nairobi", "NBO"],
];

const DEST_CITY = "Austin";
const DEST_IATA = "AUS";
const DEP = "2026-10-18";
const RET = "2026-10-30";
const OUT_DIR = "scratchpad/usgp-flights";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const alreadyDone = new Set(
  fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR).map(f => f.replace(".json", "")) : []
);

for (const [city, iata] of ORIGINS) {
  const key = iata;
  if (alreadyDone.has(key)) {
    console.log(`skip (already done): ${city}`);
    continue;
  }
  const outFile = `${OUT_DIR}/${key}.json`;
  try {
    console.log(`researching: ${city} (${iata}) -> ${DEST_CITY}`);
    execFileSync("node", ["scripts/_flight-research-tool.mjs", city, iata, DEST_CITY, DEST_IATA, DEP, RET, outFile], {
      stdio: "inherit",
      timeout: 180000,
    });
  } catch (e) {
    console.log(`FAILED: ${city} (${iata}) - ${e.message}`);
    fs.writeFileSync(outFile, JSON.stringify({ origin: city, iata, error: String(e.message) }, null, 2));
  }
}

console.log("BATCH COMPLETE");
