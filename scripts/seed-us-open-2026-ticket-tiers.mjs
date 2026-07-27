import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for US Open 2026 (tennis), researched 20-21 Jul 2026
// per the planner-data-researcher skill's Tickets methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, tennis):
// tier1 Grounds Pass, tier2 Outer Court Reserved, tier3 Show Court Reserved,
// tier4 Suite. This event's real named products map directly to those.
//
// FIRST-ROUND PRICING — standing caveat, not baked into a multiplier:
// all prices below reflect first-round session pricing (30 Aug 2026).
// Semifinals/finals run substantially higher (user's stated estimate:
// roughly 5-8x first-round prices) but that multiplier was not itself
// independently verified — it is NOT applied to the seeded numbers here,
// only documented as a caveat, per the "never fabricate, disclose the
// method" principle. Do not silently multiply these numbers up for later
// rounds without real per-round research.
//
// Source: usopen.org's own official ticketing redirect (this event's
// ticketing_url) → Ticketmaster.com listing, labeled "Verified Resale
// Ticket." This is NOT a primary box-office price and is normally excluded
// per the standing "never resale/aggregator" rule — treated as an
// exception here because usopen.org itself routes fans through this exact
// Ticketmaster channel as its official way to buy, confirmed by the user
// 20 Jul 2026. Currency: USD (Ticketmaster.com, New York venue).
//
// Grounds Admission (GA) Pass Only: $407.75 (single confirmed price point,
// rounded to $408). Grandstand (day session): $391-$718. Arthur Ashe
// Stadium (day $371-$2,691, evening $198-$2,680) and Louis Armstrong
// Stadium (day $466-$1,282, evening $185-$1,375) both confirmed as
// Show Court Reserved by user 20 Jul 2026 — combined into one tier3 range
// spanning both stadiums and both sessions. Hospitality: $2,371-$23,900.

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Grounds Admission (GA) Pass Only",
    costLow: "408.00",
    costHigh: "408.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand (Day session)",
    costLow: "391.00",
    costHigh: "718.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Arthur Ashe Stadium, Louis Armstrong Stadium (Day & Evening sessions)",
    costLow: "185.00",
    costHigh: "2691.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Hospitality",
    costLow: "2371.00",
    costHigh: "23900.00",
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
