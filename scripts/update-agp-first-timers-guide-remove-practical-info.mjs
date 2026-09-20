import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "first-timers-guide-albert-park-mu9cdxo6";

try {
  const [result] = await db
    .update(experiences)
    .set({ practicalInfo: null })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status, practicalInfo: experiences.practicalInfo });

  if (!result) {
    console.error("No experience found with slug:", SLUG);
  } else {
    console.log("\n✓ Updated:", result.slug, "|", result.id, "| status:", result.status, "| practicalInfo:", result.practicalInfo);
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
