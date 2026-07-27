import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Singapore GP 2026, researched 20 Jul 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// EXCEPTION event: no Sunday single-day ticket exists at all (confirmed —
// Sunday is greyed out/unselectable on the official site). Saturday used
// as the single-day tier instead, per user instruction 20 Jul 2026 ("this
// is an exception not the rule").
//
// IMPORTANT — curl/static-fetch was confirmed UNRELIABLE for this specific
// event: initial automated extraction missed real products (Observe@3,
// Twenty 3, Lounge+ @ Turn 3, Torque @ Flyer, and per-day price variants)
// that were only found via user-supplied screenshots of the live site.
// Do not trust a single curl pass for this ticketing URL in future
// refreshes — cross-check against a manual browse.
//
// Sources: tickets.formula1.com/en/f1-3301-singapore (EUR, converted to
// USD at 1.14) for tier1-tier3 boundary data; user screenshots for the
// complete real product list per day-view (Fri single / Sat single /
// Fri-Sun 3-day). f1experiences.com/2026-singapore-grand-prix for tier4
// (Observ@3 3-Days, USD confirmed via priceCurrency field).
//
// tier3/tier4 boundary corrected after user found via Google (AI Overview
// citing singaporegp.sg) that Twenty3 and Observe@3 are genuine premium
// hospitality-grade products despite being listed on the standard ticket
// store page — moved from tier3 to tier4 to avoid a tier3-above-tier4
// price overlap.

const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b"; // Singapore Grand Prix 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel:
      "Zone 4 Walkabout, Padang, Premier Walkabout, Republic Grandstand, Pit, Chicane @ Turn 2 (single-day, Saturday)",
    costLow: "290.00",
    costHigh: "869.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Skyline Grandstand, Pit Exit Grandstand, Chicane @ Turn 2 (3-day, Fri–Sun)",
    costLow: "1385.00",
    costHigh: "1738.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Torque @ Flyer, Lounge+ @ Turn 3 (3-day, Fri–Sun)",
    costLow: "4829.00",
    costHigh: "6354.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Twenty 3, Observe@3, Observ@3 3-Days (Paddock Club) (3-day, Fri–Sun)",
    costLow: "9264.00",
    costHigh: "9962.00",
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
