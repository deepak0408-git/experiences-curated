import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-sao-roque-wine-route-mtx7fmaf";

// Real GetYourGuide affiliate link, provided by the founder 12 Sep 2026,
// verified as a genuine getyourguide.com domain before writing, per
// isRealAffiliateLink()'s own detection logic. Never constructed by
// Claude, per feedback_affiliate_link_generation. Completes the 3-link
// GYG affiliate sweep across all 25 Brazilian GP experiences (only the 3
// true day trips qualified after an exhaustive review).
const URL =
  "https://www.getyourguide.com/sao-paulo-l384/from-sao-paulo-sao-roque-wine-route-and-shopping-tour-t389797/?partner_id=HCNITTS&utm_medium=online_publisher";

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== "São Roque Wine Route & Shopping Tour"),
  { platform: "getyourguide.com", label: "São Roque Wine Route & Shopping Tour", url: URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — GYG link added`);

await sql.end();
