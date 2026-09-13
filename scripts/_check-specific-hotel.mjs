import { chromium } from "playwright";
import fs from "fs";

const [, , hotelUrl, checkin, checkout, outFile] = process.argv;

const params = new URLSearchParams({
  checkin, checkout,
  group_adults: "2", no_rooms: "1", group_children: "0",
  selected_currency: "USD", lang: "en-us",
});
const url = `${hotelUrl}?${params.toString()}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 }, locale: "en-US", timezoneId: "America/Chicago",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
await page.waitForTimeout(3000);

const bodyText = await page.evaluate(() => document.body.innerText);
fs.writeFileSync(outFile, bodyText);
console.log("saved", bodyText.length, "chars ->", outFile);
await browser.close();
