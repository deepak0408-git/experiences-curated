import { chromium } from "playwright";
import fs from "fs";

const [, , city, checkin, checkout, outFile, minQualifying] = process.argv;
const targetQualifying = minQualifying ? Number(minQualifying) : 25;

const params = new URLSearchParams({
  ss: city,
  checkin,
  checkout,
  group_adults: "2",
  no_rooms: "1",
  group_children: "0",
  order: "review_score_and_price",
  nflt: "review_score=70;ht_id=204",
  selected_currency: "USD",
  lang: "en-us",
});
const url = `https://www.booking.com/searchresults.html?${params.toString()}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  timezoneId: "America/New_York",
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: [],
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
try { await page.click('[aria-label="Dismiss sign in information."]', { timeout: 3000 }); } catch {}

async function extractAndCountQualifying() {
  const hotels = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="property-card"]');
    return Array.from(cards).map((card) => {
      const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() ?? null;
      const priceEl = card.querySelector('[data-testid="price-and-discounted-price"]');
      const price = priceEl?.textContent?.trim() ?? null;
      const scoreEl = card.querySelector('[data-testid="review-score"]');
      const scoreText = scoreEl?.textContent?.trim() ?? null;
      const scoreMatch = scoreText?.match(/Scored\s+([\d.]+)/i);
      const reviewCountMatch = scoreText?.match(/([\d,]+)\s+reviews?/i);
      const reviewScore = scoreMatch ? Number(scoreMatch[1]) : null;
      const reviewCount = reviewCountMatch ? Number(reviewCountMatch[1].replace(/,/g, "")) : null;
      const starLabelEl = card.querySelector('[aria-label*="star" i]');
      const starLabel = starLabelEl?.getAttribute("aria-label") ?? null;
      const starMatch = starLabel?.match(/(\d+)\s*out of\s*5\s*stars?/i);
      const starRating = starMatch ? Number(starMatch[1]) : null;
      const addressEl = card.querySelector('[data-testid="address"]');
      const address = addressEl?.textContent?.trim() ?? null;
      return { name, price, reviewScore, reviewCount, starRating, address };
    });
  });
  return hotels;
}

for (let i = 0; i < 15; i++) {
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(500);
}

// Click "Load more results" repeatedly until target qualifying count reached or button gone
let clicks = 0;
while (clicks < 15) {
  const hotels = await extractAndCountQualifying();
  const qualifying = hotels.filter((h) => h.reviewCount != null && h.reviewCount >= 50);
  console.log(`round ${clicks}: ${hotels.length} raw, ${qualifying.length} qualifying`);
  if (qualifying.length >= targetQualifying) break;

  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => /load more|show more/i.test(b.textContent || ""));
    if (btn) { btn.scrollIntoView(); btn.click(); return true; }
    return false;
  });
  if (!clicked) { console.log("no load-more button found, stopping"); break; }
  clicks++;
  await page.waitForTimeout(2500);

  for (let i = 0; i < 15; i++) {
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(500);
  }
}

const hotels = await extractAndCountQualifying();
const qualifying = hotels.filter((h) => h.reviewCount != null && h.reviewCount >= 50);
const rejected = hotels.filter((h) => h.reviewCount == null || h.reviewCount < 50);

const result = {
  url, checkin, checkout,
  rawHotelCount: hotels.length,
  qualifyingHotelCount: qualifying.length,
  hotels: qualifying,
  rejectedForLowReviewCount: rejected,
};
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(`done: ${city} -> ${hotels.length} raw cards, ${qualifying.length} qualify (>=50 reviews)`);
await browser.close();
