// getSpokeData() (app/event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData.ts)
// filters plannerTicketTierCost strictly on event.editionYear (2027 for
// Chinese GP) — see project_planner_cost_edition_year_migration memory.
// The 4 ticket tier rows seeded 23 Sep 2026 were written with
// editionYear: 2026, matching the pricing SOURCE year, not the event page
// they serve — that's the wrong column for that fact. The "2026 pricing,
// proxy pending 2027 on-sale" caveat belongs in eventTierLabel (already
// present) and in the Cost/Tickets spoke copy, not in editionYear, which is
// a join key against the 2027 event row. Left as 2026 in the DB, these rows
// are silently invisible to CostSpoke (tickets array comes back empty).
// Fixing forward, not re-seeding, since eventTierLabel/costLow/costHigh are
// all correct as-is.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027

const result = await db
  .update(plannerTicketTierCost)
  .set({ editionYear: 2027 })
  .where(eq(plannerTicketTierCost.sportingEventId, EVENT_ID))
  .returning({ id: plannerTicketTierCost.id, tier: plannerTicketTierCost.tier, editionYear: plannerTicketTierCost.editionYear });

console.log(`✓ Updated ${result.length} ticket tier rows to editionYear: 2027`);
for (const r of result) console.log(" ", r.tier, "→", r.editionYear);

await client.end();
