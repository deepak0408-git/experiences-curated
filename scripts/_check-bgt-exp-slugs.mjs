import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const rows = await db.select({ slug: experiences.slug })
  .from(sportingEventExperiences)
  .innerJoin(experiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(eq(sportingEventExperiences.sportingEventId, EVENT_ID));

for (const r of rows.sort((a,b) => a.slug.localeCompare(b.slug))) console.log(r.slug);
console.log("TOTAL:", rows.length);
await client.end();
