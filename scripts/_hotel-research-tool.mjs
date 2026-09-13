import { chromium } from "playwright";
import fs from "fs";

// Reusable Booking.com hotel-sample research tool for the
// planner-data-researcher skill's Hotels methodology (§2).
// Search params per skill spec: order=review_score_and_price sort,
// nflt=review_score=70;ht_id=204 (>=50 real reviews via review_score
// bucket + Hotels-only property type), 7-night window.
//
// Usage: node scripts/_hotel-research-tool.mjs <city> <checkin YYYY-MM-DD> <checkout YYYY-MM-DD> <outFile>

const [, , city, checkin, checkout, outFile, offset] = process.argv;

const params = new URLSearchParams({
  ss: city,
  checkin,
  checkout,
  group_adults: "2",
  no_rooms: "1",
  group_children: "0",
  order: "review_score_and_price",
  nflt: "review_score=70;ht_id=204",
  // Force English UI + USD pricing explicitly — Booking.com otherwise
  // serves locale/currency based on the request's apparent geolocation
  // (confirmed: an unpinned request rendered in Hindi with INR prices,
  // same geolocation-based-response issue documented for Google Hotels
  // in the planner-data-researcher skill).
  selected_currency: "USD",
  lang: "en-us",
  ...(offset ? { offset } : {}),
});

const url = `https://www.booking.com/searchresults.html?${params.toString()}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  timezoneId: "America/New_York",
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: [],
});
const page = await context.newPage();

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

// Dismiss cookie banner if present
try {
  await page.click('#onetrust-accept-btn-handler', { timeout: 5000 });
} catch {}
try {
  await page.click('[aria-label="Dismiss sign in information."]', { timeout: 3000 });
} catch {}

// Scroll to load more results (Booking.com lazy-loads on scroll) — keep
// scrolling until the card count stabilizes across 3 consecutive checks,
// rather than a fixed iteration count, since a fixed count under-loads on
// some searches.
let lastCount = -1;
let stableRounds = 0;
for (let i = 0; i < 40 && stableRounds < 3; i++) {
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(500);
  const count = await page.evaluate(() => document.querySelectorAll('[data-testid="property-card"]').length);
  if (count === lastCount) stableRounds++;
  else stableRounds = 0;
  lastCount = count;
}

await page.waitForTimeout(2000);

const hotels = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-testid="property-card"]');
  return Array.from(cards).map((card) => {
    const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() ?? null;
    const priceEl = card.querySelector('[data-testid="price-and-discounted-price"]');
    const price = priceEl?.textContent?.trim() ?? null;
    const scoreEl = card.querySelector('[data-testid="review-score"]');
    const scoreText = scoreEl?.textContent?.trim() ?? null;
    // scoreText looks like "Scored 8.3 8.3Very Good 3,632 reviews" — parse
    // the real numeric score and review count out of it rather than
    // treating the whole blob as opaque.
    const scoreMatch = scoreText?.match(/Scored\s+([\d.]+)/i);
    const reviewCountMatch = scoreText?.match(/([\d,]+)\s+reviews?/i);
    const reviewScore = scoreMatch ? Number(scoreMatch[1]) : null;
    const reviewCount = reviewCountMatch ? Number(reviewCountMatch[1].replace(/,/g, "")) : null;
    // Real star rating lives in an aria-label like "Property rating: 4 out
    // of 5 stars" on an element inside [data-testid="rating-stars"] or
    // [data-testid="quality-rating"] — confirmed via direct debug fetch,
    // 26 Aug 2026. Do not count child <span>/<svg> elements as a stand-in
    // for star count (each star icon renders as 2 stacked SVGs, producing
    // a bogus ~8 for a real 4-star property).
    const starLabelEl = card.querySelector('[aria-label*="star" i]');
    const starLabel = starLabelEl?.getAttribute("aria-label") ?? null;
    const starMatch = starLabel?.match(/(\d+)\s*out of\s*5\s*stars?/i);
    const starRating = starMatch ? Number(starMatch[1]) : null;
    const addressEl = card.querySelector('[data-testid="address"]');
    const address = addressEl?.textContent?.trim() ?? null;
    return { name, price, reviewScore, reviewCount, starRating, address };
  });
});

// Skill §2 step 3: filter to >=50 real reviews. The review_score=70 URL
// filter is a score-bucket filter (Booking's own "Good: 7+" tier), NOT a
// review-count filter — confirmed 26 Aug 2026 when page 2 of a Paris search
// returned hotels with reviewCount 1 and 2 despite this filter being
// active. Client-side filtering is required.
const qualifying = hotels.filter((h) => h.reviewCount != null && h.reviewCount >= 50);
const rejected = hotels.filter((h) => h.reviewCount == null || h.reviewCount < 50);

const result = {
  url,
  checkin,
  checkout,
  rawHotelCount: hotels.length,
  qualifyingHotelCount: qualifying.length,
  hotels: qualifying,
  rejectedForLowReviewCount: rejected,
};
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

console.log(`done: ${city} -> ${hotels.length} raw cards, ${qualifying.length} qualify (>=50 reviews)`);
await browser.close();
