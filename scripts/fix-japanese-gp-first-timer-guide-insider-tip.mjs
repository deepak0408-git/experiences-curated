// Fix: 1st Insider Tip on Japanese GP 2027 First-Timer's Guide — refined to
// call out that Saturday's Sprint is a genuine, competitive race awarding its
// own championship points, not a lesser session, per founder instruction
// 23 Sep 2026: two real races across the weekend, so Saturday isn't one to
// skip.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-first-timer-guide";

try {
  const [row] = await db.select({ insiderTips: experiences.insiderTips }).from(experiences).where(eq(experiences.slug, SLUG));
  if (!row) throw new Error(`Not found: ${SLUG}`);

  const updatedTips = [...row.insiderTips];
  updatedTips[0] =
    "2027 is Suzuka's first-ever Sprint weekend — if you've been to a classic three-day Suzuka weekend before, don't assume the same session rhythm; there's no FP2 or FP3 this time, and Saturday carries both the Sprint and Grand Prix qualifying. The Sprint itself is a genuine, competitive race with its own championship points on the line, not a glorified practice session — that means two real races across the weekend instead of one, and Saturday is not the day to treat as optional.";

  const [result] = await db
    .update(experiences)
    .set({ insiderTips: updatedTips })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
