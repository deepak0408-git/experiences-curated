import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ heroImageUrl: sportingEvents.heroImageUrl })
  .from(sportingEvents).where(eq(sportingEvents.slug, "belgian-gp-2026"));
console.log("Event hero (beat 1):", event.heroImageUrl);

const titles = [
  "Eau Rouge / Raidillon — Gold 3 Grandstand",
  "The Fan Zone at Raidillon",
  "Pouhon Corner — Silver 3 Grandstand",
];
const rows = await db.select({ title: experiences.title, heroImageUrl: experiences.heroImageUrl })
  .from(experiences).where(inArray(experiences.title, titles));

for (const r of rows) console.log(r.title, "->", r.heroImageUrl);

await client.end();
