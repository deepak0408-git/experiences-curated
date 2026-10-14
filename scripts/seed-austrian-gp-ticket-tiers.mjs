import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// planner_ticket_tier_cost seed for Austrian Grand Prix 2027 (Spielberg,
// Red Bull Ring) — Ticket Intelligence prerequisite.
//
// SOURCING: tier1-3 anchored to tickets.redbullring.com (official circuit
// ticketing site, 2027 event page) real weekend grandstand prices, EUR→USD
// at ~1.08. Red Bull B and Red Bull J/K are sold out on the official
// circuit site but still sold as bundled multi-day packages via
// f1experiences.com (2027 Austrian GP packages) — their ordinal placement
// is LOWER confidence since the bare single-stand price isn't independently
// confirmed, only inferred from a bundled "Starter"-tier package price.
//
// Tier4 (hospitality): Champions Club 3-Days priced directly from
// f1experiences.com's 2027 Austrian GP page ($4,919, HIGH confidence).
// F1 Paddock Club's real 2027 price is NOT published anywhere — the
// official F1 ticketing hospitality page is waitlist-only ("full details
// on available packages will be announced soon"). The $6,500 ceiling is an
// UNCONFIRMED ESTIMATE (founder direction, 14 Oct 2026) scaled above
// Champions Club's confirmed $4,919, pending real 2027 Paddock Club
// pricing release — re-verify and replace once published.
//
// Researched 14 Oct 2026.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "5ef66790-1609-4969-8c20-46f3d9d796a6"; // Austrian GP 2027
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission",
    costLow: "185.00",
    costHigh: "220.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Red Bull F/G/H/I, Red Bull C/D/E, Red Bull J/K, Turn 10",
    costLow: "350.00",
    costHigh: "480.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Turn 3, Start-Ziel, Steiermark, Red Bull B",
    costLow: "480.00",
    costHigh: "790.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "Champions Club, F1 Paddock Club",
    costLow: "4919.00",
    costHigh: "6500.00",
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
