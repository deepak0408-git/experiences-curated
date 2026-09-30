import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-osaka-day-trip";

// Real GetYourGuide affiliate links, provided by the founder 30 Sep 2026.
// Never constructed by Claude, per feedback_affiliate_link_generation.
// Two links for this experience — Castle walking tour and Dotonbori river
// cruise are genuinely distinct bookable products covering the same
// experience, same pattern as the Nagoya day-trip's two links.
const LINKS = [
  {
    platform: "getyourguide.com",
    label: "Osaka Castle History Walking Tour",
    url: "https://www.getyourguide.com/osaka-l1204/osaka-castle-history-walking-tour-castle-tower-admission-t1038691/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "getyourguide.com",
    label: "Osaka Walking Tour with Dotonbori River Cruise",
    url: "https://www.getyourguide.com/osaka-l1204/osaka-2-hour-walking-tour-with-dotonbori-river-cruise-t1323946/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const labels = LINKS.map((l) => l.label);
const bookingLinks = [...existing.filter((l) => !labels.includes(l.label)), ...LINKS];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — ${LINKS.length} GYG links added`);

await sql.end();
