import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-nagoya-day-trip";

// Real GetYourGuide affiliate links, provided by the founder 30 Sep 2026.
// Never constructed by Claude, per feedback_affiliate_link_generation.
// Two links for this experience since it's the only seeded Nagoya day-trip
// row in the pack and covers both the castle and Osu — same pattern as
// Brazilian GP's add-brazilian-gp-saoroque-gyg-link.mjs.
const LINKS = [
  {
    platform: "getyourguide.com",
    label: "Nagoya Castle, History & Food — 2.5hr Guided Tour",
    url: "https://www.getyourguide.com/nagoya-l32669/25-hour-nagoya-tour-castle-history-local-food-city-view-t1069157/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "getyourguide.com",
    label: "Osu Kannon Temple & Street Food — Guided Tour",
    url: "https://www.getyourguide.com/nagoya-l32669/nagoya-kannon-temple-osu-district-street-food-guided-tour-t1094399/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const labels = LINKS.map((l) => l.label);
const bookingLinks = [...existing.filter((l) => !labels.includes(l.label)), ...LINKS];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — ${LINKS.length} GYG links added`);

await sql.end();
