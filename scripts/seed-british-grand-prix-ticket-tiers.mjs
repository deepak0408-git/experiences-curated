import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for British Grand Prix 2027, researched and
// founder-verified 30 Sep 2026 directly against silverstone.co.uk's live
// ticket pages (3-day, Friday-Sunday prices) plus f1experiences.com (F1
// Experiences Lounge, direct) and a Google AI Mode summary (F1 Paddock
// Club — LOWER confidence, pricing not publicly listed on tickets.formula1.com).
//
// Tier shape here differs from other F1 events: Silverstone's tier1 (plain
// General Admission, £349/$468) is genuinely a single flat 3-day price with
// no range — it prices BELOW tier2's ceiling (GA+ £459/$615) but ABOVE
// tier2's floor (cheapest grandstand, Vale £129/$173). This overlap is
// real and expected — General Admission Plus was moved into tier2
// alongside Grandstand per founder direction (30 Sep 2026), since GA+ is
// a reserved-standing product priced in the same band as grandstands, not
// its own separate tier.
//
// Octane Terrace and Heritage Club were sold out for the 3-day option at
// research time — no real 3-day price observable. Founder-provided assumed
// values (£3,069 and £3,499 respectively) used per explicit instruction,
// flagged LOWER confidence in circuit_seating_profile's sourceNote.
const EVENT_ID = "3a943a09-92dd-47dd-b675-884ec4729b4f"; // British Grand Prix 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission; 3-day",
    costLow: "468.00",
    costHigh: "468.00",
  },
  {
    tier: "tier2",
    eventTierLabel:
      "Grandstand (e.g. Abbey, Becketts) / General Admission Plus (e.g. Abbey GA+, Vale GA+); 3-day",
    costLow: "173.00",
    costHigh: "615.00",
  },
  {
    tier: "tier3",
    eventTierLabel:
      "Premium Grandstand (e.g. Landostand, George Russell Grandstand); 3-day",
    costLow: "655.00",
    costHigh: "762.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Hospitality (e.g. Racing Green, F1 Paddock Club); 3-day",
    costLow: "2826.00",
    costHigh: "15000.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, edition_year, cost_low, cost_high)
    VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${EDITION_YEAR}, ${t.costLow}, ${t.costHigh})
    ON CONFLICT (sporting_event_id, tier, edition_year) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, edition_year, cost_low, cost_high
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
