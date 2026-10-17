import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// planner_ticket_tier_cost seed for Madring (Spanish GP 2027) — Madring is
// a brand-new circuit (debuted 2026), so no planner_ticket_tier_cost rows
// existed at all before this seed (unlike every prior Ticket Intelligence
// build, which started from an existing tier anchor). Researched 17 Oct
// 2026 directly from founder-supplied screenshots (Fever's official Madring
// grandstand sales page, F1 Experiences' 2027-spanish-grand-prix hospitality
// packages) plus independent web research for General Admission (Pelouse)
// and circuit/turn detail (madring.com/en/circuit, ticketsf1.madring.com).
//
// All Madring tickets are 3-DAY PASSES ONLY (Fri-Sun) — confirmed via
// ticketsf1.madring.com's own FAQ ("tickets are only available as a 3-day
// pass"); no single-day product exists for any tier. event_tier_label
// states "3-day" explicitly on every row per founder correction.
//
// Currency: all figures converted to USD (pack_currency = USD for this
// event) at approx 1 EUR = 1.08 USD, 17 Oct 2026. Fever prices are native
// EUR; F1 Experiences' Champions Club prices were already native USD.
//
// tier1 (General Admission / Pelouse): LOWER confidence — no 2027 price
// published yet (Madring's 2027 general sale opened 29 Sep 2026 but no
// Pelouse-specific figure was found live). Used the confirmed 2026 pattern
// (€195 early bird -> €345 current release, avg €278) as a placeholder,
// per founder direction 17 Oct 2026 — flagged for re-verification once a
// real 2027 Pelouse price is published. Location confirmed independently:
// open viewing field between Turn 14 and Turn 15, beside the Distrito Fan
// Zone (gpdestinations.com cross-referenced against a second aggregator).
//
// tier2/tier3 (Bronze/Silver grandstands): HIGH confidence — exact current
// 2027 prices from Fever's live Madring sales page (founder screenshots,
// 17 Oct 2026).
//
// tier4 (Hospitality): Champions Club 3-Day is HIGH confidence (f1experiences.com/
// 2027-spanish-grand-prix, founder screenshots). Paddock Club has no
// Madring-specific page — only a 2026 Barcelona-circuit reference price
// (EUR 6,999, different circuit, different year) was found; used for
// ordinal top-tier placement only, LOWER confidence, per founder direction
// 17 Oct 2026 — re-verify once Madring's own Paddock Club page goes live.
// Starter / F1 Experiences Live / Podium Club hospitality upsell products
// deliberately EXCLUDED per founder direction 17 Oct 2026 — these are
// grandstand-seat hospitality upsells, not standalone hospitality products,
// and don't belong in the hospitality tier.

const EVENT_ID = "0738c013-2644-4784-825f-d112ec603825"; // Spanish GP 2027
const EDITION_YEAR = 2027;
const CURRENCY = "USD";

const TIERS = [
  {
    tier: "tier1",
    costLow: "211.00",
    costHigh: "373.00",
    eventTierLabel: "General Admission (Pelouse), 3-day",
  },
  {
    tier: "tier2",
    costLow: "470.00",
    costHigh: "632.00",
    eventTierLabel:
      "Straight 3 Bronze, Turn 4A Bronze, Turn 14A/14B Bronze, Turn 15 Bronze (Grandstand, 3-day)",
  },
  {
    tier: "tier3",
    costLow: "585.00",
    costHigh: "1377.00",
    eventTierLabel:
      "Turn 10 Silver, Straight 13A Silver, Monumental 12B/12C Silver, Main Straight 1A/1B/1C Gold (Premium Grandstand, 3-day)",
  },
  {
    tier: "tier4",
    costLow: "5399.00",
    costHigh: "7559.00",
    eventTierLabel: "Champions Club 3-Day, Paddock Club (Hospitality, 3-day)",
  },
];

// No unique constraint exists on (sporting_event_id, tier, edition_year) in
// this table, so this script is idempotent by deleting its own prior rows
// for this one event+edition before re-inserting, rather than relying on
// ON CONFLICT. Scoped tightly to EVENT_ID + EDITION_YEAR only — never a
// broader delete.
await sql`
  DELETE FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID} AND edition_year = ${EDITION_YEAR}
`;

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost
      (sporting_event_id, tier, cost_low, cost_high, event_tier_label, currency, edition_year, last_updated)
    VALUES
      (${EVENT_ID}, ${t.tier}, ${t.costLow}, ${t.costHigh}, ${t.eventTierLabel}, ${CURRENCY}, ${EDITION_YEAR}, NOW())
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, cost_low, cost_high, event_tier_label, currency, edition_year
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
