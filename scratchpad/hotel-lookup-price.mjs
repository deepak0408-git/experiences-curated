import { chromium } from "playwright";
const [, , name, checkin, checkout] = process.argv;
const params = new URLSearchParams({
  ss: name, checkin, checkout,
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
await page.waitForTimeout(2500);
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(500); }
const card = await page.evaluate(() => {
  const c = document.querySelector('[data-testid="property-card"]');
  if (!c) return null;
  const name = c.querySelector('[data-testid="title"]')?.textContent?.trim() ?? null;
  const priceEl = c.querySelector('[data-testid="price-and-discounted-price"]');
  const price = priceEl?.textContent?.trim() ?? null;
  return { name, price };
});
console.log(JSON.stringify(card));
await browser.close();
