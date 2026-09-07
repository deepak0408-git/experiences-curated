import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Removes the Practical Info section entirely from the Weather & What to
// Pack experience, per founder request 7 Sep 2026 — every field in it was
// either "N/A" (hours, costRange, bookingMethod) or a generic external
// forecast link (website), none of it genuine venue/booking practical info
// the way it is for every other experience in this pack. The page's
// Practical Info block is gated on `{practical && (...)}}`, so setting the
// column to null cleanly removes the whole section from render.

const EXPERIENCE_ID = "a20d23d4-c007-4576-bf87-3914993167cb";

const [result] = await db
  .update(experiences)
  .set({ practicalInfo: null, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log(`✓ Updated: ${result.title}`);
console.log("practicalInfo:", result.practicalInfo);
await client.end();
