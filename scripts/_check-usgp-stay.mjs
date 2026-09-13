import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";
import { eq, and } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "4d56ef8b-5026-4ca1-88ad-f87ccebcde1a";

const rows = await db.select({ title: experiences.title, type: experiences.experienceType, neighborhood: experiences.neighborhood })
  .from(sportingEventExperiences)
  .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
  .where(eq(sportingEventExperiences.sportingEventId, EVENT_ID));

console.log("Total experiences linked:", rows.length);
rows.forEach(r => console.log(r.type, "-", r.title, "(" + (r.neighborhood||"") + ")"));
await client.end();
