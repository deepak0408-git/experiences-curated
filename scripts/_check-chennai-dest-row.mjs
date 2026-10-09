import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const [row] = await db.select().from(destinations).where(eq(destinations.id, "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"));
console.log(JSON.stringify(row, null, 2));
await client.end();
