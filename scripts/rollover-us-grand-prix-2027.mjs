import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (rollover-event-into-next-year skill §2).
// Archive (scripts/archive-us-grand-prix-2026.mjs) ran and was confirmed
// BEFORE this script. Cron-impact check (skill §1a) done — startDate/
// endDate already ~32 days in the past as of this run, moving a year
// further forward takes them further from any cron's trigger window, not
// closer; homepageSlot already null; activatedAt/isHidden/
// newsletterAnnouncedAt untouched by this script.
//
// Dates confirmed against the official 2027 F1 calendar graphic (FIA/
// Formula1.com, calendar announced 16 Sep 2026) and independently
// corroborated by f1experiences.com's own 2027 listing ("22 Oct - 24 Oct,
// 2027 | Austin, Texas"), 24 Nov 2026: United States GP (Austin/COTA),
// Round 19, 22-24 Oct 2027. Cross-checked against the real unmatched
// externalCalendarEvents row (id 26af369e-3189-4437-8bb1-76159ae46e5b,
// startDate 2027-10-22) — matches.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const US_GP_ID = "4d56ef8b-5026-4ca1-88ad-f87ccebcde1a";
const NEW_CALENDAR_ROW_ID = "26af369e-3189-4437-8bb1-76159ae46e5b"; // real 2027 row, confirmed unmatched

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, US_GP_ID));
if (!before) throw new Error("US GP event row not found");
if (before.editionYear === 2027) {
  throw new Error("editionYear is already 2027 — already rolled over?");
}

console.log("Before:", { name: before.name, editionYear: before.editionYear, startDate: before.startDate, endDate: before.endDate });

const PLACEHOLDER_BRIEF = [
  "Information around Weather, Transport and Innovations related to the 2027 event will be updated closer to the event start.",
];

const [after] = await db
  .update(sportingEvents)
  .set({
    name: "United States Grand Prix 2027", // name carries the edition year, same as Singapore/Belgian/Hungarian GP
    editionYear: 2027,
    startDate: "2027-10-22",
    endDate: "2027-10-24",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, US_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, startDate: after.startDate, endDate: after.endDate });

const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, US_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: US_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

await client.end();
