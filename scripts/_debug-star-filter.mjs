import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
const outFile = process.argv[3];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: [],
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
for (let i = 0; i < 15; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(500); }
await page.waitForTimeout(1500);

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
    const starLabelEl = card.querySelector('[aria-label*="star" i]');
    const starLabel = starLabelEl?.getAttribute("aria-label") ?? null;
    const starMatch = starLabel?.match(/(\d+)\s*out of\s*5\s*stars?/i);
    return {
      name,
      price,
      reviewScore: scoreMatch ? Number(scoreMatch[1]) : null,
      reviewCount: reviewCountMatch ? Number(reviewCountMatch[1].replace(/,/g, "")) : null,
      starRating: starMatch ? Number(starMatch[1]) : null,
    };
  });
});
fs.writeFileSync(outFile, JSON.stringify({ url, count: hotels.length, hotels }, null, 2));
console.log(`done: ${hotels.length} cards`);
await browser.close();
