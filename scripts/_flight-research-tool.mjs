import { chromium } from "playwright";
import fs from "fs";

// Reusable flight research tool for the planner-data-researcher skill's
// Flights methodology (2-site: Google Flights + Kayak, combined-dataset
// density-based outlier exclusion, adopted 21 Jul 2026).
//
// Usage: node scripts/_flight-research-tool.mjs <originCity> <originIata> <destCity> <destIata> <depDate> <retDate> <outFile>

const [, , originCity, originIata, destCity, destIata, depDate, retDate, outFile] = process.argv;

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

  let lastHighDensityIdx = lowIdx;
  for (let i = lowIdx; i < combined.length; i++) {
    const center = combined[i];
    const count = combined.filter((p) => Math.abs(p - center) <= 200).length;
    if (count >= 4) lastHighDensityIdx = i;
  }

  return {
    low: combined[lowIdx],
    high: combined[lastHighDensityIdx],
    excludedLow: combined.slice(0, lowIdx),
    excludedHigh: combined.slice(lastHighDensityIdx + 1),
  };
}

async function fetchGoogleFlights(browser) {
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "en-US",
  });
  const page = await context.newPage();
  try {
    const q = `Flights from ${originCity} to ${destCity} on ${depDate} through ${retDate}`;
    await page.goto(`https://www.google.com/travel/flights?hl=en-US&gl=US&curr=USD&q=${encodeURIComponent(q)}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(6000);
    try {
      await page.click("text=View more flights", { timeout: 5000 });
      await page.waitForTimeout(3000);
    } catch {}
    const bodyText = await page.evaluate(() => document.body.innerText);
    const lines = bodyText.split("\n");
    const prices = [];
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t === "1 stop" || t === "Nonstop") {
        for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
          const m = lines[j].trim().match(/^\$([\d,]+)$/);
          if (m) {
            prices.push(parseInt(m[1].replace(/,/g, ""), 10));
            break;
          }
        }
      }
    }
    await context.close();
    return { sorted: [...new Set(prices)].sort((a, b) => a - b), rawCount: prices.length };
  } catch (e) {
    await context.close();
    return { error: e.message };
  }
}

async function fetchKayak(browser) {
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "en-US",
  });
  const page = await context.newPage();
  try {
    await page.goto(`https://www.kayak.com/flights/${originIata}-${destIata}/${depDate}/${retDate}?sort=price_a&stops=1`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(10000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const prices = [...bodyText.matchAll(/\$[\d,]+/g)].map((m) => parseInt(m[0].replace(/[$,]/g, ""), 10));
    await context.close();
    return { sorted: [...new Set(prices)].sort((a, b) => a - b), rawCount: prices.length };
  } catch (e) {
    await context.close();
    return { error: e.message };
  }
}

const browser = await chromium.launch({ headless: true, args: ["--disable-http2"] });
const googleFlights = await fetchGoogleFlights(browser);
const kayak = await fetchKayak(browser);
await browser.close();

const result = { origin: originCity, googleFlights, kayak };

if (!googleFlights.error && !kayak.error) {
  const combined = [...googleFlights.sorted, ...kayak.sorted].sort((a, b) => a - b);
  const { low, high, excludedLow, excludedHigh } = densityBoundary(combined);
  const gfIn = googleFlights.sorted.filter((p) => p >= low && p <= high);
  const kyIn = kayak.sorted.filter((p) => p >= low && p <= high);
  result.combined = {
    low,
    high,
    excludedLow,
    excludedHigh,
    gfLow: gfIn.length ? Math.min(...gfIn) : null,
    gfHigh: gfIn.length ? Math.max(...gfIn) : null,
    kyLow: kyIn.length ? Math.min(...kyIn) : null,
    kyHigh: kyIn.length ? Math.max(...kyIn) : null,
  };
  if (result.combined.gfLow && result.combined.kyLow) {
    result.finalCostLow = Math.round((result.combined.gfLow + result.combined.kyLow) / 2);
    result.finalCostHigh = Math.round((result.combined.gfHigh + result.combined.kyHigh) / 2);
  }
}

fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(`done: ${originCity}`, result.finalCostLow ? `-> $${result.finalCostLow}-${result.finalCostHigh}` : "(error, see file)");
