import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Archives "Where to Sit — T1, Apex, or the Covered Grandstand", superseded
// by the grandstand-experience restructure (16 Oct 2026) — its T1 and
// Hungaroring content is now covered by two real standalone write-ups
// (t1-grandstand-piquet-corner-*, hungaroring-grandstand-both-tiers-*),
// each with more sector/row-level detail than this comparison piece had.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "32aa24f0-c709-4c7a-b030-ed30b7810fd8";

const [existing] = await db.select({ editorialNote: experiences.editorialNote }).from(experiences).where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({
    status: "archived",
    updatedAt: new Date(),
    editorialNote: `${existing.editorialNote ?? ""} ARCHIVED 16 Oct 2026 — superseded by standalone T1 (t1-grandstand-piquet-corner-*) and Hungaroring (hungaroring-grandstand-both-tiers-*) grandstand write-ups, part of the grandstand-experience restructure following the Ticket Intelligence build. Apex 1/Apex 2 content from this piece not carried forward to a new standalone experience — those two seats fall back to the general Ticket Guide for Ticket Intelligence purposes.`.trim(),
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, status: experiences.status });

console.log("\n✓ Archived:", result);

await client.end();
