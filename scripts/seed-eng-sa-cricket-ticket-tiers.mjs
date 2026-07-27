import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for England tour of South Africa 2026-27 (cricket),
// researched 21 Jul 2026 per the planner-data-researcher skill's Tickets
// methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, cricket):
// tier1 General Admission, tier2 Reserved Stand, tier3 Premium Stand.
// No tier4 — top tier is members-only and never seeded.
//
// SCOPE NOTE — one blended row for the whole tour, NOT per-city bands. Same
// standing decision as Australia-in-South-Africa: DB schema keys
// planner_ticket_tier_cost on sportingEventId only, not built for per-city
// splits — the multi-city/multi-format detail lives in this comment.
//
// Source: tickets.cricket.co.za (official Cricket South Africa ticketing,
// Ticketpro-powered), section https://tickets.cricket.co.za/section/-s0se,
// confirmed against the user's own screenshots of the live site 21 Jul 2026.
// Real prices observed on-site in ZAR, converted to USD (the planner's
// universal display currency) at 1 ZAR = 0.06064 USD (Frankfurter API,
// rate date 2026-07-20, re-confirmed 21 Jul 2026). ZAR source figures kept
// in this comment for traceability; DB stores USD only.
//
// Fixtures in this tour's window (17 Dec 2026 - 15 Jan 2027):
//   Test series (3 Tests, 4 days each): Dec 17-20 Wanderers/Johannesburg,
//   Dec 26-29 SuperSport Park/Centurion, Jan 3-6 Newlands/Cape Town (now
//   fully sold out).
//   ODI series (3 ODIs): Jan 10 Boland Park/Paarl (sold out), Jan 13 and
//   Jan 15 Mangaung Oval/Bloemfontein.
//
// TIER1 (General Admission) — real "from" prices observed across fixtures
// that still have live tickets (sold-out fixtures excluded from the range,
// same "no live price, no reconstruction" rule applied elsewhere this
// session): ZAR 100 (Mangaung Oval ODIs) to ZAR 210 (Wanderers Test Day 4,
// SuperSport Park Test Days 1-2). ZAR 100-210 = USD 6.06-12.73, rounded to
// whole dollars per standing convention (all planner USD prices are whole
// numbers, confirmed 21 Jul 2026): USD 6-13.
//
// TIER2 (Reserved Stand) — real named stand product, confirmed via the
// user's own screenshot of the live seat-map checkout widget 21 Jul 2026:
//   - Castle Corner (SuperSport Park, Centurion, 2nd Test Day 1, 26 Dec) —
//     ZAR 550.00 (Adult 18+). Single data point — no second Reserved Stand
//     price found/searched at another venue, so low=high (no real range).
// ZAR 550.00 = USD 33.35, rounded to whole dollars: USD 33.
//
// TIER3 (Premium Stand) — real hospitality/premium product, confirmed via
// the user's own screenshot of the live seat-map checkout widget 21 Jul
// 2026:
//   - Memorial Pavilion L3, Block MD (Wanderers, Johannesburg, 1st Test
//     Day 1, 17 Dec) — ZAR 3,448.85 (cart total, "All Ages" pricing).
//     Single data point — no second Premium Stand price found/searched at
//     another venue, so low=high (no real range).
// ZAR 3,448.85 = USD 209.14, rounded to whole dollars: USD 209.

const EVENT_ID = "c2bc1d6c-19ab-4d8c-9002-cb41d48a35de"; // England in South Africa 2026-27

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel:
      "General Admission (Johannesburg, Centurion, Bloemfontein — 17 Dec to 15 Jan; Cape Town Test and Paarl ODI sold out)",
    costLow: "6.00",
    costHigh: "13.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Castle Corner (SuperSport Park, Centurion, 2nd Test)",
    costLow: "33.00",
    costHigh: "33.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Memorial Pavilion (Wanderers, Johannesburg, 1st Test)",
    costLow: "209.00",
    costHigh: "209.00",
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
