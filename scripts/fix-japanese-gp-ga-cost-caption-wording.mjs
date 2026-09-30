// Fix: Practical Info → Cost wording on Japanese GP 2027 General Admission
// experience — dropped the "as of Sep 2026" qualifier per founder instruction
// 23 Sep 2026 (the caveat itself stays; just the dated qualifier is removed).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-general-admission";
const costRange = "From ~¥18,000 (2026 confirmed 4-day pricing; 2027 pricing not yet released)";

try {
  const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));
  if (!row) throw new Error(`Not found: ${SLUG}`);

  const updatedPracticalInfo = { ...row.practicalInfo, costRange };
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
