import { chromium } from "playwright";
import fs from "fs";

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
const url = "https://www.booking.com/searchresults.html?ss=Paris%2C+France&checkin=2027-05-21&checkout=2027-05-28&group_adults=2&no_rooms=1&group_children=0&nflt=ht_id%3D204&selected_currency=USD&lang=en-us";
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
await page.waitForTimeout(2000);

await page.click('#\\:r3i\\:').catch(async () => {
  // fallback: find by name attribute
  await page.locator('input[name="class=2"]').click();
});
await page.waitForTimeout(3000);
await page.waitForLoadState('networkidle').catch(() => {});
await page.waitForTimeout(2000);

const newUrl = page.url();
const hotels = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-testid="property-card"]');
  return Array.from(cards).map((card) => {
    const name = card.querySelector('[data-testid="title"]')?.textContent?.trim() ?? null;
    const starLabelEl = card.querySelector('[aria-label*="star" i]');
    const starLabel = starLabelEl?.getAttribute("aria-label") ?? null;
    return { name, starLabel };
  });
});
fs.writeFileSync(process.argv[2], JSON.stringify({ newUrl, count: hotels.length, hotels }, null, 2));
console.log('done, url after click:', newUrl);
await browser.close();
