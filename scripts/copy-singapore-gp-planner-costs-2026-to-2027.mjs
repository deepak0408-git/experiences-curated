import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost, plannerFlightCost, plannerHotelTierCost, circuitSeatingProfile } from "../schema/database.ts";

// rollover-event-into-next-year skill §6 follow-up — founder decision
// (24 Nov 2026): rather than leaving Singapore GP's 2027 edition with zero
// planner cost rows (which breaks hasFullPlannerCostData()'s gate in
// app/ticket-intelligence/[slug]/_lib/getSeatingData.ts and silently hides
// the "Budget your trip"/Price Radar link), copy the real 2026 prices
// forward to editionYear 2027 as an explicit placeholder/reference, same
// month/seasonalBand (Singapore's race stays in October both years, so no
// seasonal-band change needed). refreshPass is set to "initial" on the new
// rows (not "latest") so a future real research pass is visibly flagged as
// still owed, not mistaken for already-refreshed 2027 data.
//
// circuitSeatingProfile.ticketTierCostId rows are repointed to the new 2027
// tier rows so Ticket Intelligence's join (getSeatingData.ts ~line 102)
// resolves against 2027 pricing going forward, not a 2026 row that's no
// longer the "current" edition.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SINGAPORE_GP_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const SINGAPORE_DEST_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const FROM_YEAR = 2026;
const TO_YEAR = 2027;

// --- 1. Ticket tiers (event-keyed) ---
const oldTiers = await db.select().from(plannerTicketTierCost).where(and(eq(plannerTicketTierCost.sportingEventId, SINGAPORE_GP_ID), eq(plannerTicketTierCost.editionYear, FROM_YEAR)));
console.log(`Found ${oldTiers.length} ${FROM_YEAR} ticket tier rows to copy`);

const tierIdMap = new Map(); // old id -> new id
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

// --- 2. Repoint circuitSeatingProfile rows to the new 2027 tier rows ---
let repointed = 0;
for (const [oldId, newId] of tierIdMap) {
  const updated = await db
    .update(circuitSeatingProfile)
    .set({ ticketTierCostId: newId })
    .where(and(eq(circuitSeatingProfile.sportingEventId, SINGAPORE_GP_ID), eq(circuitSeatingProfile.ticketTierCostId, oldId)))
    .returning({ id: circuitSeatingProfile.id, seatName: circuitSeatingProfile.seatName });
  repointed += updated.length;
  updated.forEach(u => console.log(`  ✓ repointed seat "${u.seatName}"`));
}
console.log(`Repointed ${repointed} circuitSeatingProfile rows to 2027 tier costs`);

// --- 3. Flights (destination-keyed) ---
const oldFlights = await db.select().from(plannerFlightCost).where(and(eq(plannerFlightCost.destinationId, SINGAPORE_DEST_ID), eq(plannerFlightCost.editionYear, FROM_YEAR)));
console.log(`\nFound ${oldFlights.length} ${FROM_YEAR} flight cost rows to copy`);
let flightsCopied = 0;
for (const old of oldFlights) {
  const [inserted] = await db
    .insert(plannerFlightCost)
    .values({
      destinationId: old.destinationId,
      originMarket: old.originMarket,
      seasonalBand: old.seasonalBand, // same month (Oct) both years, no change needed
      editionYear: TO_YEAR,
      costLow: old.costLow,
      costHigh: old.costHigh,
      currency: old.currency,
      refreshPass: "initial", // flagged as still owing a real 2027 research pass
    })
    .onConflictDoNothing({ target: [plannerFlightCost.destinationId, plannerFlightCost.originMarket, plannerFlightCost.seasonalBand, plannerFlightCost.editionYear] })
    .returning();
  if (inserted) flightsCopied++;
}
console.log(`  ✓ copied ${flightsCopied} flight rows`);

// --- 4. Hotels (destination-keyed) ---
const oldHotels = await db.select().from(plannerHotelTierCost).where(and(eq(plannerHotelTierCost.destinationId, SINGAPORE_DEST_ID), eq(plannerHotelTierCost.editionYear, FROM_YEAR)));
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
