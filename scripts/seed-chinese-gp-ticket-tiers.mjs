import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerTicketTierCost } from "../schema/database.ts";

// Chinese Grand Prix 2027 (Shanghai International Circuit) ticket tier cost
// seeding. Prices supplied and pre-verified directly by the curator, 23 Sep
// 2026 — these are real 2026 Chinese GP prices (2027 tickets are not yet on
// sale), used as the best available real proxy per the same principle the
// skill applies to a sold-out/unavailable day substitution: use the closest
// real, currently-verifiable price rather than wait or fabricate. editionYear
// is set to 2026 (the real year this pricing belongs to), NOT this event
// row's own editionYear (2027) — same reasoning as the Italian GP rollover
// fix (see project_planner_cost_edition_year_migration memory). Re-verify
// and re-seed with editionYear 2027 once real 2027 pricing goes on sale.

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027
const EDITION_YEAR = 2026; // real year this pricing belongs to, per curator

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (Zones C, F, J, L) — 3-Day (2026 pricing)",
    costLow: "67.00",
    costHigh: "67.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand E, H, K — 3-Day (2026 pricing)",
    costLow: "224.00",
    costHigh: "238.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Grandstand A, B — 3-Day (2026 pricing)",
    costLow: "309.00",
    costHigh: "464.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "F1 Paddock Club — 3-Day (2026 pricing)",
    costLow: "17145.00",
    costHigh: "17145.00",
  },
];

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const values = TIERS.map((t) => ({
  sportingEventId: EVENT_ID,
  tier: t.tier,
  eventTierLabel: t.eventTierLabel,
  editionYear: EDITION_YEAR,
  costLow: t.costLow,
  costHigh: t.costHigh,
  currency: "USD",
}));

await db.insert(plannerTicketTierCost).values(values).onConflictDoNothing();

console.log(`Seeded ${values.length} planner_ticket_tier_cost rows for Chinese GP 2027 (editionYear ${EDITION_YEAR} pricing).`);
await client.end();
