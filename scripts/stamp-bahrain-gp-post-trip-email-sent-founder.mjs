import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_SLUG = "bahrain-grand-prix";
const EMAIL = "deepak0408@gmail.com";

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!event) {
  console.error("Event not found");
  process.exit(1);
}

const now = new Date();

const result = await db
  .update(purchases)
  .set({ postTripEmailSentAt: now })
  .where(and(eq(purchases.sportingEventId, event.id), eq(purchases.email, EMAIL)))
  .returning({ email: purchases.email });

console.log(`Stamped postTripEmailSentAt = ${now.toISOString()} for ${result.length} row(s):`);
result.forEach((r) => console.log(" ", r.email));

await client.end();
