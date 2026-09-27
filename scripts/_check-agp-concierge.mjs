import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f";

const rows = await db
  .select({
    id: experiences.id,
    title: experiences.title,
    experienceType: experiences.experienceType,
    practicalInfo: experiences.practicalInfo,
    status: experiences.status,
    packRank: sportingEventExperiences.packRank,
  })
  .from(sportingEventExperiences)
  .innerJoin(experiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(eq(sportingEventExperiences.sportingEventId, EVENT_ID));

console.log(`Total linked experiences: ${rows.length}`);
const withConcierge = rows.filter(r => r.practicalInfo?.howToBook && r.practicalInfo.howToBook.trim().length > 0);
console.log(`With howToBook (Concierge/Pro-gated): ${withConcierge.length}`);
console.log("");
for (const r of withConcierge) {
  console.log(`--- ${r.title} (${r.experienceType}, status: ${r.status}, packRank: ${r.packRank}) ---`);
  console.log(r.practicalInfo.howToBook);
  console.log("");
}
console.log("=== All experiences (title / has howToBook) ===");
for (const r of rows) {
  console.log(`${r.practicalInfo?.howToBook ? "[CONCIERGE]" : "           "} ${r.title}`);
}
await client.end();
