import { chromium } from "playwright";

// Reusable ticket-scraping tool for tickets.formula1.com event pages.
// Fixes the root cause behind the incomplete Singapore/Italy extractions
// (20 Jul 2026): those pages only embed ONE day-tab's product data in the
// default HTML response — the rest is only rendered after a real user
// clicks a different day tab, which a plain curl GET can never trigger.
// This script drives a real headless browser: navigates to the page,
// clicks through every visible day-tab, and reads the actually-rendered
// DOM after each click — the same data a human sees.
//
// Usage: node --experimental-strip-types scripts/scrape-f1-ticket-tiers.mjs <ticketing-url>
// Example: node --experimental-strip-types scripts/scrape-f1-ticket-tiers.mjs https://tickets.formula1.com/en/f1-3277-hungary

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scrape-f1-ticket-tiers.mjs <ticketing-url>");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

console.log(`Navigating to ${url} ...`);
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

// Day-tab buttons — the filter panel at the top of the page (Friday-Sunday,
// Saturday-Sunday, Sunday, Saturday, Friday, etc.). Selector based on the
// pattern observed across Belgium/Hungary/Singapore/Vegas/Abu Dhabi/Italy
// pages this session — adjust if F1 changes their markup.
const dayTabButtons = await page.locator('[class*="day"], [class*="tab"], button, a').all();

const results = {};
const seenTabs = new Set();

// Try clicking every element whose visible text looks like a day-range label
for (const btn of dayTabButtons) {
  let text = "";
  try {
    text = (await btn.innerText({ timeout: 2000 })).trim();
  } catch {
    continue;
  }
  const isDayTab = /^(Friday|Saturday|Sunday|Thursday)([\s-]*(Sunday|Saturday))?$/i.test(text) ||
    /\d\s*days?/i.test(text);
  if (!isDayTab || seenTabs.has(text)) continue;
  seenTabs.add(text);

  try {
    await btn.click({ timeout: 3000 });
    await page.waitForTimeout(1500); // let the product list re-render
  } catch {
    continue;
  }

  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('[class*="product"], [class*="grandstand"], [class*="option"]').forEach((el) => {
      const t = el.innerText?.trim();
      if (t && t.length < 300) items.push(t);
    });
    return items;
  });

  results[text] = products;
  console.log(`\n=== Tab: "${text}" ===`);
  console.log(products.slice(0, 30).join("\n---\n"));
}

console.log("\n\n=== RAW JSON (all tabs) ===");
console.log(JSON.stringify(results, null, 2));

await browser.close();
