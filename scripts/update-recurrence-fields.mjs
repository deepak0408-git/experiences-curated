import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  { id: "ea035967-b5d7-47e6-ad44-7cf4db07e70b", name: "BMW PGA Championship 2026", recurrence: "annual" }, // permanent Wentworth fixture since 1984
  { id: "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e", name: "Italian GP 2026", recurrence: "annual" }, // Monza is F1's most historic annual venue
];

for (const u of updates) {
  const [result] = await db
    .update(sportingEvents)
    .set({ recurrence: u.recurrence })
    .where(eq(sportingEvents.id, u.id))
    .returning({ id: sportingEvents.id, name: sportingEvents.name, recurrence: sportingEvents.recurrence });
  console.log(`✓ ${result.name} → recurrence: ${result.recurrence}`);
}

await client.end();
