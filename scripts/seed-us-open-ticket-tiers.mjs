import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Test data only — placeholder ticket tiers for US Open, same quality bar
// as the 3 F1 events' original prices (plausible-looking, not researched).
// Labels use tennis's confirmed sport-level tier structure (Grounds Pass /
// Outer Court Reserved / Show Court Reserved / Suite). Confirmed with user
// 19 Jul 2026: fix the gap, still test-data mode, production pricing
// research deferred.
const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const TIERS = [
  { tier: "tier1", label: "Grounds Pass", low: 90, high: 140 },
  { tier: "tier2", label: "Outer Court Reserved", low: 150, high: 250 },
  { tier: "tier3", label: "Show Court Reserved", low: 250, high: 450 },
  { tier: "tier4", label: "Suite", low: 1500, high: 4000 },
];

for (const t of TIERS) {
  await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high)
    VALUES (${US_OPEN_EVENT_ID}, ${t.tier}, ${t.label}, ${t.low}, ${t.high})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = ${t.label}, cost_low = ${t.low}, cost_high = ${t.high}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${TIERS.length} US Open ticket tier rows`);

await sql.end();
