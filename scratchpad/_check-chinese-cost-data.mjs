import { db } from "../lib/db.ts";
import { plannerHotelTierCost, plannerTicketTierCost, plannerDestinationBands, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const event = await db.query.sportingEvents.findFirst({ where: eq(sportingEvents.slug, "chinese-grand-prix") });
console.log("event", event.id, event.editionYear, event.destinationId);

const hotels = await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, event.destinationId));
console.log("hotels", JSON.stringify(hotels, null, 2));

const tickets = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, event.id));
console.log("tickets", JSON.stringify(tickets, null, 2));
