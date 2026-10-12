import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (migrate-from-classic-to-hub-spoke skill
// §1a). Archive (scripts/archive-belgian-gp-2026.mjs) and the slug rename
// (scripts/flip-belgian-gp-slug.mjs) already ran and were confirmed before
// this script, per the archive-before-roll hard rule.
//
// Dates verified directly against Formula1.com and spagrandprix.com,
// 12 Oct 2026: 23-25 Jul 2027, standard weekend format (no sprint listed
// in either official schedule; re-verify closer to the date since F1's
// full 2027 sprint calendar isn't published yet).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const NEW_CALENDAR_ROW_ID = "85ce169b-6364-440b-9c4e-55ecf07dfd87"; // real 2027 row, confirmed unmatched

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, BELGIAN_GP_ID));
if (!before) throw new Error("Belgian GP event row not found");
if (before.slug !== "belgian-grand-prix") {
  throw new Error(`Refusing to proceed — slug is "${before.slug}", expected "belgian-grand-prix". Run the slug rename first.`);
}
if (before.editionYear === 2027) {
  throw new Error("editionYear is already 2027 — already rolled over?");
}

console.log("Before:", { name: before.name, editionYear: before.editionYear, startDate: before.startDate, endDate: before.endDate });

// Honest placeholder — real 2026 pre-trip brief content described 2026-
// specific weather/transport/format facts that don't carry forward to 2027.
const PLACEHOLDER_BRIEF = [
  "Information around Weather, Transport and Innovations related to the 2027 event will be updated closer to the event start.",
];

const [after] = await db
  .update(sportingEvents)
  .set({
    name: "Belgian Grand Prix 2027",
    editionYear: 2027,
    startDate: "2027-07-23",
    endDate: "2027-07-25",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, BELGIAN_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, startDate: after.startDate, endDate: after.endDate });

// Unmatch the old 2026 calendar row(s) FIRST, then match the new 2027 row —
// order matters, since both queries key off matchedSportingEventId and
// doing it the other way round would unmatch the row we just matched.
const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, BELGIAN_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: BELGIAN_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

await client.end();
