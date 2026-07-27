import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Abu Dhabi GP 2026, researched 20 Jul 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// Sources:
// - tier2/tier3: tickets.formula1.com/en/f1-3312-abu-dhabi (EUR, converted
//   to USD at 1.14 via exchangerate-api.com, rate pulled 20 Jul 2026).
//   Every grandstand product sold ONLY as a 4-day (Thu-Sun) package — no
//   single-day option exists for this event.
// - tier4: f1experiences.com/2026-abu-dhabi-grand-prix?package-group=paddock-club
//   (already USD, no conversion). 3-day (Fri-Sun) packages.
// tier1 intentionally NOT seeded — no general admission/"Abu Dhabi Hill"
// product exists on the official source; confirmed absent, not fabricated.
// Tier boundaries (natural price-jump grouping) approved by user 20 Jul 2026.

const EVENT_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8"; // Abu Dhabi Grand Prix 2026

const TIERS = [
  {
    tier: "tier2",
    eventTierLabel:
      "Marina Grandstand, West Straight Grandstand, South Grandstand, North Straight Grandstand, North Grandstand (4-day, Thu–Sun)",
    costLow: "783.00",
    costHigh: "1052.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "West Grandstand, Main Grandstand (4-day, Thu–Sun)",
    costLow: "1466.00",
    costHigh: "2349.00",
  },
  {
    tier: "tier4",
    eventTierLabel:
      "Hero | Main, Hero | West, F1 Experiences Lounge at Yas Premium Suites (Premium Restaurant), Paddock Club™ (Cadillac F1 Team Suite), House 44 at F1 Paddock Club™ (3-day, Fri–Sun)",
    costLow: "2539.00",
    costHigh: "18385.50",
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
