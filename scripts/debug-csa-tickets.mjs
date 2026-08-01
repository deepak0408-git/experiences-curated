import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, args: ["--disable-http2"] });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

try {
  await page.goto("https://tickets.cricket.co.za", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log("Title:", title);

  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));
  console.log("Body preview:\n", bodyText);

  const eventLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a"))
      .map((a) => ({ href: a.href, text: a.innerText?.trim() }))
      .filter((l) => l.text && l.text.length > 3 && l.text.length < 100)
  );
  console.log("\nLinks with text:", JSON.stringify(eventLinks.slice(0, 40), null, 2));
} catch (e) {
  console.log("Error:", e.message);
}

await browser.close();
