import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost, plannerFlightCost, plannerHotelTierCost, circuitSeatingProfile } from "../schema/database.ts";

// rollover-event-into-next-year skill §4 — same founder-approved
// copy-forward pattern as every other 2027 rollover. Las Vegas stays in
// November both years (19 Nov 2026 -> 18 Nov 2027), so no seasonalBand
// change needed.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LAS_VEGAS_GP_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const LAS_VEGAS_DEST_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const FROM_YEAR = 2026;
const TO_YEAR = 2027;

const oldTiers = await db.select().from(plannerTicketTierCost).where(and(eq(plannerTicketTierCost.sportingEventId, LAS_VEGAS_GP_ID), eq(plannerTicketTierCost.editionYear, FROM_YEAR)));
console.log(`Found ${oldTiers.length} ${FROM_YEAR} ticket tier rows to copy`);

const tierIdMap = new Map();
for (const old of oldTiers) {
  const [inserted] = await db
    .insert(plannerTicketTierCost)
    .values({
      sportingEventId: old.sportingEventId,
      tier: old.tier,
      eventTierLabel: old.eventTierLabel,
      editionYear: TO_YEAR,
      costLow: old.costLow,
      costHigh: old.costHigh,
      currency: old.currency,
    })
    .onConflictDoNothing({ target: [plannerTicketTierCost.sportingEventId, plannerTicketTierCost.tier, plannerTicketTierCost.editionYear] })
    .returning();
  if (inserted) {
    tierIdMap.set(old.id, inserted.id);
    console.log(`  ✓ ${old.tier} copied -> ${inserted.id}`);
  } else {
    console.log(`  (skip, already exists) ${old.tier}`);
  }
}

let repointed = 0;
for (const [oldId, newId] of tierIdMap) {
  const updated = await db
    .update(circuitSeatingProfile)
    .set({ ticketTierCostId: newId })
    .where(and(eq(circuitSeatingProfile.sportingEventId, LAS_VEGAS_GP_ID), eq(circuitSeatingProfile.ticketTierCostId, oldId)))
    .returning({ id: circuitSeatingProfile.id, seatName: circuitSeatingProfile.seatName });
  repointed += updated.length;
  updated.forEach(u => console.log(`  ✓ repointed seat "${u.seatName}"`));
}
console.log(`Repointed ${repointed} circuitSeatingProfile rows to 2027 tier costs`);

const oldFlights = await db.select().from(plannerFlightCost).where(and(eq(plannerFlightCost.destinationId, LAS_VEGAS_DEST_ID), eq(plannerFlightCost.editionYear, FROM_YEAR)));
console.log(`\nFound ${oldFlights.length} ${FROM_YEAR} flight cost rows to copy`);
let flightsCopied = 0;
for (const old of oldFlights) {
  const [inserted] = await db
    .insert(plannerFlightCost)
    .values({
      destinationId: old.destinationId,
      originMarket: old.originMarket,
      seasonalBand: old.seasonalBand,
      editionYear: TO_YEAR,
      costLow: old.costLow,
      costHigh: old.costHigh,
      currency: old.currency,
      refreshPass: "initial",
    })
    .onConflictDoNothing({ target: [plannerFlightCost.destinationId, plannerFlightCost.originMarket, plannerFlightCost.seasonalBand, plannerFlightCost.editionYear] })
    .returning();
  if (inserted) flightsCopied++;
}
console.log(`  ✓ copied ${flightsCopied} flight rows`);

const oldHotels = await db.select().from(plannerHotelTierCost).where(and(eq(plannerHotelTierCost.destinationId, LAS_VEGAS_DEST_ID), eq(plannerHotelTierCost.editionYear, FROM_YEAR)));
console.log(`\nFound ${oldHotels.length} ${FROM_YEAR} hotel tier cost rows to copy`);
let hotelsCopied = 0;
for (const old of oldHotels) {
  const [inserted] = await db
    .insert(plannerHotelTierCost)
    .values({
      destinationId: old.destinationId,
      tier: old.tier,
      seasonalBand: old.seasonalBand,
      editionYear: TO_YEAR,
      costLow: old.costLow,
      costHigh: old.costHigh,
      currency: old.currency,
      refreshPass: "initial",
    })
    .onConflictDoNothing({ target: [plannerHotelTierCost.destinationId, plannerHotelTierCost.tier, plannerHotelTierCost.seasonalBand, plannerHotelTierCost.editionYear] })
    .returning();
  if (inserted) hotelsCopied++;
}
console.log(`  ✓ copied ${hotelsCopied} hotel rows`);

console.log("\nDone. All copied rows carry real 2026 prices as a placeholder for 2027 — a genuine planner-data-researcher refresh pass is still owed before race week.");
await client.end();
