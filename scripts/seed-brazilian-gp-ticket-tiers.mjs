import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Brazilian GP 2026, founder-provided and
// founder-verified 12 Sep 2026, per the planner-data-researcher skill's
// Tickets methodology (F1 section). Official source URL validated by
// Claude before seeding: https://tickets.formula1.com/en/f1-3325-brazil
// returns HTTP 200 and resolves to "F1® Brazil Tickets" (confirmed real
// page, not a redirect/mismatch). Underlying prices themselves were
// verified directly by the founder, not independently cross-checked by
// Claude per founder instruction.
//
// Interlagos has no General Admission tier — every ticket is a reserved
// grandstand letter, so tier1 here is the cheapest grandstand pair
// (A/G), not a GA product, unlike most other F1 events' tier1.
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4"; // Brazilian Grand Prix 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Grandstand A / Grandstand G",
    costLow: "177.00",
    costHigh: "283.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand M / Grandstand R",
    costLow: "385.00",
    costHigh: "640.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Heineken Village",
    costLow: "444.00",
    costHigh: "810.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Orange Tree Club / F1 Paddock Experience",
    costLow: "1955.00",
    costHigh: "2361.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high)
    VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
