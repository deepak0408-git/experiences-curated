import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-first-timer-guide-mtx7ldx9";

// Real GetYourGuide affiliate link, provided by the founder 12 Sep 2026 —
// a 5th opportunity found after the initial "exhaustive" 3-day-trip sweep.
// A farmers market/Brazilian food tour doesn't map cleanly to any existing
// named experience (Feira da Liberdade is Japanese-market focused, not a
// Brazilian farmers market) — attached to First-Timer's Guide to Sao Paulo
// per founder decision, alongside the walking tour link added in the same
// session. Verified as a genuine getyourguide.com domain before writing,
// per isRealAffiliateLink()'s own detection logic. Never constructed by
// Claude, per feedback_affiliate_link_generation.
const URL =
  "https://www.getyourguide.com/sao-paulo-l384/sao-paulo-farmers-market-brazilian-food-tour-t1439207/?partner_id=HCNITTS&utm_medium=online_publisher";

const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== "São Paulo Farmers Market & Brazilian Food Tour"),
  { platform: "getyourguide.com", label: "São Paulo Farmers Market & Brazilian Food Tour", url: URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — GYG link added`);
console.log(JSON.stringify(bookingLinks, null, 2));

await sql.end();
