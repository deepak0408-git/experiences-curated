import { chromium } from "playwright";

const [, , name, checkin, checkout] = process.argv;

const params = new URLSearchParams({
  ss: name,
  checkin, checkout,
  group_adults: "2", no_rooms: "1", group_children: "0",
  selected_currency: "USD", lang: "en-us",
});
const url = `https://www.booking.com/searchresults.html?${params.toString()}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 }, locale: "en-US",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 3000); await page.waitForTimeout(400); }

const hotels = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-testid="property-card"]');
  return Array.from(cards).slice(0, 5).map((card) => {
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
      name, price,
      reviewScore: scoreMatch ? Number(scoreMatch[1]) : null,
      reviewCount: reviewCountMatch ? Number(reviewCountMatch[1].replace(/,/g,"")) : null,
      starRating: starMatch ? Number(starMatch[1]) : null,
    };
  });
});
console.log(JSON.stringify(hotels, null, 2));
await browser.close();
