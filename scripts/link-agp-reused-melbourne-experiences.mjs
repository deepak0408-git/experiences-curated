import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027

const REUSED_SLUGS = [
  "melbourne-laneways-coffee-city-day-msvqcgan",
  "great-ocean-road-twelve-apostles-daytrip-msxbk23p",
  "yarra-valley-melbourne-wine-daytrip-msvq7o08",
  "where-to-stay-melbourne-boxing-day-msvp80zu",
  "federation-square-cbd-laneways-29z0co",
  "st-kilda-beaches-melbourne-park-27rh1c",
  "melbourne-coffee-food-culture-guide-bt5u1c",
];

for (const slug of REUSED_SLUGS) {
  const [row] = await db.select({ id: experiences.id, title: experiences.title, sport: experiences.sport })
    .from(experiences).where(eq(experiences.slug, slug));

  if (!row) {
    console.log("NOT FOUND:", slug);
    continue;
  }

  const sport = new Set(row.sport ?? []);
  sport.add("formula_one");

  await db.update(experiences)
    .set({ sport: Array.from(sport) })
    .where(eq(experiences.id, row.id));

  await db.insert(sportingEventExperiences)
    .values({ experienceId: row.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Linked:", row.title, "| sport now:", Array.from(sport));
}

// Rename the "Where to Stay" experience per founder decision 20 Sep 2026
const RETITLE_SLUG = "where-to-stay-melbourne-boxing-day-msvp80zu";
const [renamed] = await db.update(experiences)
  .set({ title: "Where to Stay in Melbourne for the Sporting Season" })
  .where(eq(experiences.slug, RETITLE_SLUG))
  .returning({ id: experiences.id, title: experiences.title });
console.log("✓ Renamed:", renamed?.title);

await client.end();
