import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq, like } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

if (!event) {
  console.error("Wimbledon 2026 event not found");
  process.exit(1);
}

for (const titleMatch of ["Lawn Tennis Museum", "Brixton Village"]) {
  const result = await db
    .update(experiences)
    .set({ sportingEventId: event.id })
    .where(like(experiences.title, `%${titleMatch}%`))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log(`Linked "${result[0]?.title}" → wimbledon-2026`);
}

await client.end();
