import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerDestinationBands } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, "998a8774-05ac-4482-ba7a-4ca2a556b963"));
console.log(JSON.stringify(rows, null, 2));
await client.end();
