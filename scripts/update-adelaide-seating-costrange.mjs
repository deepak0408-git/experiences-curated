import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.title, "Where to Sit: Adelaide Oval — The Hill vs. The Reserve"));

  if (!row) throw new Error("Experience not found");

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    costRange: "Hill (general admission) typically the cheapest tier, from around AU$25-35 per day; Reserved Grandstand higher and varies significantly by stand and row.",
  };

  const [result] = await db.update(experiences)
    .set({ practicalInfo: updatedPracticalInfo })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo });

  console.log("Updated:", result.title);
  console.log(JSON.stringify(result.practicalInfo, null, 2));
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
