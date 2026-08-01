import { chromium } from "playwright";

const url = "https://www.usopen.org/en_US/tickets/index.html";

// Force HTTP/1.1 via a Chromium launch flag, since the site returns
// ERR_HTTP2_PROTOCOL_ERROR with default Playwright/Chromium HTTP2 negotiation.
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-http2"],
});
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(8000);
  const title = await page.title();
  console.log("Title:", title);
  const bodyLen = await page.evaluate(() => document.body.innerText.length);
  console.log("Body text length:", bodyLen);
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1000));
  console.log("Preview:", bodyText);
} catch (e) {
  console.log("Error:", e.message);
}

await browser.close();
