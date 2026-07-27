import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Las Vegas GP 2026, researched 20 Jul 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// Sources:
// - tier1/tier2/tier3: tickets.formula1.com/en/f1-59007-las-vegas (EUR,
//   converted to USD at 1.14 via exchangerate-api.com, rate pulled 20 Jul
//   2026). Currency visually confirmed by user screenshot (€ symbols).
// - tier4: f1experiences.com/2026-las-vegas-grand-prix?package-group=paddock-club
//   (USD confirmed via schema.org priceCurrency + default_currency fields
//   on individual product page, not assumed).
// Race weekend is genuinely Thu-Sat (19-21 Nov 2026, confirmed against our
// own sporting_events dates) — no Sunday session exists for this event,
// so every product on both sources is a 3-day Thu-Sat package. Tier
// boundaries approved by user 20 Jul 2026: tier2 = EUR 918.68-1315.02
// range, tier3 = EUR 1315.02-1820.72 range (shared boundary at
// Mobile Zone at Sphere Grandstands, placed in tier2 as its ceiling).

const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57"; // Las Vegas Grand Prix 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (3-day, Thu–Sat)",
    costLow: "807.00",
    costHigh: "807.00",
  },
  {
    tier: "tier2",
    eventTierLabel:
      "HEINEKEN® Grandstand, West Harmon Grandstands, Turn 3 Grandstands, Mobile Zone at Sphere Grandstands (3-day, Thu–Sat)",
    costLow: "1047.00",
    costHigh: "1499.00",
  },
  {
    tier: "tier3",
    eventTierLabel:
      "Mobile Zone at Sphere Grandstands, Grandstand – Start/Finish Line (3-day, Thu–Sat)",
    costLow: "1499.00",
    costHigh: "2076.00",
  },
  {
    tier: "tier4",
    eventTierLabel:
      "Turn 3 Club, SkyBox, Paddock Club™ (F1 Experiences Suite), House 44 at F1 Paddock Club™, Legend (F1 Experiences Suite) (3-day, Thu–Sat)",
    costLow: "5489.00",
    costHigh: "21268.00",
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
