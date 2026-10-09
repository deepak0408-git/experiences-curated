import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, plannerHotelTierCost, plannerFlightCost, plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";

// Founder's explicit business call (5 Oct 2026): event is ~1 year out,
// 2027 tickets aren't on sale yet, so real 2027 research isn't possible.
// Copy 2026 figures forward as a placeholder, re-research when tickets
// go on sale (T-60/T-30 refresh pass per planner-data-researcher skill).

// 1. Bump sportingEvents.editionYear to 2027 to match seasonYear/dates.
const [eventRow] = await db
  .update(sportingEvents)
  .set({ editionYear: 2027 })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, editionYear: sportingEvents.editionYear, seasonYear: sportingEvents.seasonYear });
console.log("sportingEvents.editionYear updated:", eventRow);

// 2. Copy hotel tier cost rows (2026 -> 2027)
const hotels2026 = await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, DESTINATION_ID));
let hotelCount = 0;
for (const row of hotels2026) {
  if (row.editionYear !== 2026) continue;
  await db.insert(plannerHotelTierCost).values({
    destinationId: row.destinationId,
    tier: row.tier,
    seasonalBand: row.seasonalBand,
    editionYear: 2027,
    costLow: row.costLow,
    costHigh: row.costHigh,
    currency: row.currency,
    refreshPass: "initial",
  }).onConflictDoNothing();
  hotelCount++;
}
console.log(`Hotel rows copied: ${hotelCount}`);

// 3. Copy flight cost rows (2026 -> 2027)
const flights2026 = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, DESTINATION_ID));
let flightCount = 0;
for (const row of flights2026) {
  if (row.editionYear !== 2026) continue;
  await db.insert(plannerFlightCost).values({
    destinationId: row.destinationId,
    originMarket: row.originMarket,
    seasonalBand: row.seasonalBand,
    editionYear: 2027,
    costLow: row.costLow,
    costHigh: row.costHigh,
    currency: row.currency,
    refreshPass: "initial",
  }).onConflictDoNothing();
  flightCount++;
}
console.log(`Flight rows copied: ${flightCount}`);

// 4. Copy ticket tier cost rows (2026 -> 2027)
const tickets2026 = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, EVENT_ID));
let ticketCount = 0;
for (const row of tickets2026) {
  if (row.editionYear !== 2026) continue;
  await db.insert(plannerTicketTierCost).values({
    sportingEventId: row.sportingEventId,
    tier: row.tier,
    eventTierLabel: row.eventTierLabel,
    editionYear: 2027,
    costLow: row.costLow,
    costHigh: row.costHigh,
    currency: row.currency,
  }).onConflictDoNothing();
  ticketCount++;
}
console.log(`Ticket rows copied: ${ticketCount}`);

process.exit(0);
