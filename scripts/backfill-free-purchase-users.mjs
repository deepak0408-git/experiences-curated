import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases, users } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Find all free purchases (paddleCustomerId = "free_access") and upsert users rows
const freePurchases = await db
  .select({ email: purchases.email })
  .from(purchases)
  .where(eq(purchases.paddleCustomerId, "free_access"));

console.log(`Found ${freePurchases.length} free purchase(s) to backfill`);

for (const { email } of freePurchases) {
  await db.insert(users).values({ email }).onConflictDoNothing();
  console.log("✓ Upserted user:", email);
}

console.log("Done.");
await client.end();
