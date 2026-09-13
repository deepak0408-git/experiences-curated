import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  geolocation: { latitude: 40.7128, longitude: -74.006 },
  permissions: [],
});
const page = await context.newPage();
const url = "https://www.booking.com/searchresults.html?ss=Paris%2C+France&checkin=2027-05-21&checkout=2027-05-28&group_adults=2&no_rooms=1&group_children=0&nflt=ht_id%3D204&selected_currency=USD&lang=en-us";
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
try { await page.click('#onetrust-accept-btn-handler', { timeout: 5000 }); } catch {}
await page.waitForTimeout(2000);

// Find the "Star rating" filter section and click "2 stars" checkbox
const clicked = await page.evaluate(() => {
  const filterGroups = document.querySelectorAll('[data-filters-group]');
  const results = [];
  filterGroups.forEach(g => {
    const groupName = g.getAttribute('data-filters-group');
    if (/class|star/i.test(groupName || '')) {
      const checkboxes = g.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        results.push({ group: groupName, id: cb.id, name: cb.name, value: cb.value, label: cb.closest('label')?.textContent?.trim() });
      });
    }
  });
  return results;
});
fs.writeFileSync(process.argv[2], JSON.stringify(clicked, null, 2));
console.log('done, found', clicked.length, 'checkboxes');
await browser.close();
