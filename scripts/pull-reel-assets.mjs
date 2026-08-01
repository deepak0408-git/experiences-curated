import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ne } from "drizzle-orm";
import { experiences, sportingEventExperiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

for (const slug of ["open-championship-2026", "belgian-gp-2026"]) {
  const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, slug));
  console.log(`\n=== ${event.name} ===`);
  console.log("Event hero:", event.heroImageUrl);
  console.log("Start/End:", event.startDate, "->", event.endDate);

  const rows = await db.select({
    title: experiences.title,
    heroImageUrl: experiences.heroImageUrl,
    packRank: sportingEventExperiences.packRank,
  }).from(experiences)
    .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
    .where(and(eq(sportingEventExperiences.sportingEventId, event.id), ne(experiences.status, "archived")))
    .orderBy(sportingEventExperiences.packRank);

  console.log("Top 5 ranked experiences:");
  for (const r of rows.slice(0, 5)) console.log(" ", r.packRank, r.title, "|", r.heroImageUrl);
}
await client.end();
