import { chromium } from "playwright";
import fs from "fs";

const params = new URLSearchParams({
  ss: "Chennai",
  checkin: "2027-01-27",
  checkout: "2027-02-03",
  group_adults: "2",
  no_rooms: "1",
  group_children: "0",
  order: "review_score_and_price",
  nflt: "review_score=70;ht_id=204",
  selected_currency: "USD",
  lang: "en-us",
});
const url = `https://www.booking.com/searchresults.html?${params.toString()}`;
console.log("URL:", url);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  timezoneId: "America/New_York",
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: [],
});
const page = await context.newPage();
const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
console.log("status:", resp.status());

try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); console.log("dismissed cookie banner"); } catch (e) { console.log("no cookie banner"); }

await page.waitForTimeout(3000);

const title = await page.title();
console.log("page title:", title);

const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
console.log("--- body text sample ---");
console.log(bodyText);

const html = await page.content();
fs.writeFileSync("scratchpad/chennai-debug.html", html);
console.log("saved full HTML, length:", html.length);

await browser.close();
