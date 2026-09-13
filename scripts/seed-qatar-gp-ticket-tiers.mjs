import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Qatar GP 2026, researched 13 Sep 2026 per the
// planner-data-researcher skill's Tickets methodology (F1 section).
// Sources:
// - tickets.formula1.com/en/f1-56257-qatar (live screenshot from the
//   founder, 13 Sep 2026, showing the real "Sort By: High to Low Price"
//   product list — 7 Options Available: Champions Club, Lusail Hill
//   (hospitality), Main Grandstand, North Grandstand, T16 Grandstand, T2
//   Grandstand (sold out), and presumably T3/others below the fold).
//   All prices shown in EUR, 3-day (Fri-Sun) packages.
// - General Admission (Lusail Hill standard product, distinct from the
//   "Lusail Hill" hospitality-club product of the same name shown on the
//   official ticket page) is NOT listed as a live purchasable product on
//   the official site as of 13 Sep 2026 (confirmed sold out/delisted, see
//   scripts/seed-qatar-22-lusail-hill-ga.mjs's editorialNote). The
//   EUR 189-229 range is the founder's own recalled figure, not sourced
//   from today's live official page — flagged and seeded anyway on
//   explicit founder instruction, distinct from an independently
//   fabricated guess.
// FX: EUR -> USD via Frankfurter (api.frankfurter.app), live rate 1.1592,
// pulled 13 Sep 2026 (most recent available date: 11 Sep 2026). Rounded to
// whole dollars per skill methodology.
// Tier boundaries and grouping (tier3 = North + Main; tier4 = Lusail Hill
// Lounge + Champions Club) approved by the founder 13 Sep 2026. Label
// corrected 13 Sep 2026: "Lusail Hill Hospitality" -> "Lusail Hill Lounge"
// to match the real seeded experience name (qatar-gp-lusail-hill-lounge-).

const EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899"; // Qatar Grand Prix 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (Lusail Hill), 3-day",
    costLow: "219.00",
    costHigh: "265.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "T16 Grandstand, 3-day",
    costLow: "330.00",
    costHigh: "330.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "North Grandstand, Main Grandstand, 3-day",
    costLow: "495.00",
    costHigh: "659.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Lusail Hill Lounge, Champions Club, 3-day",
    costLow: "3896.00",
    costHigh: "7093.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high, currency)
    VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh}, 'USD')
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      currency = EXCLUDED.currency,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high, currency
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
