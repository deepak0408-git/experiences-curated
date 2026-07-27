import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for BMW PGA Championship 2026 (golf), researched
// 21 Jul 2026 per the planner-data-researcher skill's Tickets methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, golf):
// tier1 General Admission, tier2 Ticket Plus, tier3 Premium, tier4
// Hospitality.
//
// Source: europeantour.com official DP World Tour ticketing page
// (https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/),
// screenshotted directly by the user 21 Jul 2026 after the page returned an
// Akamai WAF "Access Denied" block to both curl and Playwright automation
// (a harder bot-detection wall than tickets.formula1.com — held even with a
// realistic browser User-Agent). Wentworth Club's own site had no working
// direct tickets page (404). Resale/aggregator sources found in web search
// (StubHub, SeatUnique, TicketPort, mitickets) were explicitly excluded per
// the standing "never resale/aggregator" sourcing rule, despite surfacing
// real-looking prices.
//
// Real prices observed in GBP, converted to USD (the planner's universal
// display currency) at 1 GBP = 1.346 USD (Frankfurter API, rate date
// 2026-07-20, re-confirmed 21 Jul 2026). GBP source figures kept in this
// comment for traceability; DB stores USD only.
//
// Event dates: 15-20 Sep 2026, Wentworth Club, Surrey (per CLAUDE.md —
// Wentworth is fully private, no public course access outside this event).
//
// Full real product list (6 distinct named products, all "From" prices):
//   General Admission            £30
//   Treetops (presented by Buffalo Trace, formerly "Ticket+")  £155
//   72 Lounge                    £308
//   72 Signature Lounge (new for 2026)  £405
//   The Approach (by James Tanner)      £450
//   The Ballroom                 £460
//   Green on 18 (prestige offering, Championship Pavilion)  £625
//
// TIER1 (General Admission) — £30 = USD 40.38, rounded to whole dollars
// per standing convention (all planner USD prices are whole numbers,
// confirmed 21 Jul 2026): USD 40.
//
// TIER2 (Ticket Plus) — Treetops, £155 = USD 208.63, rounded: USD 209.
// Treetops is explicitly
// the current name for what was formerly badged "Ticket+" on this tour,
// confirmed via the page's own copy.
//
// TIER3 (Premium) — 4 real products clustered together as one tier per the
// user's approval 21 Jul 2026: 72 Lounge (£308), 72 Signature Lounge (£405),
// The Approach (£450), The Ballroom (£460). Low/high = min/max of these 4:
// £308-460 = USD 414.57-619.16, rounded: USD 415-619. This is a wide
// range for one tier — an
// honest outcome of mapping 4 genuinely distinct real products together,
// not a forced narrow cut.
//
// TIER4 (Hospitality) — Green on 18, £625 = USD 841.25, rounded: USD 841.
// The standalone
// "prestige offering," clearly positioned above tier3 by the page's own
// copy and price.

const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b"; // BMW PGA Championship 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission",
    costLow: "40.00",
    costHigh: "40.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Treetops presented by Buffalo Trace (Ticket+)",
    costLow: "209.00",
    costHigh: "209.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Premium — 72 Lounge, 72 Signature Lounge, The Approach, The Ballroom",
    costLow: "415.00",
    costHigh: "619.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Green on 18 (Championship Pavilion)",
    costLow: "841.00",
    costHigh: "841.00",
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
