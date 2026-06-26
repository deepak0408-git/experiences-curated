import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, notInArray } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXCLUDE = ["deepak0408@gmail.com", "deepu2_2000@yahoo.com"];

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const rows = await db
  .select({ email: purchases.email, pricePaid: purchases.pricePaid, createdAt: purchases.createdAt })
  .from(purchases)
  .where(
    and(
      eq(purchases.sportingEventId, event.id),
      notInArray(purchases.email, EXCLUDE)
    )
  );

console.log(`\nWimbledon 2026 buyers (excl. test accounts): ${rows.length}\n`);
rows.forEach(r => console.log(`  ${r.email}  £${r.pricePaid}  ${r.createdAt}`));

await client.end();
