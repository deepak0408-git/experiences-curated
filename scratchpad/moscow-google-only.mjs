import { chromium } from "playwright";
import fs from "fs";

const originCity = "Moscow", destCity = "Mexico City", depDate = "2026-10-25", retDate = "2026-11-06";

const browser = await chromium.launch();
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  locale: "en-US",
});
const page = await context.newPage();
try {
  const q = `Flights from ${originCity} to ${destCity} on ${depDate} through ${retDate}`;
  await page.goto(`https://www.google.com/travel/flights?hl=en-US&gl=US&curr=USD&q=${encodeURIComponent(q)}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(6000);
  try {
    await page.click("text=View more flights", { timeout: 5000 });
    await page.waitForTimeout(3000);
  } catch {}
  const bodyText = await page.evaluate(() => document.body.innerText);
  const lines = bodyText.split("\n");
  const prices = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === "1 stop" || t === "Nonstop") {
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        const m = lines[j].trim().match(/^\$([\d,]+)$/);
        if (m && lines[j + 1] && lines[j + 1].trim() === "round trip") {
          prices.push(parseInt(m[1].replace(/,/g, ""), 10));
          break;
        }
      }
    }
  }
  const sorted = [...new Set(prices)].sort((a, b) => a - b);
  console.log("Moscow Google Flights results:", sorted);
  fs.writeFileSync("scratchpad/flights-moscow-mexico-google-only.json", JSON.stringify({ origin: "Moscow", googleFlights: { sorted, rawCount: prices.length }, singleSource: true, reason: "Kayak returns zero/timeout for Moscow routes — known gap per planner-data-researcher skill" }, null, 2));
} catch (e) {
  console.log("ERROR:", e.message);
} finally {
  await context.close();
  await browser.close();
}
