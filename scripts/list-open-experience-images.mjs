import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ne } from "drizzle-orm";
import { experiences, sportingEventExperiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, "open-championship-2026"));

const rows = await db.select({
  title: experiences.title,
  heroImageUrl: experiences.heroImageUrl,
  packRank: sportingEventExperiences.packRank,
}).from(experiences)
  .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(and(eq(sportingEventExperiences.sportingEventId, event.id), ne(experiences.status, "archived")))
  .orderBy(sportingEventExperiences.packRank);

for (const r of rows) console.log(r.packRank, "|", r.title, "->", r.heroImageUrl);

await client.end();
