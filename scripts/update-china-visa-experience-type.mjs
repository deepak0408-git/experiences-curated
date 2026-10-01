// Recategorize "China Visas, Maps, and Payments" from activity to
// fan_experience — founder-requested 1 Oct 2026 while reviewing the
// Shanghai destination page's Attractions section (a visa/logistics guide
// doesn't belong there).
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
  .where(eq(experiences.slug, "china-visa-apps-payments-guide-mskq7nml"));

console.log("✓ china-visa-apps-payments-guide-mskq7nml experienceType updated to fan_experience");
await client.end();
