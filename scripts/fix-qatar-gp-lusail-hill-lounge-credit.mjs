import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// 13 Sep 2026: heroImageCredit is public-facing (renders as photo attribution
// on the experience page) — remove the "AI-generated" note from there. The
// AI-generated fact is tracked instead in editorialNote, which is internal-only.
const EXPERIENCE_ID = "c84fa5f9-4e60-4eb4-ab42-b8f03ceddae5"; // Lusail Hill Lounge, qatar-gp-lusail-hill-lounge-mtymm3gw

const [result] = await db
  .update(experiences)
  .set({
    heroImageCredit: null,
    editorialNote: "Hero image is AI-generated — curator-approved exception, 13 Sep 2026. Not a real photo of the venue.",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, heroImageCredit: experiences.heroImageCredit, editorialNote: experiences.editorialNote });

console.log(`✓ ${result.title}`);
console.log(`  heroImageCredit: ${result.heroImageCredit}`);
console.log(`  editorialNote: ${result.editorialNote}`);

await client.end();
