import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ne } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

const rows = await db.select({
  title: experiences.title,
  slug: experiences.slug,
  insiderTips: experiences.insiderTips,
  practicalInfo: experiences.practicalInfo,
})
.from(experiences)
.innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
.where(and(eq(sportingEventExperiences.sportingEventId, EVENT_ID), ne(experiences.status, "archived")));

for (const r of rows) {
  console.log(`\n--- ${r.title}`);
  console.log("  insiderTips (DB):", JSON.stringify(r.insiderTips));
  console.log("  howToBook:", r.practicalInfo?.howToBook ? "SET" : "empty");
}
await client.end();
