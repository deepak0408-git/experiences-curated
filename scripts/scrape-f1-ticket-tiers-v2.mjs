import { chromium } from "playwright";

// v2 — corrected selectors based on real page structure confirmed via
// debug-page-structure.mjs on Hungarian GP (20 Jul 2026). Day-tabs are
// <a> elements with child <div class="day-caption"> (label) and pricing
// text like "From 200,00 €" or "Not available". Clicking a tab re-renders
// the grandstand product list below.

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scrape-f1-ticket-tiers-v2.mjs <ticketing-url>");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

console.log(`Navigating to ${url} ...`);
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);

// Dismiss the OneTrust cookie-consent banner, which otherwise intercepts
// every click on the page (confirmed blocker, 20 Jul 2026 debug run).
try {
  await page.locator("#onetrust-accept-btn-handler").click({ timeout: 5000 });
  await page.waitForTimeout(500);
} catch {
  console.log("(no cookie banner found, or already dismissed)");
}

// Find all day-tab links (identified by having a .day-caption child)
const tabs = await page.locator("a:has(.day-caption)").all();
console.log(`Found ${tabs.length} day-tabs\n`);

const results = {};

for (const tab of tabs) {
  const fullText = (await tab.innerText()).replace(/\s+/g, " ").trim();
  const dayLabel = (await tab.locator(".day-caption").innerText()).trim();
  const isAvailable = !/not available/i.test(fullText);

  console.log(`--- Tab: "${dayLabel}" (${fullText}) ---`);

  if (!isAvailable) {
    results[dayLabel] = { available: false, products: [] };
    continue;
  }

  await tab.click();
  await page.waitForTimeout(2000); // let product list re-render

  // Extract product name+price pairs. Product cards on this page carry a
  // grandstand-product="{...}" JSON attribute (confirmed via raw HTML
  // inspection earlier this session) with real name/price/categoryName —
  // read that directly instead of parsing rendered text, since it's the
  // authoritative source data, not a display artifact.
  const products = await page.evaluate(() => {
    const rows = [];
    document.querySelectorAll("[grandstand-product]").forEach((el) => {
      try {
        const data = JSON.parse(el.getAttribute("grandstand-product"));
        rows.push(data);
      } catch {}
    });
    return rows;
  });

  results[dayLabel] = { available: true, products };
  console.log(products.join(" | "));
  console.log();
}

console.log("\n=== FULL JSON ===");
console.log(JSON.stringify(results, null, 2));

await browser.close();
