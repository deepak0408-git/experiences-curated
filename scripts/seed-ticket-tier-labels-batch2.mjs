import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Resolves remaining NULL eventTierLabel gaps flagged by user 19 Jul 2026 —
// test data must have every non-general tier labeled to be usable for
// testing. Abu Dhabi's 3 tiers confirmed with real names via research.
// Italian GP tier3: Monza has no officially-branded "premium grandstand"
// product (confirmed via 3 sources), but user made an editorial call —
// Grandstand 1 Centrale / Grandstand 6 Velocità (~€1,000-1,344) are ~1.5-2x
// the mid-tier stands (~€669-899), a real enough price gap to justify
// calling them tier3 for now. Production data treatment TBD later.
const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const ABU_DHABI_GP_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8";

const EVENT_OVERRIDES = [
  { eventId: ITALIAN_GP_ID, tier: "tier3", label: "Grandstand 1 (Centrale), Grandstand 6 (Velocità)" },

  { eventId: ABU_DHABI_GP_ID, tier: "tier1", label: "Abu Dhabi Hill" },
  { eventId: ABU_DHABI_GP_ID, tier: "tier2", label: "Grandstand West, North, South, Main, Marina" },
  { eventId: ABU_DHABI_GP_ID, tier: "tier4", label: "Yas Suites, Champions Club, F1 Paddock Club" },
];

for (const o of EVENT_OVERRIDES) {
  await sql`
    UPDATE planner_ticket_tier_cost
    SET event_tier_label = ${o.label}
    WHERE sporting_event_id = ${o.eventId} AND tier = ${o.tier}
  `;
}
console.log(`✓ Seeded ${EVENT_OVERRIDES.length} additional event-level tier label overrides`);

await sql.end();
