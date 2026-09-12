import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Tightens 4 ticket-related experiences' practical_info.costRange (and
// stale ticketing_url website fields) to match the real seeded
// planner_ticket_tier_cost figures, 12 Sep 2026 — founder decision: treat
// the seeded tier ranges as ground truth over each experience's own
// pre-existing secondary-market estimate. Also fixes each experience's
// `website` field, which pointed at the general formula1.com race page
// rather than the actual validated tickets.formula1.com ticket page.
const TICKETS_URL = "https://tickets.formula1.com/en/f1-3325-brazil";

const updates = [
  {
    slug: "brazilian-gp-grandstand-a-mtx6nzu0",
    costRange:
      "US$177–283 for the 3-day weekend — confirmed 2026 official pricing (Grandstand A/G tier). Confirm current availability on the official ticketing site before buying.",
  },
  {
    slug: "brazilian-gp-grandstand-m-mtx6pll2",
    costRange:
      "US$385–640 for the 3-day weekend — confirmed 2026 official pricing (Grandstand M/R tier). Confirm current availability on the official ticketing site before buying, as M has historically sold out early.",
  },
  {
    slug: "brazilian-gp-hospitality-paddock-club-mtx6t3tb",
    costRange:
      "Orange Tree Club / F1 Paddock Experience: US$1,955–2,361 for the 3-day weekend — confirmed 2026 official pricing. Confirm current availability directly, as both tiers were showing sold out as of Sep 2026 for the 2026 race weekend.",
  },
  {
    // Heineken Village (tier3, US$444-810) is experience #25 — added in a
    // separate session, not yet seeded as of this update. Referenced here
    // in prose since the Ticket Guide is the one experience that should
    // name every tier regardless of whether each has its own dedicated
    // experience row yet.
    slug: "brazilian-gp-ticket-guide-mtx6r39p",
    costRange:
      "Confirmed 2026 official pricing by tier: Grandstand A/G US$177–283, Grandstand M/R US$385–640, Heineken Village US$444–810, Orange Tree Club/F1 Paddock Experience US$1,955–2,361 — all for the 3-day weekend. Confirm current availability directly, since several stands were already sold out as of Sep 2026.",
  },
];

for (const u of updates) {
  const [current] = await sql`SELECT practical_info FROM experiences WHERE slug = ${u.slug}`;
  const newPracticalInfo = {
    ...current.practical_info,
    costRange: u.costRange,
    website: TICKETS_URL,
  };
  await sql`UPDATE experiences SET practical_info = ${sql.json(newPracticalInfo)} WHERE slug = ${u.slug}`;
  console.log(`✓ ${u.slug} — costRange + website updated`);
}

console.log("\nDone. Remember: run sync-algolia.mjs after this (published experience field changed).");
await sql.end();
