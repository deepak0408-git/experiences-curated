import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// planner_ticket_tier_cost PLACEHOLDER seed for Monaco Grand Prix 2027
// (Circuit de Monaco) — Ticket Intelligence prerequisite.
//
// COST IS INTENTIONALLY 0.00-0.00 FOR ALL 4 TIERS. Real 2027 Monaco pricing
// is genuinely unpublished anywhere as of 30 Sep 2026 (confirmed directly
// against ticketing.formula1.com/monaco/, gpticketshop.com's live tickets
// page, and a freshly-generated 30 Sep 2026 gpticketshop.com PDF price list
// that shows the full circuit map but no prices at all — official channel
// is not yet on sale). Per founder instruction (30 Sep 2026): seed these 4
// rows with 0.00-0.00 purely to get real row IDs that
// circuit_seating_profile.ticketTierCostId can link against now — this is
// NOT real pricing data and must never be treated as such or displayed to a
// fan. Real, sourced figures must be seeded here (replacing these 0.00 rows
// via the same ON CONFLICT upsert) before this event's Ticket Intelligence
// page is considered launch-ready — see §4c item 13 of the
// ticket-intelligence-researcher skill.
//
// Qualitative tier grouping (1-5 star, collapsed to 4 DB tiers per founder
// instruction 30 Sep 2026: 1*=tier1, 2*=tier2, 3*=tier3, 4*+5*=tier4) —
// see seed-monaco-gp-circuit-seating.mjs for the full per-seat sourcing
// and rationale behind this grouping.
//
// Researched/seeded 30 Sep 2026.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "14a2fa08-14f4-406d-a6df-5d00ad7998a6"; // Monaco Grand Prix 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission — Secteur Rocher, Zone Z1, Grandstand X1, Grandstand X2 (PLACEHOLDER, no real pricing published yet)",
    costLow: "0.00",
    costHigh: "0.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand N, O, P, L, T, V, K (PLACEHOLDER, no real pricing published yet)",
    costLow: "0.00",
    costHigh: "0.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Grandstand K1/K2 Gold, E, A, B (PLACEHOLDER, no real pricing published yet)",
    costLow: "0.00",
    costHigh: "0.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "VIP Terraces, Caravelles, Yacht Experience, F1 Paddock Club/Champions Club (PLACEHOLDER, no real pricing published yet)",
    costLow: "0.00",
    costHigh: "0.00",
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
    RETURNING id, tier, event_tier_label
  `;
  console.log(`✓ ${result[0].tier}: ${result[0].id}`);
}

const rows = await sql`
  SELECT id, tier, event_tier_label, cost_low, cost_high, currency
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
