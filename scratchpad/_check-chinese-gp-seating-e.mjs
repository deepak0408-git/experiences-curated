import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { circuitSeatingProfile } from "../schema/database.ts";
import { eq, ilike } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese GP 2027

const rows = await db.select().from(circuitSeatingProfile).where(eq(circuitSeatingProfile.sportingEventId, EVENT_ID));
console.log(JSON.stringify(rows, null, 2));
await client.end();
