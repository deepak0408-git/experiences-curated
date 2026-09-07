import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Mexico City GP 2026, researched 6 Sep 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// Sources:
// - tier2/tier3/tier4: tickets.formula1.com/en/f1-4861-mexico (EUR, screenshots
//   captured directly by founder — Images/Capture.PNG, Capture 1.PNG — since
//   the site 403s a direct fetch), converted to USD at 1.1622 via
//   api.frankfurter.dev, rate pulled 6 Sep 2026. All grandstand + hospitality
//   products sold as a single 3-day (Fri-Sun) package — no single-day
//   option exists for this event, same pattern as Abu Dhabi GP.
// - tier1: no GA/general-admission product found on tickets.formula1.com's
//   own listing (12 options shown, all grandstand-or-above; Grandstands 5,
//   9, 4, 8 sold out). A real third-party source (GPDestinations.com,
//   published 20 Mar 2026) names a genuine GA product — Grandstand 2A
//   (Orange zone), 3-day pass, 3,900 MXN — converted to USD at today's real
//   rate (0.05917 via api.frankfurter.dev, 6 Sep 2026) = $230.76, not the
//   $191/$215 the source itself quotes (internally inconsistent, and both
//   stale vs. today's FX). Only one real GA price point exists (no second
//   product to pair it with for a genuine range), so tier1 is seeded as a
//   tight band around that one verified figure. Founder-approved 6 Sep 2026.
// Tier boundaries (natural price-jump grouping, same method as Abu Dhabi)
// approved by founder 6 Sep 2026.

const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // Mexico City Grand Prix 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Grandstand 2A / Orange Zone — General Admission (3-day, Fri–Sun)",
    costLow: "220.00",
    costHigh: "240.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand 15, Grandstand 14, Grandstand 5A (3-day, Fri–Sun)",
    costLow: "785.00",
    costHigh: "1270.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Grandstand 11, Grandstand 10, Main Grandstand (3-day, Fri–Sun)",
    costLow: "1640.00",
    costHigh: "2166.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Paddock Club, House 44 at F1 Paddock Club™ (3-day, Fri–Sun)",
    costLow: "8502.00",
    costHigh: "16338.00",
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
