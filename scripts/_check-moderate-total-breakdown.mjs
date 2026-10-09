import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerHotelTierCost, plannerDestinationBands, plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const DEST_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const [hotel] = await db.select().from(plannerHotelTierCost).where(and(
  eq(plannerHotelTierCost.destinationId, DEST_ID), eq(plannerHotelTierCost.tier, "moderate"), eq(plannerHotelTierCost.editionYear, 2027)
));
const [band] = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, DEST_ID));
const [ticket] = await db.select().from(plannerTicketTierCost).where(and(
  eq(plannerTicketTierCost.sportingEventId, EVENT_ID), eq(plannerTicketTierCost.tier, "tier2"), eq(plannerTicketTierCost.editionYear, 2027)
));

console.log("HOTEL (moderate):", hotel.costLow, "-", hotel.costHigh, "/night");
console.log("LOCAL TRAVEL:", band.localTravelLow, "-", band.localTravelHigh, "/day");
console.log("FOOD:", band.foodPerDayLow, "-", band.foodPerDayHigh, "/day");
console.log("TICKET (tier2):", ticket.costLow, "-", ticket.costHigh, "/day (x5 days)");

const nights = 7, ticketDays = 5;
const hLow = Number(hotel.costLow) * nights, hHigh = Number(hotel.costHigh) * nights;
const tLow = (Number(band.localTravelLow) + Number(band.foodPerDayLow)) * nights;
const tHigh = (Number(band.localTravelHigh) + Number(band.foodPerDayHigh)) * nights;
const kLow = Number(ticket.costLow) * ticketDays, kHigh = Number(ticket.costHigh) * ticketDays;

console.log("\n--- 7-night contribution ---");
console.log(`Hotel: $${hLow} - $${hHigh}  (spread: $${hHigh-hLow})`);
console.log(`Travel+Food: $${tLow.toFixed(0)} - $${tHigh.toFixed(0)}  (spread: $${(tHigh-tLow).toFixed(0)})`);
console.log(`Ticket (x5): $${kLow} - $${kHigh}  (spread: $${kHigh-kLow})`);
console.log(`TOTAL: $${Math.round(hLow+tLow+kLow)} - $${Math.round(hHigh+tHigh+kHigh)}`);
await client.end();
