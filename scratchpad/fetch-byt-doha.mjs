import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

const url = "https://www.budgetyourtrip.com/qatar/doha";
const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
console.log(url, "->", resp.status());
const text = await page.evaluate(() => document.body.innerText);
fs.writeFileSync("scratchpad/byt-doha-raw.txt", text);
console.log("saved body text, length:", text.length);
await browser.close();
