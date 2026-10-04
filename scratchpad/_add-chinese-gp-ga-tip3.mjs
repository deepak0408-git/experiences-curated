import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-general-admission-mud1mn7y";

const [row] = await db.select({ id: experiences.id, insiderTips: experiences.insiderTips })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row) {
  console.error("Row not found");
  process.exit(1);
}

const newTip = "Pack something foldable to sit on during the slower stretches — GA zones have no fixed seating, so a compact folding stool or seat cushion makes a long race-day wait more bearable. F1's own Shanghai rules page doesn't explicitly confirm or ban this, so keep it small and collapsible and be ready to check with gate staff on arrival rather than assuming it's guaranteed entry.";

const newTips = [...row.insiderTips, newTip];

await db.update(experiences)
  .set({ insiderTips: newTips })
  .where(eq(experiences.slug, SLUG));

console.log("Updated insiderTips:");
console.log(JSON.stringify(newTips, null, 2));

await client.end();
