import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
try {
  await page.locator("#onetrust-accept-btn-handler").click({ timeout: 5000 });
} catch {}
await page.waitForTimeout(1500);
const html = await page.content();
const outPath = "C:\\Users\\HP\\AppData\\Local\\Temp\\claude\\c--Users-HP--claude-projects-ExperienceCurator\\33d1714e-9565-4ad5-b4c4-eb9a55972f11\\scratchpad\\rendered.html";
fs.writeFileSync(outPath, html);
console.log("saved, length:", html.length);
await browser.close();
