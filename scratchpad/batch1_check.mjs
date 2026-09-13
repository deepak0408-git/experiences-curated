import { config } from "dotenv";
config({ path: ".env.local" });

const batch1Emails = [
  "contactus@dreamsetgo.com", // Dream Sports
  "helpme@batravel.com", // Bharat Army
  "info@roadtrips.com", // Roadtrips
  "info@goindiaholiday.net", // GoIndiaHoliday
  "smile@vishwaviharholidays.com", // Vishwa Vihar Holidays
  "travel@sportsnetholidays.com", // Sports Net Holidays
  "mehul@worldsportstravels.in", // World Sports Travels
  "enquiries@elegantresorts.co.uk", // Elegant Resorts
  "info@discoveryholidays.in", // Discovery Holidays
  "info@beyondthecastletravel.com", // Beyond the Castle Travel
  "sports@cassidytravel.ie", // Cassidy Travel
  "info@celtichorizontours.com", // Celtic Horizon Tours
];

let after = null;
let all = [];
let page = 0;
while (page < 30) {
  const url = new URL("https://api.resend.com/emails");
  url.searchParams.set("limit", "100");
  if (after) url.searchParams.set("after", after);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } });
  const data = await res.json();
  const batch = data.data || [];
  all = all.concat(batch);
  if (batch.length < 100) break;
  after = batch[batch.length - 1].id;
  page++;
}

for (const em of batch1Emails) {
  const matches = all.filter(e => (e.to||[]).some(t => t.toLowerCase().includes(em.toLowerCase())));
  console.log(em, "->", matches.length, "sends found");
  matches.forEach(m => console.log("   ", m.created_at, m.subject));
}
