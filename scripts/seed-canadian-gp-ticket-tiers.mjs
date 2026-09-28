import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// planner_ticket_tier_cost seed for Canadian Grand Prix 2027 (Montreal,
// Circuit Gilles Villeneuve) — Ticket Intelligence prerequisite.
//
// IMPORTANT CAVEAT: the official F1/gpcanada.ca 2027 ticketing channel is
// currently WAITLIST-ONLY — no real 2027 prices are published anywhere.
// Every figure below is derived from a single unverified secondary source
// (a Google AI Mode search summary, no primary URL/citation available,
// screenshotted by the founder 28 Sep 2026) showing 2026-edition USD
// figures. Per founder direction (28 Sep 2026): these are used PURELY as a
// relative ordinal signal to bucket seats into tier1-4 — never displayed to
// a fan as a real number (CostStars in FullResult.tsx only ever shows a
// star-rank derived from tier, never costLow/costHigh directly). Re-verify
// and replace with real 2027 primary-sourced figures once gpcanada.ca
// actually publishes 2027 pricing.
//
// Tier labels get "; 3-day" appended for every grandstand/hospitality tier
// per founder instruction (28 Sep 2026) — every grandstand and hospitality
// product confirmed 3-day-ticket-only (no single-day option found anywhere
// in research). General Admission is also 3-day only but its own label
// doesn't need the grandstand-specific suffix.
//
// Researched 28 Sep 2026.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "f054e849-849e-44a2-85c2-d150d973e1bf"; // Canadian GP 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission",
    costLow: "300.00",
    costHigh: "300.00",
  },
  {
    tier: "tier2",
    eventTierLabel:
      "Grandstand 47, 46, Family (33), 31, 34, 16, 21, 15, Lance Stroll (24); 3-day",
    costLow: "375.00",
    costHigh: "750.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Grandstand 11, 12, 1, Platine; 3-day",
    costLow: "777.00",
    costHigh: "1345.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Champions Club, F1 Paddock Club; 3-day",
    costLow: "4800.00",
    costHigh: "9800.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost
      (sporting_event_id, tier, event_tier_label, edition_year, cost_low, cost_high, currency)
    VALUES
      (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${EDITION_YEAR}, ${t.costLow}, ${t.costHigh}, 'USD')
    ON CONFLICT (sporting_event_id, tier, edition_year) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      last_updated = NOW()
    RETURNING tier, event_tier_label
  `;
  console.log(`✓ ${result[0].tier}: ${result[0].event_tier_label}`);
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
