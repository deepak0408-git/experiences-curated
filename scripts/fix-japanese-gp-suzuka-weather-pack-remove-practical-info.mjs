// Fix: japanese-gp-suzuka-weather-pack — founder asked to remove the
// entire Practical Info section (24 Sep 2026). The prior content was
// entirely "N/A" placeholders (no hours, no cost, no website, "not a
// bookable experience") since this is a weather/packing reference, not a
// bookable venue — the section added nothing and is being cut outright
// rather than reworded.
//
// app/experience/[slug]/page.tsx gates the whole section on
// `{practical && (...)}` (practical = exp.practicalInfo cast), so setting
// the column to null removes the section from the rendered page, not just
// blanks a sub-field.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [result] = await db
    .update(experiences)
    .set({ practicalInfo: null })
    .where(eq(experiences.slug, "japanese-gp-suzuka-weather-pack"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("✗ No row found for slug: japanese-gp-suzuka-weather-pack");
  } else {
    console.log(`✓ ${result.slug} | ${result.status} — practicalInfo set to null, section will no longer render`);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
