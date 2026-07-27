import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Alfred Dunhill Links Championship 2026 (golf),
// researched 21 Jul 2026 per the planner-data-researcher skill's Tickets
// methodology.
//
// Sport-level tier vocabulary (planner_ticket_tier_sport_label, golf):
// tier1 General Admission, tier2 Ticket Plus, tier3 Premium, tier4
// Hospitality.
//
// STRUCTURAL FINDING — genuinely different shape than every other event
// seeded this session, confirmed via the official site's own copy
// (alfreddunhilllinks.com/tickets/, fetched 21 Jul 2026): entry is FREE
// Thursday-Saturday across all three courses (St Andrews, Carnoustie,
// Kingsbarns) — "Tickets are not needed for Thursday to Saturday, across
// all three courses." A paid ticket is required ONLY for Sunday's final
// round at the Old Course, St Andrews. This matches the golf placeholder
// noted in the planner-data-researcher skill before this event was
// actually researched: "some golf events are largely free entry with only
// specific days/rounds requiring a paid ticket."
//
// Only ONE real price point exists — a single flat Sunday final-round
// ticket, confirmed by the user via their own screenshot of the official
// purchase flow 21 Jul 2026 (SeeTickets, the official ticketing platform
// linked directly from alfreddunhilllinks.com/tickets/ — automated fetch
// of the SeeTickets page itself was blocked by a genuine "Unusual Traffic
// Detected" anti-bot wall, so this was user-confirmed, not automated).
//
// TIER1 (General Admission) — Sunday final round, Old Course, St Andrews:
// £21.20 = USD 28.54 (1 GBP = 1.346 USD, Frankfurter API, rate date
// 2026-07-20), rounded to whole dollars per standing convention: USD 29.
//
// TIER2-4 — NOT seeded. No real distinct product exists at any price point
// beyond this single Sunday ticket — per the "never fabricate a missing
// tier" rule, this is an honest omission, not a gap to fill. The code-level
// fallback added to getPlannerEvents.ts / getTradeoffOptions.ts (21 Jul
// 2026, originally for Australia-in-South-Africa's missing tier2) handles
// this automatically: Screen 2's default-tier lookup falls through to
// tier1 when tier2 doesn't exist for this event.

const EVENT_ID = "ecda0640-72bb-47bc-a8da-02eb2d1d5646"; // Alfred Dunhill Links Championship 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (Sunday Final Round, Old Course, St Andrews — free entry Thu-Sat all three courses)",
    costLow: "29.00",
    costHigh: "29.00",
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
