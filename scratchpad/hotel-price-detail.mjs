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
await page.waitForTimeout(3000);
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(600); }
// grab ALL cards' name+price, in case first result isn't the one we want or price loads late
const cards = await page.evaluate(() => {
  const cs = document.querySelectorAll('[data-testid="property-card"]');
  return Array.from(cs).slice(0,3).map(c => ({
    name: c.querySelector('[data-testid="title"]')?.textContent?.trim() ?? null,
    price: c.querySelector('[data-testid="price-and-discounted-price"]')?.textContent?.trim() ?? null,
    fullText: c.textContent.slice(0, 300),
  }));
});
console.log(JSON.stringify(cards, null, 2));
await browser.close();
