import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [result] = await db.update(sportingEvents)
  .set({ startDate: "2026-09-04", endDate: "2026-09-06" })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, name: sportingEvents.name, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate });

console.log("✓ Italian GP dates updated");
console.log("  Name:  ", result.name);
console.log("  Start: ", result.startDate);
console.log("  End:   ", result.endDate);

await client.end();
