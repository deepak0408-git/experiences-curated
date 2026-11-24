import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (rollover-event-into-next-year skill §2).
// Archive (scripts/archive-mexico-city-gp-2026.mjs) ran and was confirmed
// BEFORE this script. Cron-impact check (skill §1a) done — startDate/
// endDate already ~25 days in the past as of this run, moving a year
// further forward takes them further from any cron's trigger window, not
// closer; homepageSlot already null; activatedAt/isHidden/
// newsletterAnnouncedAt untouched by this script.
//
// Dates confirmed against the official 2027 F1 calendar graphic (FIA/
// Formula1.com, calendar announced 16 Sep 2026), 24 Nov 2026: Mexico City
// GP, Round 20, 29-31 Oct 2027. No externalCalendarEvents row existed yet
// for this event's 2027 edition at pre-flight time — this is the real
// source for the date (not a calendar-row cross-check), so no calendar
// match/unmatch step runs here; nothing to unmatch from the old row either
// since no 2027 row exists to match into.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MEXICO_CITY_GP_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, MEXICO_CITY_GP_ID));
if (!before) throw new Error("Mexico City GP event row not found");
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
    name: "Mexico City Grand Prix 2027", // name carries the edition year, same pattern as Singapore/US GP
    editionYear: 2027,
    startDate: "2027-10-29",
    endDate: "2027-10-31",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, MEXICO_CITY_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, startDate: after.startDate, endDate: after.endDate });

// Unmatch the old 2026 calendar row(s), if any — no 2027 row exists yet to
// match into, unlike Singapore/US GP which both had a real unmatched 2027
// row already seeded.
const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, MEXICO_CITY_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);
console.log("(No 2027 calendar row to match — none existed at pre-flight time. Flag for a future calendar-sync pass.)");

await client.end();
