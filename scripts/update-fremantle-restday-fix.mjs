import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent, insiderTips: experiences.insiderTips })
    .from(experiences)
    .where(eq(experiences.title, "Fremantle — A Day Trip from Perth"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = row.bodyContent.replace(
    "It's also a genuinely different place from Perth itself: a working port town with 19th-century limestone buildings, not a suburb dressed up for tourists, and the First Test's rest days or morning-before-play window are enough time to see the real version of it.",
    "It's also a genuinely different place from Perth itself: a working port town with 19th-century limestone buildings, not a suburb dressed up for tourists — and it's a genuine side trip, not something to squeeze around the cricket. Most fans on a multi-day Test don't watch all five days from the stadium; picking one day off to spend in Fremantle instead is enough time to see the real version of it."
  );

  const insiderTips = row.insiderTips.map((tip) =>
    tip === "Fremantle Markets only open Friday through Sunday plus public holiday Mondays — check which days of the First Test your rest day or pre-play morning falls on before building your loop around them."
      ? "Fremantle Markets only open Friday through Sunday plus public holiday Mondays — check which day of the Test you're planning to spend away from the ground before building your loop around them."
      : tip
  );

  if (bodyContent === row.bodyContent) throw new Error("bodyContent replacement did not match");
  if (JSON.stringify(insiderTips) === JSON.stringify(row.insiderTips)) throw new Error("insiderTips replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent, insiderTips })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent, insiderTips: experiences.insiderTips });

  console.log("Updated:", result.title);
  console.log("\n--- bodyContent paragraph 1 ---\n");
  console.log(result.bodyContent.split("\n\n")[0]);
  console.log("\n--- insiderTips ---\n");
  console.log(JSON.stringify(result.insiderTips, null, 2));
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
