import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Hungarian GP 2026, researched 20 Jul 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// Only Friday-Sunday and Saturday day-views are available (Sunday and
// Friday-only both "Not available" — confirmed via Playwright day-tab
// clicking AND user screenshots, cross-verified). tier1 not seeded — the
// only Saturday grandstands with real inventory (FAN, APEX 2, Pit Exit)
// map to tier2; Apex 1 and Grand Prix 2 are sold out.
//
// Sources: tickets.formula1.com/en/f1-3277-hungary (EUR, converted to USD
// at 1.14) for grandstand tickets + Paddock Club; f1experiences.com
// (2026-hungarian-grand-prix, USD confirmed via priceCurrency field on
// both individual product pages) for Champions Club and Legend 3-Days.
// Tier boundaries approved by user 20 Jul 2026.

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86"; // Hungarian Grand Prix 2026

const TIERS = [
  {
    tier: "tier2",
    eventTierLabel: "FAN, APEX 2, Pit Exit (single-day, Saturday)",
    costLow: "228.00",
    costHigh: "262.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Champions Club",
    costLow: "1199.00",
    costHigh: "1199.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Paddock Club (Friday-Sunday), Legend 3-Days | Club Suite",
    costLow: "6650.00",
    costHigh: "13905.00",
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
