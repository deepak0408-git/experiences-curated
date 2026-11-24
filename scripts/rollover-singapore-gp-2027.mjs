import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (rollover-event-into-next-year skill §2).
// Archive (scripts/archive-singapore-gp-2026.mjs) ran and was confirmed
// BEFORE this script, per the archive-before-roll hard rule. Cron-impact
// check (skill §1a) done — no cron fires as a result of this mutation
// (all exact-day/window crons key off startDate/endDate moving a full year
// forward; activatedAt/isHidden/newsletterAnnouncedAt/homepageSlot
// untouched; homepageSlot already null).
//
// Dates confirmed against the official 2027 F1 calendar graphic (FIA /
// Formula1.com), 24 Nov 2026: Singapore GP, Round 18, 8-10 Oct 2027.
// Cross-checked against the real unmatched externalCalendarEvents row
// (id 2d558ef2-5eef-4a86-b0d0-40cecb814f21, startDate 2027-10-08) — matches.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SINGAPORE_GP_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const NEW_CALENDAR_ROW_ID = "2d558ef2-5eef-4a86-b0d0-40cecb814f21"; // real 2027 row, confirmed unmatched

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, SINGAPORE_GP_ID));
if (!before) throw new Error("Singapore GP event row not found");
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
    name: "Singapore Grand Prix 2027", // name carries the edition year here, same as Belgian/Hungarian GP — missed on the first run, fixed same-session via scripts/_fix-singapore-gp-2027-name.mjs, folded back in here
    editionYear: 2027,
    startDate: "2027-10-08",
    endDate: "2027-10-10",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, SINGAPORE_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, startDate: after.startDate, endDate: after.endDate });

// Unmatch the old 2026 calendar row(s) FIRST, then match the new 2027 row —
// order matters, since both queries key off matchedSportingEventId and
// doing it the other way round would unmatch the row we just matched.
const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, SINGAPORE_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: SINGAPORE_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

await client.end();
