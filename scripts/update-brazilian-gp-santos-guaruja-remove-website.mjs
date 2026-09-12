import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c401f59f-9ce4-45b6-a728-d3d4472ea6f0"; // Santos & Guarujá — Football History and the Coast

const practicalInfo = {
  hours: "Day tours typically run 8-12 hours, departing São Paulo in the morning",
  costRange: "Shared-group tours: roughly US$95-150 per person. Private tours: US$240+ per person. Lunch typically not included.",
  bookingMethod: "Book via Viator, GetYourGuide, or a local operator such as AroundSP — check group size and exact itinerary (which museum, whether the historic tram is included) before booking.",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title);
console.log(JSON.stringify(row.practicalInfo, null, 2));
await client.end();
