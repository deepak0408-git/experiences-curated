import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Australia tour of South Africa 2026 (cricket),
// researched 21 Jul 2026 per the planner-data-researcher skill's Tickets
// methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, cricket):
// tier1 General Admission, tier2 Reserved Stand, tier3 Premium Stand.
// No tier4 — top tier is members-only and never seeded.
//
// SCOPE NOTE — one blended row for the whole 5-venue, 15-fixture tour, NOT
// per-city bands. DB schema keys planner_ticket_tier_cost on sportingEventId
// only, and the user confirmed 21 Jul 2026 the schema isn't built for
// per-city splits — the multi-city detail lives in this comment, not in
// separate rows.
//
// Source: tickets.cricket.co.za (official Cricket South Africa ticketing,
// Ticketpro-powered), section https://tickets.cricket.co.za/section/-s0se,
// confirmed against the user's own screenshots of the live site 21 Jul 2026.
// Real prices observed on-site in ZAR, converted to USD (the planner's
// universal display currency) at 1 ZAR = 0.06064 USD (Frankfurter API,
// rate date 2026-07-20, re-confirmed 21 Jul 2026). ZAR source figures kept
// in this comment for traceability; DB stores USD only.
//
// Fixtures in this tour's window (24 Sep - 30 Oct 2026):
//   ODI series (Dafabet ODI Series): Sep 24 Kingsmead/Durban, Sep 27
//   Wanderers/Johannesburg (Pink Day), Sep 30 NWC Oval/Potchefstroom.
//   Test series (Dafabet Test Series), 4 days each: Oct 9-12 Kingsmead/
//   Durban, Oct 18-21 St George's Park/Gqeberha, Oct 27-30 Newlands/
//   Cape Town.
//
// TIER1 (General Admission) — real "from" prices observed across all 3 ODIs
// + 12 Test days, all 5 venues: ZAR 50 (Kingsmead, both ODI and Test; lowest
// across the tour) to ZAR 245 (Newlands Test, all 4 days; Wanderers Test Day
// 1). Low/high = observed min/max across every fixture, not derived.
// ZAR 50-245 = USD 3.03-14.86, rounded to whole dollars per standing
// convention (all planner USD prices are whole numbers, confirmed 21 Jul
// 2026): USD 3-15.
//
// TIER2 (Reserved Stand) — NO real distinct mid-tier product found at any of
// the 5 venues researched: every venue's ticket structure jumps directly
// from General Admission to a Hospitality package, with nothing in between.
// Per the "never fabricate a missing tier" rule, this is NOT invented as a
// synthetic interpolation. Instead — per user decision 21 Jul 2026 — the
// getPlannerEvents.ts / getTradeoffOptions.ts default-tier lookups were
// fixed in code to fall back to the lowest available real tier (tier1) when
// tier2 doesn't exist, rather than seeding a fake tier2 row here. This event
// intentionally has NO tier2 row.
//
// TIER3 (Premium Stand) — real hospitality prices, all confirmed via the
// user's own screenshots of the live seat-map checkout widget 21 Jul 2026:
//   - West Deck Hospitality (Kingsmead, Durban) — ZAR 2,530.00. Same price
//     confirmed on both the Sep 24 ODI and Oct 9 Test Day 1 pages at this
//     venue — a fixed per-venue hospitality product, not match-specific.
//   - Kings Club (Kingsmead, Durban, Test only) — ZAR 4,025.00 (Block Kings
//     Club, Row A, South Gate).
//   - Full Hospitality (Wanderers, Johannesburg, Pink Day ODI only) —
//     ZAR 3,995 excl. VAT per person (includes match ticket, parking,
//     3-course meal, alcoholic/non-alcoholic beverages).
// Low/high = min/max of these 3 real products: ZAR 2,530-4,025.
// No hospitality product was found (or searched for, given diminishing
// returns) at NWC Oval, St George's Park, or Newlands — the tier3 range
// reflects only the venues where a real product was confirmed.
// ZAR 2,530-4,025 = USD 153.42-244.08, rounded to whole dollars: USD
// 153-244.

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // Australia in South Africa 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel:
      "General Admission (Durban, Johannesburg, Gqeberha, Cape Town, Potchefstroom — 24 Sep to 30 Oct)",
    costLow: "3.00",
    costHigh: "15.00",
  },
  {
    tier: "tier3",
    eventTierLabel:
      "Hospitality — West Deck / Kings Club (Kingsmead, Durban), Full Hospitality (Wanderers, Johannesburg, Pink Day ODI only)",
    costLow: "153.00",
    costHigh: "244.00",
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
