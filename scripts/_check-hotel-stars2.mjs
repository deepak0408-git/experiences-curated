import { chromium } from "playwright";
const [, , hotelUrl, checkin, checkout] = process.argv;
const params = new URLSearchParams({ checkin, checkout, group_adults: "2", no_rooms: "1", group_children: "0", selected_currency: "USD", lang: "en-us" });
const url = `${hotelUrl}?${params.toString()}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
await page.waitForTimeout(2000);
const stars = await page.evaluate(() => {
  const els = document.querySelectorAll('[aria-label*="star" i], [aria-label*="out of 5" i]');
  return Array.from(els).slice(0,5).map(e => e.getAttribute("aria-label"));
});
console.log(JSON.stringify(stars, null, 2));
await browser.close();
