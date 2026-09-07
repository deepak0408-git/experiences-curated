import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const links = await db
  .select({ experienceId: sportingEventExperiences.experienceId })
  .from(sportingEventExperiences)
  .where(eq(sportingEventExperiences.sportingEventId, EVENT_ID));

for (const { experienceId } of links) {
  const [updated] = await db
    .update(experiences)
    .set({ sport: ["tennis"] })
    .where(eq(experiences.id, experienceId))
    .returning({ id: experiences.id, title: experiences.title, sport: experiences.sport });
  console.log("Updated:", updated.title, "->", updated.sport);
}

await client.end();
