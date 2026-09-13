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
for (let i = 0; i < 25; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(500); }
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const resultsHeader = document.querySelector('[data-testid="results-title"], h1')?.textContent?.trim();
  const nextBtn = document.querySelector('[aria-label*="Next" i], button[aria-label*="page" i]');
  const pagination = document.querySelector('[data-testid="pagination"]');
  const loadMoreBtn = Array.from(document.querySelectorAll('button')).find(b => /load more/i.test(b.textContent || ''));
  return {
    resultsHeader,
    hasNextButton: !!nextBtn,
    nextButtonHtml: nextBtn?.outerHTML?.slice(0, 300) ?? null,
    paginationHtml: pagination?.outerHTML?.slice(0, 1000) ?? null,
    hasLoadMoreButton: !!loadMoreBtn,
    loadMoreButtonText: loadMoreBtn?.textContent?.trim() ?? null,
  };
});
fs.writeFileSync(process.argv[3], JSON.stringify(info, null, 2));
console.log("done");
await browser.close();
