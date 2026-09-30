import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-sumo-near-nagoya";

// Real GetYourGuide affiliate link, provided by the founder 30 Sep 2026.
// Never constructed by Claude, per feedback_affiliate_link_generation.
// This experience specifically features Sumo Studio Osaka (not a Nagoya
// venue), so an Osaka-listed GYG sumo tour is the correct match, not a
// mistake — confirmed against the experience's own bodyContent before
// writing this link.
const URL =
  "https://www.getyourguide.com/osaka-l1204/osaka-sumo-experience-with-live-show-audience-challenge-t1111734/?partner_id=HCNITTS&utm_medium=online_publisher";
const LABEL = "Osaka Sumo Experience — Live Show & Audience Challenge";

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== LABEL),
  { platform: "getyourguide.com", label: LABEL, url: URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — GYG link added`);

await sql.end();
