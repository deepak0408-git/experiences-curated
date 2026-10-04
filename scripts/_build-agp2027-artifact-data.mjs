import fs from "fs";
import path from "path";

const dir = "scratchpad/agp2027-flights";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.includes("retry"));

function fmtRange(sorted) {
  if (!sorted || sorted.length === 0) return "—";
  return `$${Math.min(...sorted).toLocaleString()}–${Math.max(...sorted).toLocaleString()}`;
}

const MANUAL = {
  "Moscow": {
    finalLow: 1372, finalHigh: 2419,
    exclusions: "Single-source (Kayak returned 0 results — known recurring gap for Moscow/SVO routes, confirmed via retry). GF raw range used directly, no outliers (largest step 28%, below the 40% threshold).",
  },
  "Buenos Aires": {
    finalLow: 1761, finalHigh: 3220,
    exclusions: "Single-source (Google Flights returned 0 results across 2 attempts). Kayak fetched twice (live fares varied run-to-run: $2,339–$9,715 then $1,761–$1,895) — combined and de-duplicated; 1 high outlier excluded ($9,715, a 202% jump). Small combined sample (9 points) — flagged as lower-confidence.",
  },
  "Rio de Janeiro": {
    finalLow: 2144, finalHigh: 2903,
    exclusions: "Single-source (Google Flights returned 0 results, same pattern as Buenos Aires). Kayak's 15-point sample is dense and continuous — no outliers (largest step 8.6%).",
  },
  "Mexico City": {
    finalLow: 1684, finalHigh: 2243,
    exclusions: "Google Flights returned only 1 real ≤1-stop economy fare ($2,560, confirmed on 2 separate fetches) which fell above Kayak's dense 25-point cluster and was excluded as a high outlier — final range is Kayak-dominant.",
  },
};

const rows = [];
for (const f of files) {
  const origin = f.replace(".json", "").replace(/_/g, " ");
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  rows.push({ origin, data });
}
rows.sort((a, b) => a.origin.localeCompare(b.origin));

const out = rows.map(({ origin, data }) => {
  const gf = data.googleFlights || { sorted: [], rawCount: 0 };
  const ky = data.kayak || { sorted: [], rawCount: 0 };
  const gfRange = fmtRange(gf.sorted);
  const kyRange = fmtRange(ky.sorted);
  const gfN = gf.rawCount ?? gf.sorted.length;
  const kyN = ky.rawCount ?? ky.sorted.length;

  let finalLow, finalHigh, exclusions;

  if (MANUAL[origin]) {
    finalLow = MANUAL[origin].finalLow;
    finalHigh = MANUAL[origin].finalHigh;
    exclusions = MANUAL[origin].exclusions;
  } else {
    finalLow = data.finalCostLow;
    finalHigh = data.finalCostHigh;
    const nLow = data.combined?.excludedLow?.length || 0;
    const nHigh = data.combined?.excludedHigh?.length || 0;
    if (nLow === 0 && nHigh === 0) {
      exclusions = "none — full continuous dense run";
    } else {
      const parts = [];
      if (nLow > 0) parts.push(`${nLow} low outlier${nLow > 1 ? "s" : ""}`);
      if (nHigh > 0) {
        const hVals = data.combined.excludedHigh;
        parts.push(`${nHigh} high outlier${nHigh > 1 ? "s" : ""} (sparse tail above $${data.combined.high.toLocaleString()}, up to $${Math.max(...hVals).toLocaleString()})`);
      }
      exclusions = parts.join("; ");
    }
  }

  return {
    origin,
    gfRange, gfN,
    kyRange, kyN,
    finalRange: finalLow ? `$${finalLow.toLocaleString()}–${finalHigh.toLocaleString()}` : "—",
    exclusions,
    singleSource: !!MANUAL[origin],
  };
});

fs.writeFileSync("scratchpad/agp2027-flights/table-data.json", JSON.stringify(out, null, 2));
console.log("wrote", out.length, "rows");
