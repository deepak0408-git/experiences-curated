import { chromium } from "playwright";
import fs from "fs";

// Reusable flight research tool for the planner-data-researcher skill's
// Flights methodology (2-site: Google Flights + Kayak, combined-dataset
// density-based outlier exclusion, adopted 21 Jul 2026).
//
// Fixed 14 Aug 2026 (Wimbledon 2027 flight batch) — the prior version's
// Kayak extraction grabbed dollar amounts from the FILTER SIDEBAR (Stops/
// Airports/Airlines/Alliance panels all show "$X,XXX" next to each facet —
// these are cheapest-within-category prices, not individual flight fares)
// rather than real result-card prices. Real result cards follow the
// pattern "$X,XXX" immediately followed by a line starting with "Economy"
// (Economy Basic/Cabin/etc.), confirmed against a real long-haul route
// (Tokyo-London). Also increased the wait to poll for Kayak's own
// "X of Y flights" loading-complete signal instead of a fixed timeout,
// since a fixed 10s wait was capturing the page still mid-load.
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

  // High boundary = the last index of the FIRST contiguous run where
  // density stays ≥4, starting from wherever density FIRST reaches ≥4 at
  // or after lowIdx (not necessarily lowIdx itself — a genuinely sparse
  // opening stretch before density builds up is real and expected, see
  // Chicago below). Once a real dense run has started and density then
  // drops below 4 and does not immediately recover, stop advancing —
  // don't let a later, disconnected cluster reopen the boundary.
  //
  // Fixed 14 Aug 2026 (Wimbledon 2027 batch), two real bugs found via two
  // different routes, in sequence:
  // 1. Manchester→London: the original per-point-independent scan (no
  //    memory of "are we still in the dense run") accepted an isolated
  //    4-point micro-cluster (6269/6290/6292/6445) sitting 124% above the
  //    real dense body ($152-$672) as the high boundary — technically
  //    "≥4 neighbors" in isolation, but exactly the kind of disconnected
  //    sparse-tail cluster the skill's Casablanca precedent says must be
  //    excluded WHOLESALE, "OWN internal jumps" and all.
  // 2. Chicago→London: fixing #1 by requiring density at lowIdx itself
  //    broke a DIFFERENT real, valid pattern — Chicago's own dataset has
  //    a genuinely sparse first couple of points ($1,018/$1,155, only 2
  //    neighbors each) before density climbs to a real dense stretch
  //    ($1,268-$2,135, verified: the ORIGINAL naive algorithm correctly
  //    found $2,135 here). Requiring index lowIdx itself to already be
  //    dense collapsed the whole result to a single point. The fix:
  //    advance past any sparse OPENING stretch to find where density
  //    first reaches ≥4, THEN apply the same-contiguous-run rule from
  //    there — don't conflate "must be dense from the very first index"
  //    with "must be one contiguous run once density starts."
  // A local ≥40% jump WITHIN the dense run itself is normal and must NOT
  // stop the scan (e.g. Manchester's real 173->293 step, 69%, sits inside
  // one real dense cluster) — only a sustained density break matters, not
  // any single step's size.
  let denseStartIdx = -1;
  let lastHighDensityIdx = lowIdx;
  let brokeStreak = false;
  for (let i = lowIdx; i < combined.length; i++) {
    const center = combined[i];
    const count = combined.filter((p) => Math.abs(p - center) <= 200).length;
    if (count >= 4) {
      if (denseStartIdx === -1) denseStartIdx = i; // first point where density actually starts
      if (brokeStreak) break; // density recovered only AFTER a break — new, disconnected cluster, not a continuation
      lastHighDensityIdx = i;
    } else if (denseStartIdx !== -1) {
      brokeStreak = true; // only count a "break" once the dense run has actually started
    }
  }
  // If density never once reached ≥4 anywhere (a genuinely sparse whole
  // dataset), fall back to the full low..high span rather than collapsing
  // to a single point — an honest "no real cluster found" outcome, not a
  // broken Infinity/NaN result.
  if (denseStartIdx === -1) lastHighDensityIdx = combined.length - 1;

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
    if (bodyText.includes("too far in the future")) {
      await context.close();
      return { error: "date too far in the future", sorted: [], rawCount: 0 };
    }
    const lines = bodyText.split("\n");
    const prices = [];
    // "Nonstop" or "1 stop" marks a real flight card; a "$X,XXX" line
    // followed by "round trip" within the next few lines is that card's
    // price. ≤1 stop only — "2 stops"/"3 stops" lines are never matched.
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t === "1 stop" || t === "Nonstop") {
        for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
          const m = lines[j].trim().match(/^\$([\d,]+)$/);
          if (m && lines[j + 1] && lines[j + 1].trim() === "round trip") {
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
    return { error: e.message, sorted: [], rawCount: 0 };
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
    try {
      await page.waitForFunction(() => {
        const body = document.body.innerText;
        return /\d+ of \d+ flights/.test(body) && !/\d+% complete/.test(body);
      }, { timeout: 25000 });
    } catch {
      // proceed anyway with whatever loaded — partial results still real
    }
    await page.waitForTimeout(3000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const lines = bodyText.split("\n");
    const prices = [];
    // Real result-card price: a "$X,XXX" line immediately followed by a
    // line starting with "Economy" (Economy Basic/Cabin/etc., then
    // "Select"). This deliberately excludes the filter sidebar's
    // "$X,XXX" figures next to Stops/Airports/Airlines/Alliance facets,
    // which are cheapest-within-category prices, not individual fares —
    // confirmed via real page inspection, 14 Aug 2026. sort=price_a
    // already orders results ascending; stops=1 already caps at ≤1 stop.
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].trim().match(/^\$([\d,]+)$/);
      if (m && lines[i + 1] && lines[i + 1].trim().startsWith("Economy")) {
        prices.push(parseInt(m[1].replace(/,/g, ""), 10));
      }
    }
    await context.close();
    return { sorted: [...new Set(prices)].sort((a, b) => a - b), rawCount: prices.length };
  } catch (e) {
    await context.close();
    return { error: e.message, sorted: [], rawCount: 0 };
  }
}

