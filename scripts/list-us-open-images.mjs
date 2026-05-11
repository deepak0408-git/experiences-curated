import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, "us-open-2026"));
const exps = await db
  .select({ title: experiences.title, heroImageUrl: experiences.heroImageUrl, experienceType: experiences.experienceType })
  .from(experiences)
  .where(eq(experiences.sportingEventId, event.id))
  .orderBy(experiences.experienceType);

exps.forEach(e => console.log(`${e.heroImageUrl ? "✓" : "✗"} [${e.experienceType}] ${e.title}`));
console.log(`\n${exps.filter(e => e.heroImageUrl).length}/${exps.length} have images`);
await client.end();
