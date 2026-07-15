import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ preTripBriefLines: sportingEvents.preTripBriefLines })
  .from(sportingEvents)
  .where(eq(sportingEvents.id, "be8e1129-6e53-4e45-a574-931250988806"));

console.log(JSON.stringify(event.preTripBriefLines, null, 2));
await client.end();
