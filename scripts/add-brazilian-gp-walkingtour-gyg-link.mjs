import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-first-timer-guide-mtx7ldx9";

// Real GetYourGuide affiliate link, provided by the founder 12 Sep 2026 —
// a 4th opportunity found after the initial "exhaustive" 3-day-trip sweep,
// since a general city walking tour doesn't map to any single day trip.
// Attached to First-Timer's Guide to Sao Paulo (city-orientation
// experience) per founder decision. Verified as a genuine getyourguide.com
// domain before writing, per isRealAffiliateLink()'s own detection logic.
// Never constructed by Claude, per feedback_affiliate_link_generation.
const URL =
  "https://www.getyourguide.com/sao-paulo-l384/walking-tour-in-sao-paulo-t543016/?partner_id=HCNITTS&utm_medium=online_publisher";

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== "São Paulo Walking Tour"),
  { platform: "getyourguide.com", label: "São Paulo Walking Tour", url: URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — GYG link added`);

await sql.end();
