// Recategorize "What to Pack for a Twilight Race" from activity to
// fan_experience — founder-requested 1 Oct 2026, same pattern as the China
// Visas / Shanghai weather-packing pieces already fan_experience-typed.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(experiences)
  .set({ experienceType: "fan_experience", updatedAt: new Date() })
  .where(eq(experiences.slug, "twilight-race-packing-guide-mtffh4jn3etj"));

console.log("✓ twilight-race-packing-guide-mtffh4jn3etj experienceType updated to fan_experience");
await client.end();
