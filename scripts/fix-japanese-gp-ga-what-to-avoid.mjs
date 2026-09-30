// Fix: What to Avoid on Japanese GP 2027 General Admission experience —
// original two avoids were repetitive (both about grandstand-access scope).
// Replaced per founder instruction 23 Sep 2026 with rain-protection and
// comfortable-seating-on-the-grass avoids specific to GA's unreserved,
// unsheltered West Area viewing.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-general-admission";
const whatToAvoid =
  "Don't show up to the open West Area without real wet-weather gear — these viewing areas are outdoors and unsheltered, and early April at Suzuka can turn cold and wet with little warning, unlike a roofed grandstand seat. Don't assume the ground will be comfortable to sit or stand on for four days — much of the open terrace and grass viewing area has no seating at all, so bring a foldable stool or a cushioned mat if you're planning to settle in for a full session rather than stand the whole time.";

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
