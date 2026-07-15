import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ne, sql } from "drizzle-orm";
import { experiences, sportingEventExperiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, EVENT_ID));
console.log("=== Sporting Event ===");
console.log("isHidden:", event.isHidden);
console.log("heroImageUrl:", event.heroImageUrl ? "SET" : "MISSING");
console.log("ticketingUrl:", event.ticketingUrl);
console.log("preTripBriefLines:", event.preTripBriefLines ? `${event.preTripBriefLines.length} lines` : "MISSING");
console.log("preTripBriefLiveAt:", event.preTripBriefLiveAt);
console.log("startDate/endDate:", event.startDate, "→", event.endDate);

const rows = await db.select({
  title: experiences.title,
  status: experiences.status,
  heroImageUrl: experiences.heroImageUrl,
  sport: experiences.sport,
  packRank: sportingEventExperiences.packRank,
}).from(experiences)
  .innerJoin(sportingEventExperiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(and(eq(sportingEventExperiences.sportingEventId, EVENT_ID), ne(experiences.status, "archived")))
  .orderBy(sportingEventExperiences.packRank);

console.log("\n=== Experiences:", rows.length, "===");
const notPublished = rows.filter(r => r.status !== "published");
const noHero = rows.filter(r => !r.heroImageUrl);
const noSport = rows.filter(r => !r.sport || r.sport.length === 0);
const noRank = rows.filter(r => r.packRank === null);

console.log("Not published:", notPublished.length ? notPublished.map(r => r.title) : "none");
console.log("Missing hero image:", noHero.length ? noHero.map(r => r.title) : "none");
console.log("Missing sport:", noSport.length ? noSport.map(r => r.title) : "none");
console.log("Missing packRank:", noRank.length ? noRank.map(r => r.title) : "none");
console.log("Rank sequence:", rows.filter(r => r.packRank !== null).map(r => r.packRank).sort((a,b)=>a-b).join(","));

await client.end();
