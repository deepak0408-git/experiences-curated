import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// planner_ticket_tier_cost seed for Miami GP 2027 (Miami International
// Autodrome). Real 3-day-package prices sourced directly from the official
// local promoter's live 2027 ticketing site (f1miamigp.com/tickets/*),
// cross-checked against f1miamiusa.com's per-stand pages and independent
// grandstand guides (grandprixgrandtours.com, oversteer48.com). Researched
// 28 Sep 2026. Tier bands and seat groupings confirmed directly with the
// founder before seeding — not derived unilaterally.
//
// tier1 (general_admission): Campus Pass (GA) — $650
// tier2 (grandstand): Marina, North Beach, South Beach, Grandstand Pass —
//   $700-$845
// tier3 (premium_grandstand): Start/Finish, Turn 1 North, Turn 18 — $935-$1,125
// tier4 (hospitality): MSC Yacht Club, 72 Club, Turn 18 Club, Hard Rock
//   Beach Club Deck, Paddock Club — $4,250-$16,500 (founder-confirmed range,
//   spans the real hospitality-product floor to ceiling; Hard Rock Beach
//   Club Deck's $1,500 sits below this band by design — see
//   circuit_seating_profile seed script header for why).
//
// Excluded from inventory entirely (see circuit_seating_profile seed
// script for full reasoning): 8 F1 Team Grandstands (same physical seat as
// their host stand, just team-branded) and Precision Drive Club (100-member
// annual driving club, not a per-race-weekend ticket product).

const EVENT_ID = "048d7693-b616-4747-ab3c-49b3de61a025"; // Miami GP 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Campus Pass (GA)",
    costLow: "650.00",
    costHigh: "650.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Marina Grandstand, North Beach Grandstand, South Beach Grandstand, Grandstand Pass",
    costLow: "700.00",
    costHigh: "845.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Start/Finish Grandstand, Turn 1 North Grandstand, Turn 18 Grandstand",
    costLow: "935.00",
    costHigh: "1125.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "MSC Yacht Club, 72 Club, Turn 18 Club, Hard Rock Beach Club Deck, Paddock Club",
    costLow: "4250.00",
    costHigh: "16500.00",
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
