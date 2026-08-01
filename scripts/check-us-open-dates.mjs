import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ name: sportingEvents.name, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate })
  .from(sportingEvents).where(eq(sportingEvents.slug, "us-open-2026"));
console.log(event);
await client.end();
