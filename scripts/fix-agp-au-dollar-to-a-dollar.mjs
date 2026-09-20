import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, inArray } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const TEXT_FIELDS = ["subtitle", "bodyContent", "whyItsSpecial", "whatToAvoid", "editorialNote"];

const rows = await db.select().from(experiences).where(eq(experiences.sportingEventId, EVENT_ID));

for (const r of rows) {
  const updates = {};
  for (const f of TEXT_FIELDS) {
    if (typeof r[f] === "string" && r[f].includes("AU$")) {
      updates[f] = r[f].replaceAll("AU$", "A$");
    }
  }
  if (r.practicalInfo && JSON.stringify(r.practicalInfo).includes("AU$")) {
    updates.practicalInfo = JSON.parse(JSON.stringify(r.practicalInfo).replaceAll("AU$", "A$"));
  }
  if (Array.isArray(r.insiderTips) && r.insiderTips.some((t) => t.includes("AU$"))) {
    updates.insiderTips = r.insiderTips.map((t) => t.replaceAll("AU$", "A$"));
  }

  if (Object.keys(updates).length) {
    await db.update(experiences).set(updates).where(eq(experiences.id, r.id));
    console.log(`✓ ${r.slug} -> ${Object.keys(updates).join(", ")}`);
  }
}

await client.end();
