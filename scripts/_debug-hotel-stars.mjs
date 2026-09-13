import { chromium } from "playwright";
import fs from "fs";

const rawUrl = process.argv[2];
const u = new URL(rawUrl);
u.searchParams.set("selected_currency", "USD");
u.searchParams.set("lang", "en-us");
const url = u.toString();

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
for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(500); }
await page.waitForTimeout(1500);

const debugInfo = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-testid="property-card"]');
  return Array.from(cards).slice(0, 5).map((card) => {
    const name = card.querySelector('[data-testid="title"]')?.textContent?.trim();
    const ratingEl = card.querySelector('[data-testid="rating-stars"]');
    const qualityEl = card.querySelector('[data-testid="quality-rating"]');
    const ariaLabels = Array.from(card.querySelectorAll('[aria-label]'))
      .map((el) => el.getAttribute("aria-label"))
      .filter((l) => l && /star/i.test(l));
    const priceEl = card.querySelector('[data-testid="price-and-discounted-price"]');
    return {
      name,
      ratingElHtml: ratingEl?.outerHTML ?? null,
      qualityElHtml: qualityEl?.outerHTML ?? null,
      starAriaLabels: ariaLabels,
      price: priceEl?.textContent?.trim() ?? null,
    };
  });
});
fs.writeFileSync(process.argv[3], JSON.stringify(debugInfo, null, 2));
console.log("done");
await browser.close();
