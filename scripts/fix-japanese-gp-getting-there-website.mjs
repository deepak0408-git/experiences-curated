// Fix: Practical Info → website on Japanese GP 2027 Getting to Suzuka
// experience — swapped ise-railway.co.jp + meitetsu.co.jp (JP-only page) for
// the Meitetsu English site and a Navitime route reference, per founder
// instruction 23 Sep 2026.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-getting-there";

try {
  const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));
  if (!row) throw new Error(`Not found: ${SLUG}`);

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    website: "https://www.meitetsu.co.jp/eng/, https://japantravel.navitime.com/en/area/jp/railroad/00000244/",
  };

  const [result] = await db
    .update(experiences)
    .set({ practicalInfo: updatedPracticalInfo })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