// Two separate browser launches (not one shared instance) — found 14 Aug
// 2026 (Wimbledon 2027 batch) that Google Flights fails intermittently
// ("Oops, something went wrong" / "No results returned") when run back-to-
// back with other fetches, confirmed as real rate-limiting (not a shared-
// context bug, not route-specific — the same route fails then succeeds
// across repeated isolated attempts) since spacing requests out with a
// short cooldown reliably restores success. Google Flights is meaningfully
// flakier under this pattern than Kayak, which has been 100% reliable
// across the same batch. Built-in retry-with-backoff below handles this
// automatically — do not treat one failure as final without retrying.
const gfBrowser = await chromium.launch({ headless: true, args: ["--disable-http2"] });
let googleFlights = await fetchGoogleFlights(gfBrowser);
for (let attempt = 1; googleFlights.error || googleFlights.sorted.length === 0; attempt++) {
  if (attempt > 3) break; // give up after 3 retries (4 total attempts), let the route fall back to Kayak-only
  await new Promise((r) => setTimeout(r, 5000 * attempt)); // 5s, 10s, 15s backoff
  googleFlights = await fetchGoogleFlights(gfBrowser);
}
await gfBrowser.close();

// Kayak gets the same retry treatment — confirmed 14 Aug 2026 it can also
// fail intermittently (Johannesburg route: GF worked, Kayak returned zero),
// not just Google Flights. Same backoff pattern.
const kyBrowser = await chromium.launch({ headless: true, args: ["--disable-http2"] });
let kayak = await fetchKayak(kyBrowser);
for (let attempt = 1; kayak.error || kayak.sorted.length === 0; attempt++) {
  if (attempt > 3) break;
  await new Promise((r) => setTimeout(r, 5000 * attempt));
  kayak = await fetchKayak(kyBrowser);
}
await kyBrowser.close();

const result = { origin: originCity, googleFlights, kayak };

if (!googleFlights.error && !kayak.error && googleFlights.sorted.length && kayak.sorted.length) {
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
console.log(`done: ${originCity}`, result.finalCostLow ? `-> $${result.finalCostLow}-${result.finalCostHigh}` : "(error/incomplete, see file)");
