import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for New Zealand tour of Australia 2026-27 (cricket),
// researched 21 Jul 2026 per the planner-data-researcher skill's Tickets
// methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, cricket):
// tier1 General Admission, tier2 Reserved Stand, tier3 Premium Stand.
// No tier4 — top tier is members-only and never seeded.
//
// SCOPE — 2 of 4 Tests covered (Perth, Sydney). Melbourne (3rd Test,
// Boxing Day at the MCG) remains unresearched — its official ticketing is
// behind Ticketek's geo-restriction wall ("access blocked in your region"
// for non-Australian IPs, confirmed by the user's own browser 21 Jul 2026)
// — this is a real, unresolved gap, parked pending a VPN/proxy with an
// Australian exit node, NOT silently worked around. Adelaide (2nd Test)
// prices also not yet obtained. Prices below are user-supplied (all
// screenshotted from the real Ticketek listings for Perth and Sydney),
// not automated.
//
// IMPORTANT PRICING CAVEAT: all prices below are SINGLE-DAY tickets to the
// Test matches (not full-match multi-day passes) — this must stay visible
// to the user on Screen 2 / Tradeoff Engine copy (see the open "which day
// does this price represent" product gap noted elsewhere in this skill).
//
// Source currency: AUD (Ticketek, official Cricket Australia partner),
// converted to USD (planner's universal display currency) at 1 AUD =
// 0.70068 USD (Frankfurter API, rate date 2026-07-20, re-confirmed 21 Jul
// 2026). AUD source figures kept in this comment for traceability; DB
// stores USD only, rounded to whole dollars per standing convention.
//
// TIER1 (General Admission) — blended across both researched venues per
// user decision 21 Jul 2026 (same city-blending pattern as the SA cricket
// tours — DB schema doesn't support per-city bands):
//   Perth: AUD 42-237. Sydney: AUD 42-220.
//   Blended low/high = AUD 42-237 (overall min/max across both cities).
//   AUD 42-237 = USD 29.43-166.06, rounded: USD 29-166.
//
// TIER2 (Reserved Stand) — Sydney hospitality products, grouped together
// per user decision 21 Jul 2026 (Outdoor Boxes and The Lounge judged as
// the same real tier, not two separate ones):
//   Outdoor Boxes: AUD 750. The Lounge: AUD 895.
//   AUD 750-895 = USD 525.51-627.11, rounded: USD 526-627.
//
// TIER3 (Premium Stand) — Sydney hospitality products, the genuine top
// tier:
//   Private Suites: AUD 1,250. The First XI: AUD 1,390.
//   AUD 1,250-1,390 = USD 875.85-973.95, rounded: USD 876-974.
//
// Labels intentionally omit city names per user decision 21 Jul 2026 (kept
// simple/generic, matching the general "no per-city data" DB constraint).

const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd"; // New Zealand tour of Australia 2026-27

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (single-day Test match ticket)",
    costLow: "29.00",
    costHigh: "166.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Outdoor Boxes, The Lounge (single-day Test match ticket)",
    costLow: "526.00",
    costHigh: "627.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Private Suites, The First XI (single-day Test match ticket)",
    costLow: "876.00",
    costHigh: "974.00",
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
