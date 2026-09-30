import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-ise-grand-shrine";

// Real GetYourGuide affiliate link, provided by the founder 30 Sep 2026.
// Never constructed by Claude, per feedback_affiliate_link_generation.
const URL =
  "https://www.getyourguide.com/ise-japan-l152431/ise-guided-geku-and-naiku-in-the-sacred-pilgrimage-order-t1036256/?partner_id=HCNITTS&utm_medium=online_publisher";
const LABEL = "Ise Grand Shrine — Geku & Naiku, Guided";

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== LABEL),
  { platform: "getyourguide.com", label: LABEL, url: URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — GYG link added`);

await sql.end();
