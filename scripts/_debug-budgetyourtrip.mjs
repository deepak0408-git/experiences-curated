import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
const outFile = process.argv[3];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(2000);

const text = await page.evaluate(() => document.body.innerText);
fs.writeFileSync(outFile, text);
console.log("done, length:", text.length);
await browser.close();
