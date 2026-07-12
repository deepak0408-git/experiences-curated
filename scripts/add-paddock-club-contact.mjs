import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "752d5d06-1e81-403b-8e57-4f77dd8b57e3"; // Paddock Club

const howToBook = "If you're planning on Paddock Club for Hungaroring, book through f1experiences.com directly rather than a reseller markup, it's the official channel and carries F1's own guarantee. Contact info@f1experiences.com or +1 888 326 5430 directly if you want a named team suite (McLaren, Ferrari, Red Bull) confirmed before paying, availability for specific suites isn't always visible on the site until you ask. Paddock Club packages for mid-season European rounds like Hungary typically go on sale the preceding autumn and the best team-branded suites sell out first, often 4-5 months before race weekend, well ahead of the general public ticket window. If you want a specific team's suite rather than the shared F1 Experiences suite, that's the detail to lock in early, generic Paddock Club access stays available longer than named-team hospitality. Build the Aramco Pit Lane Walk into your day one plan and check the day's Pit Stop Challenge and simulator slot times on arrival, both run on a schedule and are easy to miss if you're not tracking it.";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({ practicalInfo: { ...existing.practicalInfo, howToBook } })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Added contact detail to howToBook: ${result.title}`);

await client.end();
