import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { like, eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [updated] = await db
  .update(experiences)
  .set({ budgetTier: "budget" })
  .where(like(experiences.title, "%7 Train%"))
  .returning({ id: experiences.id, title: experiences.title, budgetTier: experiences.budgetTier });

if (updated) {
  console.log(`✓ Updated: ${updated.title} → budgetTier: ${updated.budgetTier}`);
} else {
  console.log("✗ No experience matched '%7 Train%'");
}

await client.end();
