import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Border-Gavaskar Trophy 2027 ticket tier data — researched 9 Oct 2026 per
// planner-data-researcher skill's Tickets methodology (cricket section is a
// placeholder in the skill, so this follows the general methodology:
// real comparable-fixture prices, never a fabricated/AI-estimated figure).
//
// 2027 BCCI Test pricing has NOT been announced (confirmed via a Google AI
// Overview search, 9 Oct 2026, which explicitly stated this and offered
// only an unsourced synthesized estimate — rejected per the skill's
// never-fabricate rule). Instead, seeded from REAL historical ticket
// prices at the same 3 grounds, most recent comparable Test fixtures:
//   Nagpur (VCA Stadium) — 2023 India vs Australia Test (last Test there)
//   Chennai (Chepauk/MA Chidambaram) — Sep 2024 India vs Bangladesh Test
//   Ahmedabad (Narendra Modi Stadium) — recent Test/IPL comparable pricing
//     (genuine Test-specific data thinner here; corporate-box figures are
//     IPL-era but used as the closest real comparable for hospitality).
//
// REAL STAND NAMES (not generic tier labels) — researched 9 Oct 2026:
//   Nagpur (VCA): East Stand, West Stand (general); North Stand, South
//     Stand (reserved, higher tiers — North houses President's
//     Room/Commercial Box, South houses the players' pavilion)
//   Chennai (Chepauk): C/D/E Lower Stands (general); KMK Terrace
//     (elevated/reserved); MAC Stand (premium seating, per stadium-info
//     source); Corporate Hospitality Boxes (hospitality)
//   Ahmedabad (Narendra Modi): North/South/East/West Stand (general);
//     Club Pavilion (premium); Corporate Boxes, President's Gallery
//     (hospitality)
// Since the schema has no per-city ticket-tier dimension (one row per
// tier for the whole event — same constraint the NZ-Australia cricket
// precedent documents), each tier's label lists the real stand name(s)
// across all 3 grounds, grouped by city, rather than inventing one
// generic cross-venue name.
//
// Per-tier real sourced INR figures (2023/2024 baseline, before FX/
// inflation adjustment):
//   tier1: INR 200-500 (Nagpur East/West Ground; Chennai general/lower;
//     Ahmedabad general)
//   tier2: INR 1,000-3,000 (Nagpur North/South Ground; Chennai KMK
//     Terrace/mid-tier)
//   tier3: INR 4,000-6,000 (Ahmedabad premium; Chennai MAC Stand
//     inferred as this band, not confirmed against a specific price
//     point — real gap, flagged)
//   tier4: INR 10,000-35,000 (Chennai AC hospitality box; Ahmedabad
//     corporate hospitality). Nagpur's INR 125,000 Corporate Box
//     explicitly EXCLUDED — founder decision, 9 Oct 2026, judged a
//     different product class (a private box/suite rental, not a
//     per-seat hospitality ticket).
//
// FX: 1 INR = 0.01033 USD (Frankfurter API, rate date 2026-10-08, pulled
// live 9 Oct 2026).
// INFLATION ADJUSTMENT: +20% applied on top of the FX-converted figures,
// per founder instruction (9 Oct 2026) to account for the real price
// growth between the 2023/2024 source fixtures and the 2027 event —
// stated explicitly in eventTierLabel's footnote-style caveat (not
// hidden). Math:
//   tier1: INR 200-500 = USD 2.07-5.17 -> x1.2 = USD 2.48-6.21 -> USD 2-6
//   tier2: INR 1,000-3,000 = USD 10.33-30.99 -> x1.2 = USD 12.40-37.19 -> USD 12-37
//   tier3: INR 4,000-6,000 = USD 41.32-61.98 -> x1.2 = USD 49.58-74.38 -> USD 49-74
//   tier4: INR 10,000-35,000 = USD 103.30-361.55 -> x1.2 = USD 123.96-433.86 -> USD 124-434
//
// Baseline/inflation caveat moved OUT of eventTierLabel (was wrongly
// placed there in an earlier draft of this script, corrected 9 Oct 2026
// per founder feedback — eventTierLabel is the real tier/stand NAME shown
// to the user, not a sourcing footnote) — the caveat instead belongs in
// the Cost spoke's one-time footnote text alongside the existing
// KNOWN_LOCAL_TICKET_PRICES caption, not repeated on every tier card.

const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd"; // Border-Gavaskar Trophy 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "East Stand, West Stand (Nagpur) · C/D/E Lower Stands (Chennai) · North/South Stand (Ahmedabad) — 1-day",
    costLow: "2.00",
    costHigh: "6.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "North Stand, South Stand (Nagpur) · KMK Terrace (Chennai) · East/West Stand (Ahmedabad) — 1-day",
    costLow: "12.00",
    costHigh: "37.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "MAC Stand (Chennai) · Club Pavilion (Ahmedabad) — 1-day",
    costLow: "49.00",
    costHigh: "74.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Corporate Hospitality Boxes (Chennai) · Corporate Boxes, President's Gallery (Ahmedabad) — 1-day",
    costLow: "124.00",
    costHigh: "434.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, edition_year, cost_low, cost_high, currency)
    VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${EDITION_YEAR}, ${t.costLow}, ${t.costHigh}, 'USD')
    ON CONFLICT (sporting_event_id, tier, edition_year) DO UPDATE SET
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
  SELECT tier, event_tier_label, cost_low, cost_high, currency, edition_year
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
