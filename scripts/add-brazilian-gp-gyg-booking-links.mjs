import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real GetYourGuide affiliate links, provided by the founder 12 Sep 2026,
// following an exhaustive audit of all 25 Brazilian GP experiences for
// genuine GYG-eligible tour products (only the 3 true day trips qualified
// — everything else in the pack is a walk-in site, restaurant, or F1/hotel
// channel already covered elsewhere). Each verified as a genuine
// getyourguide.com domain before writing, per isRealAffiliateLink()'s own
// detection logic. Never constructed by Claude, per
// feedback_affiliate_link_generation. São Roque Wine Route's link still
// outstanding.
const updates = [
  {
    slug: "brazilian-gp-santos-guaruja-daytrip-mtx7h7g6",
    label: "São Paulo Beaches Day Tour",
    url: "https://www.getyourguide.com/sao-paulo-l384/sao-paulo-beaches-day-tour-t161868/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "brazilian-gp-campos-do-jordao-daytrip-mtx7iiha",
    label: "Campos do Jordão Guided Tour",
    url: "https://www.getyourguide.com/sao-paulo-l384/sao-paulo-campos-do-jordao-guided-tour-t162063/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

for (const u of updates) {
  const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${u.slug}`;
  const existing = current.booking_links ?? [];
  const bookingLinks = [
    ...existing.filter((l) => l.label !== u.label),
    { platform: "getyourguide.com", label: u.label, url: u.url },
  ];
  await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${u.slug}`;
  console.log(`✓ ${current.title} — GYG link added`);
}

console.log("\nStill needed: São Roque Wine Route's GetYourGuide link.");
await sql.end();
