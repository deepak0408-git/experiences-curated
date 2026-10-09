import fs from "fs";

// Same density-boundary algorithm as scripts/_flight-research-tool.mjs,
// applied to a SINGLE site's array when the other site genuinely returned
// zero results after 3 retries. Per planner-data-researcher skill: known,
// accepted single-source pattern (e.g. Moscow/Kayak), not a fabrication —
// the combined-dataset test degenerates to a single-dataset test when only
// one real dataset exists.

function findGaps(sorted) {
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const pct = ((sorted[i] - sorted[i - 1]) / sorted[i - 1]) * 100;
    if (pct >= 40) gaps.push({ idx: i, from: sorted[i - 1], to: sorted[i], pct: Number(pct.toFixed(1)) });
  }
  return gaps;
}

function densityBoundary(combined) {
  const gaps = findGaps(combined);
  let lowIdx = 0;
  const lowGap = gaps.find((g) => g.idx <= 3);
  if (lowGap) lowIdx = lowGap.idx;

  let denseStartIdx = -1;
  let lastHighDensityIdx = lowIdx;
  let brokeStreak = false;
  for (let i = lowIdx; i < combined.length; i++) {
    const center = combined[i];
    const count = combined.filter((p) => Math.abs(p - center) <= 200).length;
    if (count >= 4) {
      if (denseStartIdx === -1) denseStartIdx = i;
      if (brokeStreak) break;
      lastHighDensityIdx = i;
    } else if (denseStartIdx !== -1) {
      brokeStreak = true;
    }
  }
  if (denseStartIdx === -1) lastHighDensityIdx = combined.length - 1;

  return {
    low: combined[lowIdx],
    high: combined[lastHighDensityIdx],
    excludedLow: combined.slice(0, lowIdx),
    excludedHigh: combined.slice(lastHighDensityIdx + 1),
  };
}

const files = [
  { file: "scratchpad/bgt-flights/buenos_aires.json", source: "kayak" },
  { file: "scratchpad/bgt-flights/mexico_city.json", source: "kayak" },
  { file: "scratchpad/bgt-flights/moscow.json", source: "googleFlights" },
];

for (const { file, source } of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  const arr = data[source].sorted;
  if (!arr || arr.length === 0) {
    console.log(`${data.origin}: no data on ${source} either — cannot fall back, genuine gap`);
    continue;
  }
  const { low, high, excludedLow, excludedHigh } = densityBoundary(arr);
  data.singleSourceFallback = { source, low, high, excludedLow, excludedHigh, rawSortedCount: arr.length };
  data.finalCostLow = low;
  data.finalCostHigh = high;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`${data.origin}: single-source (${source}) -> $${low}-${high} (excluded ${excludedLow.length} low, ${excludedHigh.length} high)`);
}
