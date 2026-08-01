import { chromium } from "playwright";

const url = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

// Dump all clickable text on the page to find the real day-tab labels
const allText = await page.evaluate(() => {
  const clickable = document.querySelectorAll("button, a, [role='button'], [role='tab'], div[class*='tab'], div[class*='day']");
  return Array.from(clickable).map((el) => ({
    tag: el.tagName,
    class: el.className?.toString().slice(0, 80),
    text: el.innerText?.trim().slice(0, 60),
  })).filter((x) => x.text);
});

console.log(JSON.stringify(allText.slice(0, 60), null, 2));
await page.screenshot({ path: "C:\\Users\\HP\\AppData\\Local\\Temp\\claude\\c--Users-HP--claude-projects-ExperienceCurator\\33d1714e-9565-4ad5-b4c4-eb9a55972f11\\scratchpad\\debug_page.png", fullPage: false });
console.log("\nScreenshot saved");

await browser.close();
