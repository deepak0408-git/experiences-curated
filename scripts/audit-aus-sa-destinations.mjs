import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ne } from "drizzle-orm";
import { experiences, sportingEventExperiences, destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

const rows = await db.select({
  title: experiences.title,
  destinationId: experiences.destinationId,
}).from(experiences)
  .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(and(eq(sportingEventExperiences.sportingEventId, EVENT_ID), ne(experiences.status, "archived")));

const destIds = [...new Set(rows.map(r => r.destinationId))];
const destMap = {};
for (const id of destIds) {
  const [d] = await db.select({ name: destinations.name }).from(destinations).where(eq(destinations.id, id));
  destMap[id] = d?.name ?? "UNKNOWN";
}

for (const r of rows) {
  console.log(destMap[r.destinationId], "|", r.title);
}
await client.end();
