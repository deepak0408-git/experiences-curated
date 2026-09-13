import { chromium } from "playwright";
const [, , url] = process.argv;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.waitForTimeout(2000);
const text = await page.evaluate(() => document.body.innerText);
console.log(text.slice(0, 6000));
await browser.close();
