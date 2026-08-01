import { chromium } from "playwright";

const url = "https://www.usopen.org/en_US/tickets/index.html";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
} catch (e) {
  console.log("goto error:", e.message);
}
await page.waitForTimeout(4000);

const title = await page.title();
console.log("Title:", title);

const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
console.log("Body text preview:", bodyText);

const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a")).map((a) => a.href).filter((h) => h && !h.includes("assets"))
);
console.log("Links:", [...new Set(links)].slice(0, 30));

await browser.close();
