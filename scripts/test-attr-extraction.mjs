import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});
await page.goto("https://tickets.formula1.com/en/f1-3277-hungary", { waitUntil: "networkidle", timeout: 30000 });
try {
  await page.locator("#onetrust-accept-btn-handler").click({ timeout: 5000 });
} catch {}
await page.waitForTimeout(1500);

const count = await page.evaluate(() => document.querySelectorAll("[grandstand-product]").length);
console.log("count via querySelectorAll:", count);

const raw = await page.evaluate(() => {
  const el = document.querySelector("[grandstand-product]");
  return el ? el.getAttribute("grandstand-product") : "NOT FOUND";
});
console.log("raw attribute value:", raw);

await browser.close();
