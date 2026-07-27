import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Sport-level default tier labels — confirmed 19 Jul 2026. F1's 4-tier
// structure (GA/Grandstand/Premium Grandstand/Hospitality) verified real
// via 5-circuit research (Belgian/Hungarian/Las Vegas/Singapore/Abu Dhabi)
// plus actual price-ladder confirmation at Spa (Bronze<Silver<Gold<Hospitality,
// non-overlapping, real prices). Tennis/Golf/Cricket confirmed earlier same
// session from real official ticketing sources (see design doc).
const SPORT_DEFAULTS = [
  { sport: "formula_one", tier: "tier1", label: "General Admission" },
  { sport: "formula_one", tier: "tier2", label: "Grandstand" },
  { sport: "formula_one", tier: "tier3", label: "Premium Grandstand" },
  { sport: "formula_one", tier: "tier4", label: "Hospitality" },

  { sport: "tennis", tier: "tier1", label: "Grounds Pass" },
  { sport: "tennis", tier: "tier2", label: "Outer Court Reserved" },
  { sport: "tennis", tier: "tier3", label: "Show Court Reserved" },
  { sport: "tennis", tier: "tier4", label: "Suite" },

  { sport: "golf", tier: "tier1", label: "General Admission" },
  { sport: "golf", tier: "tier2", label: "Ticket Plus" },
  { sport: "golf", tier: "tier3", label: "Premium" },
  { sport: "golf", tier: "tier4", label: "Hospitality" },

  { sport: "cricket", tier: "tier1", label: "General Admission" },
  { sport: "cricket", tier: "tier2", label: "Reserved Stand" },
  { sport: "cricket", tier: "tier3", label: "Premium Stand" },
  // No tier4 for cricket — top tier is typically members-only (e.g. Lord's
  // Pavilion, MCC), not publicly purchasable. Omitted per eligibility rule.
];

for (const d of SPORT_DEFAULTS) {
  await sql`
    INSERT INTO planner_ticket_tier_sport_label (sport, tier_key, default_label)
    VALUES (${d.sport}, ${d.tier}, ${d.label})
    ON CONFLICT (sport, tier_key) DO UPDATE SET default_label = ${d.label}
  `;
}
console.log(`✓ Seeded ${SPORT_DEFAULTS.length} sport-level default tier labels`);

// Event-level eventTierLabel overrides — real researched names, test data
// only (existing placeholder prices left untouched; production pricing
// research deferred). Confirmed with user 19 Jul 2026.
const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const ABU_DHABI_GP_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8";

const EVENT_OVERRIDES = [
  // Belgian GP — real Spa category names, verified with live price data
  { eventId: BELGIAN_GP_ID, tier: "tier1", label: "Bronze" },
  { eventId: BELGIAN_GP_ID, tier: "tier2", label: "Silver" },
  { eventId: BELGIAN_GP_ID, tier: "tier3", label: "Gold" },
  { eventId: BELGIAN_GP_ID, tier: "tier4", label: "Hospitality (Loge / Champions Club / Paddock Club)" },

  // Italian GP — real published pack experience names. tier3 stays null,
  // no distinct premium-grandstand content exists in the pack yet.
  { eventId: ITALIAN_GP_ID, tier: "tier1", label: "Curva Grande" },
  { eventId: ITALIAN_GP_ID, tier: "tier2", label: "Grandstand 22, Grandstand 26" },
  { eventId: ITALIAN_GP_ID, tier: "tier4", label: "Paddock Club & Champions Club" },

  // Abu Dhabi GP — only tier3 has a confirmed real name (West Premium);
  // tier1/2/4 stay on the F1 sport default for now (not yet researched).
  { eventId: ABU_DHABI_GP_ID, tier: "tier3", label: "West Premium" },
];

for (const o of EVENT_OVERRIDES) {
  await sql`
    UPDATE planner_ticket_tier_cost
    SET event_tier_label = ${o.label}
    WHERE sporting_event_id = ${o.eventId} AND tier = ${o.tier}
  `;
}
console.log(`✓ Seeded ${EVENT_OVERRIDES.length} event-level tier label overrides`);

await sql.end();
