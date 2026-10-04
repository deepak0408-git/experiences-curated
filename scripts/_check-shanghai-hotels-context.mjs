import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { destinations, plannerHotelTierCost, experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const dest = await db.select().from(destinations).where(eq(destinations.id, "998a8774-05ac-4482-ba7a-4ca2a556b963"));
console.log("nextClosestHotelDestinationId:", dest[0].nextClosestHotelDestinationId);

const existingHotels = await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, "998a8774-05ac-4482-ba7a-4ca2a556b963"));
console.log("existing hotel tier rows for Shanghai:", existingHotels.length);
console.log(existingHotels.slice(0,4));

// look for accommodation-type experiences already seeded for Shanghai Masters / Chinese GP
const accExp = await db.select({ id: experiences.id, title: experiences.title, type: experiences.experienceType, sportingEventId: experiences.sportingEventId })
  .from(experiences)
  .where(and(eq(experiences.experienceType, "accommodation")));
console.log("all accommodation experiences (any event):", accExp.length);
console.log(accExp.filter(e => e.sportingEventId === "020c6a95-1b15-4a63-8a55-853656b1fe8d" || e.title.toLowerCase().includes("shanghai")));
await client.end();
