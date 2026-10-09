import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, like } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const rows = await db.select({ title: experiences.title, slug: experiences.slug, type: experiences.experienceType, body: experiences.bodyContent })
  .from(sportingEventExperiences)
  .innerJoin(experiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(and(eq(sportingEventExperiences.sportingEventId, EVENT_ID)));

const stay = rows.filter(r => r.type === "accommodation" || /stay|hotel/i.test(r.title));
console.log("=== ACCOMMODATION / STAY EXPERIENCES ===");
for (const r of stay) {
  console.log(`\n--- ${r.title} (${r.slug}) ---`);
  console.log(r.body?.slice(0, 1500));
}
await client.end();
