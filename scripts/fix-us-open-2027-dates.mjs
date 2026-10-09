import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open

const [updated] = await db
  .update(sportingEvents)
  .set({
    startDate: "2027-08-29",
    endDate: "2027-09-12",
  })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate });

console.log("✓ Updated:", JSON.stringify(updated, null, 2));
await client.end();
