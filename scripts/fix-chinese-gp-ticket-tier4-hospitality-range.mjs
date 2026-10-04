// tier4 was a single flat figure (F1 Paddock Club, $17,145 both low and
// high) — correct for Paddock Club itself, but it silently implied Paddock
// Club was the only hospitality product at Shanghai. It isn't: F1
// Experiences sells real, cheaper hospitality-adjacent packages below it
// (seed-chinese-gp-paddock-club.mjs already documents Starter/Hero/Podium
// as a named ladder, but with no 2027 pricing at the time that script ran).
//
// Real 2027 pricing for the lower rungs is now live on
// f1experiences.com/2027-chinese-grand-prix (screenshots, 2 Oct 2026):
//   Starter | Grandstand H/K  -> $1,099
//   Hero | Grandstand B       -> $1,799
//   Hero | Grandstand A       -> $2,099
// (Podium | A not yet captured/priced — not included here.)
//
// Founder decision, 2 Oct 2026: fold these into tier4 as one real range
// (low = Starter's real 2027 price, high = Paddock Club) rather than
// adding a 5th tier (the tier1-4 enum caps at 4, matching the Budget/
// Moderate/Splurge/Luxury four-profile Cost spoke design — same
// constraint Qatar GP's tier4 hit when it bundled Lusail Hill Lounge +
// Champions Club into one row). Paddock Club's own figure stays the
// existing 2026 proxy ($17,145) per founder instruction — not re-sourced
// for 2027 in this pass.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027

const [row] = await db
  .update(plannerTicketTierCost)
  .set({
    eventTierLabel: "F1 Experiences Starter through F1 Paddock Club — 3-Day",
    costLow: "1099.00",
    costHigh: "17145.00",
  })
  .where(and(eq(plannerTicketTierCost.sportingEventId, EVENT_ID), eq(plannerTicketTierCost.tier, "tier4")))
  .returning({ tier: plannerTicketTierCost.tier, eventTierLabel: plannerTicketTierCost.eventTierLabel, costLow: plannerTicketTierCost.costLow, costHigh: plannerTicketTierCost.costHigh });

console.log("✓", row);
await client.end();
