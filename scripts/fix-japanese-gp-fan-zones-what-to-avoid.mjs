// Fix: What to Avoid on Japanese GP 2027 Fan Zones experience — both original
// avoids were repetitive (restating "this is free/genuine, not filler").
// Replaced with two genuinely distinct points, per founder instruction
// 23 Sep 2026: (1) Fan Forum Q&A slots are the most-attended part of either
// fan zone and need an early arrival for a good view; (2) the Ferris Wheel
// Fanzone is new for 2026 and not yet officially reconfirmed for 2027.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-fan-zones";
const whatToAvoid =
  "Don't turn up to the Fan Forum stage right as a driver Q&A is about to start expecting an easy view — these are the most-attended slots in either fan zone, and a good spot means arriving well before the published time, not exactly at it. Don't assume the Ferris Wheel Fanzone will look exactly the same as 2026 — it's a new addition that's expected to continue but hasn't been officially reconfirmed for 2027 as of this writing, so treat its exact location and setup as likely rather than locked in until closer to the event.";

try {
  const [result] = await db
    .update(experiences)
    .set({ whatToAvoid })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) throw new Error(`Not found: ${SLUG}`);
  console.log("Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
