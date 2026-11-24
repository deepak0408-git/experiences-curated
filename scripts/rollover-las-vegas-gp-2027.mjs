import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (rollover-event-into-next-year skill §2).
// Archive (scripts/archive-las-vegas-gp-2026.mjs) ran and was confirmed
// BEFORE this script — mandatory here since a real purchase exists
// (deepak0408@gmail.com). Cron-impact check (skill §1a) done — startDate/
// endDate already ~5 days in the past as of this run, outside all cron
// windows (±2/±5/±10 days); moving a year further forward takes them
// further away, not closer. homepageSlot already null.
//
// Dates confirmed against F1's own 2027 calendar page and independent news
// sources (F1 extends Las Vegas GP through 2027), 24 Nov 2026: Las Vegas GP
// (Strip Circuit), Round 22, 18-20 Nov 2027. Cross-checked against the real
// unmatched externalCalendarEvents row (id 072e3edf-3d97-46f5-a56b-
// aedc06111f90, startDate 2027-11-18) — matches. Las Vegas is confirmed NOT
// a 2027 Sprint venue (organizers have explicitly ruled out Sprint format),
// same classic weekend structure as 2026 — no format-change rewrite needed,
// unlike Singapore/Brazilian GP.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LAS_VEGAS_GP_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const NEW_CALENDAR_ROW_ID = "072e3edf-3d97-46f5-a56b-aedc06111f90"; // real 2027 row, confirmed unmatched

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, LAS_VEGAS_GP_ID));
if (!before) throw new Error("Las Vegas GP event row not found");
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
    name: "Las Vegas Grand Prix 2027", // name carries the edition year, same pattern as every other 2027 rollover
    editionYear: 2027,
    seasonYear: 2027, // keep in sync with editionYear (lesson from Mexico City's rollover — displayEventName reads this for the h1 year)
    startDate: "2027-11-18",
    endDate: "2027-11-20",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // was already null pre-rollover
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, LAS_VEGAS_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, seasonYear: after.seasonYear, startDate: after.startDate, endDate: after.endDate });

const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, LAS_VEGAS_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: LAS_VEGAS_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

console.log("\n⚠ FLAG for curator: earlyBirdCutoff was 2026-11-01 (already stale) before this rollover — needs a new 2027 cutoff date set via /curator/price.");
console.log("⚠ NOTE: purchases.editionYear for the existing buyer (deepak0408@gmail.com) is 2026 — per the 6 Oct 2026 entitlement fix, this buyer will now correctly fail the pack-access gate against the rolled-over 2027 row.");

await client.end();
