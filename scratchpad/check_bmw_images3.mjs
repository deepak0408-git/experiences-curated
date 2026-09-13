import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray } from "drizzle-orm";
import { experiences, sportingEventExperiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const eventId = "ea035967-b5d7-47e6-ad44-7cf4db07e70b"; // BMW PGA from CLAUDE.md Key IDs
const links = await db.select({ experienceId: sportingEventExperiences.experienceId }).from(sportingEventExperiences).where(eq(sportingEventExperiences.sportingEventId, eventId));
const ids = links.map(l => l.experienceId);
console.log("linked count", ids.length);

const rows = await db.select({ id: experiences.id, title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl })
  .from(experiences).where(inArray(experiences.id, ids));

rows.forEach(r => console.log(r.title, "->", r.heroImageUrl));
await client.end();
