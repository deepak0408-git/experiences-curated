// Recategorize "First-Timer Orientation — a Season Finale, Explained"
// (Abu Dhabi) from activity to fan_experience — founder-requested 1 Oct
// 2026, same pattern applied across the other pilot destinations.
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
  .where(eq(experiences.slug, "first-timer-orientation-abu-dhabi-mtffh4jnkkpw"));

console.log("✓ first-timer-orientation-abu-dhabi-mtffh4jnkkpw experienceType updated to fan_experience");
await client.end();
