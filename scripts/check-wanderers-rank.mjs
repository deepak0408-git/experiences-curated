import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ilike } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({
  title: experiences.title,
  packRank: sportingEventExperiences.packRank,
}).from(experiences)
  .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(ilike(experiences.title, "%Getting to%"));

console.log(rows);
await client.end();
