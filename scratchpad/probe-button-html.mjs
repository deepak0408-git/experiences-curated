import { chromium } from "playwright";

const params = new URLSearchParams({
  ss: "Mexico City", checkin: "2026-10-28", checkout: "2026-11-04",
  group_adults: "2", no_rooms: "1", group_children: "0",
  order: "review_score_and_price", nflt: "review_score=70;ht_id=204",
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
for (let i = 0; i < 15; i++) { await page.mouse.wheel(0, 3000); await page.waitForTimeout(500); }

const html = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const found = btns.find(b => /load more|show more/i.test(b.textContent || ""));
  return found ? found.outerHTML.slice(0, 500) : "NOT FOUND on second pass";
});
console.log(html);
await browser.close();
