import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq, inArray } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const events = await db
  .select({ id: sportingEvents.id, slug: sportingEvents.slug, name: sportingEvents.name })
  .from(sportingEvents)
  .where(inArray(sportingEvents.slug, ["wimbledon-2026", "us-open-2026"]));

for (const event of events) {
  const exps = await db
    .select({ title: experiences.title, experienceType: experiences.experienceType, budgetTier: experiences.budgetTier })
    .from(experiences)
    .where(eq(experiences.sportingEventId, event.id))
    .orderBy(experiences.experienceType);

  console.log(`\n── ${event.name} (${exps.length} experiences) ──`);
  exps.forEach(e => console.log(`  • ${e.title}  [${e.experienceType} / ${e.budgetTier}]`));
}

await client.end();
