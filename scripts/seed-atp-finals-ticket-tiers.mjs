import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Nitto ATP Finals 2026 (Turin), researched
// 22 Jul 2026 per the planner-data-researcher skill's Tickets methodology.
//
// SOURCE: official tickets.nittoatpfinals.com -- fetched with a real
// browser User-Agent, 200 status, no bot-block. Full price table + Premium
// Hospitality page both publicly listed with real, distinct prices --
// no scraping issues.
//
// STRUCTURE: this is a week-long round-robin group stage (Sun 15 - Fri 20
// Nov) followed by a single Final (Sun 22 Nov) priced ~4-6x higher than a
// normal group day. Unlike F1's single race day, there's no one "peak day"
// representative of what most fans buy -- user decision 22 Jul 2026: use
// a representative MID-WEEK GROUP-STAGE day (Tue 17 Nov, Night session)
// as the reference session for all 4 tiers, rather than the Final, to
// avoid making every tier read as unrealistically expensive for what most
// attendees actually pay to watch round-robin matches. This choice is
// stated explicitly in every eventTierLabel per the hard rule that a
// non-default reference day must be visible in the label itself.
//
// TIER MAPPING: the venue has 9 real standard-ticket sections (not 4) --
// mapped to tier1-3 by the venue's own real seating-category names
// (Galleria / Platea 2 / Platea 1), not an arbitrary price cut, per user
// decision. Parterre (the single most expensive standard section, above
// both Platea 1 sections) grouped into tier3 with Platea 1 rather than
// given its own tier, keeping tier4 reserved purely for the 3 Premium
// Hospitality packages (Break/Smash/Ace) -- same pattern as F1's tier4
// being hospitality-only.
//
// CURRENCY: EUR -> USD, 1 EUR = 1.1418 USD (21 Jul 2026 Frankfurter rate).
// See feedback_planner_seeds_usd_only.md.

const SPORTING_EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50"; // Nitto ATP Finals 2026

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Tribuna Galleria (Tue Night, group stage)",
    costLow: "137.00",
    costHigh: "185.00",
    note: "All 4 Galleria sections at Tue 17/11 Night: Tribuna Nord/Sud Galleria 1 (EUR162), Tribuna Ovest/Est Galleria 1 (EUR150), Tribuna Nord/Sud Galleria 2 (EUR144), Tribuna Ovest/Est Galleria 2 (EUR120).",
  },
  {
    tier: "tier2",
    eventTierLabel: "Tribuna Platea 2 (Tue Night, group stage)",
    costLow: "267.00",
    costHigh: "295.00",
    note: "Both Platea 2 sections at Tue 17/11 Night: Tribuna Nord/Sud Platea 2 (EUR258), Tribuna Ovest/Est Platea 2 (EUR234).",
  },
  {
    tier: "tier3",
    eventTierLabel: "Tribuna Platea 1 / Parterre (Tue Night, group stage)",
    costLow: "322.00",
    costHigh: "397.00",
    note: "Both Platea 1 sections + Parterre at Tue 17/11 Night: Tribuna Nord/Sud Platea 1 (EUR312), Tribuna Ovest/Est Platea 1 (EUR282), Parterre (EUR348, the single most expensive standard-ticket section -- grouped here by user decision rather than given its own tier).",
  },
  {
    tier: "tier4",
    eventTierLabel: "Premium Hospitality — Break/Smash/Ace (Tue Night, group stage)",
    costLow: "618.00",
    costHigh: "1560.00",
    note: "All 3 official Premium Hospitality packages at Tue 17/11 Night: Break (EUR541), Smash (EUR1071), Ace (EUR1366).",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high)
    VALUES (${SPORTING_EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${SPORTING_EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
