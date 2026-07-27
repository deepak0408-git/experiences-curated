import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Test data only — placeholder hotel tiers for New York, same quality bar
// as Abu Dhabi/Belgian Ardennes/Milan (plausible-looking, not researched).
// Confirmed with user 19 Jul 2026: still testing, real 20-hotel methodology
// is a production-readiness task, not needed now.
const NEW_YORK_DEST_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";

const TIERS = [
  { tier: "budget", low: 120, high: 180 },
  { tier: "moderate", low: 180, high: 280 },
  { tier: "splurge", low: 280, high: 450 },
  { tier: "luxury", low: 450, high: 750 },
  { tier: "general", low: 180, high: 280 },
];

for (const t of TIERS) {
  await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, cost_low, cost_high)
    VALUES (${NEW_YORK_DEST_ID}, ${t.tier}, ${t.low}, ${t.high})
    ON CONFLICT (destination_id, tier) DO UPDATE SET cost_low = ${t.low}, cost_high = ${t.high}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${TIERS.length} New York hotel tier rows`);

await sql.end();
