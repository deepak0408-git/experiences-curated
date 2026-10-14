import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// planner_ticket_tier_cost seed for Belgian GP 2026 (Spa-Francorchamps),
// built for the Ticket Intelligence app. Researched 12 Oct 2026 directly
// against the circuit's own official ticketing site (spagrandprix.com),
// cross-referenced with the circuit's own "Where to sit" article
// (spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique) for
// location, and founder-supplied live weekend (3-day) screenshots from
// spagrandprix.com/en/billetterie confirming every price used here.
//
// All prices are real, 3-day weekend adult tickets as priced on the
// official site at research time. EUR converted to USD at 1 EUR = 1.12 USD
// (approx. mid-Oct 2026 spot rate) — ordinal/comparison use only, per
// circuit_seating_profile's own "never display $ to the fan" rule (scoring
// uses relative tier rank, not these numbers directly). Tier boundaries are
// founder-set (12 Oct 2026): tier1 $215-347, tier2 $380-599 (widened from
// an initial $380-549 to absorb Combes 2/3, Silver 4, Fanzone Grandstand —
// all real prices landing in the $549-599 gap), tier3 $610-1,171, tier4
// $2,195-5,500 (hospitality; VIP — Ardennes Club/Paddock Club/Champions
// Club prices were shown in USD directly on the official site, not
// converted from EUR).
const EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e"; // Belgian Grand Prix 2026

// No unique constraint exists on (sporting_event_id, tier, edition_year) at
// the DB level (checked 12 Oct 2026 — only a primary key on id) — this
// script deletes-then-inserts per (event, edition_year) instead of
// ON CONFLICT, to stay idempotent on re-run without relying on a
// constraint that isn't there.
//
// Seeded for edition_year 2026 (the real, live event row) AND 2027, per
// founder instruction (12 Oct 2026) — the 2027 Belgian GP calendar date
// isn't finalized yet and has no event row of its own (see conversation:
// 2027 will get its own row later via the evergreen-slug migration,
// following the US Open 2027 pattern). Same real sourced prices applied to
// both years since the 2026 pricing is the only real data available.
const EDITION_YEARS = [2026, 2027];

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Bronze General Admission, 3-day",
    costLow: "215.00",
    costHigh: "347.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Silver Grandstand, 3-day",
    costLow: "380.00",
    costHigh: "599.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Gold Grandstand, 3-day",
    costLow: "610.00",
    costHigh: "1171.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Hospitality, 3-day",
    costLow: "2195.00",
    costHigh: "5500.00",
  },
];

for (const editionYear of EDITION_YEARS) {
  for (const t of TIERS) {
    await sql`
      DELETE FROM planner_ticket_tier_cost
      WHERE sporting_event_id = ${EVENT_ID} AND tier = ${t.tier} AND edition_year = ${editionYear}
    `;
    const result = await sql`
      INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high, currency, edition_year)
      VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh}, 'USD', ${editionYear})
      RETURNING tier, edition_year
    `;
    console.log(`✓ ${result[0].tier} (${result[0].edition_year}) seeded`);
  }
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high, currency, edition_year
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY edition_year, tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
