import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [ev] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "us-open"));
const rows = await db.select({ slug: experiences.slug, heroImageUrl: experiences.heroImageUrl })
  .from(experiences)
  .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(eq(sportingEventExperiences.sportingEventId, ev.id));

const imageSlug = "where-to-stay-us-open";
const matches = rows.filter(r => r.slug.includes(imageSlug));
console.log("Matches for imageSlug:", imageSlug);
for (const m of matches) console.log(JSON.stringify(m));
console.log("First match (what .find() returns):", JSON.stringify(matches[0]));
process.exit(0);
