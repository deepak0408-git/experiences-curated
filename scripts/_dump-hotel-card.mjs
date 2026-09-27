import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(500); }
await page.waitForTimeout(1500);
const html = await page.evaluate(() => {
  const card = document.querySelector('[data-testid="property-card"]');
  return card ? card.outerHTML : "NO CARD FOUND";
});
fs.writeFileSync(process.argv[3], html);
console.log("done, length:", html.length);
await browser.close();
