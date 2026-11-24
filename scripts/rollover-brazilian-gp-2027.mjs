import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (rollover-event-into-next-year skill §2).
// Archive (scripts/archive-brazilian-gp-2026.mjs) ran and was confirmed
// BEFORE this script. Cron-impact check (skill §1a) done — startDate/
// endDate already ~18 days in the past as of this run, moving a year
// further forward takes them further from any cron's trigger window, not
// closer; homepageSlot already null; activatedAt/isHidden/
// newsletterAnnouncedAt untouched by this script.
//
// Dates confirmed against F1's own ticketing/results pages and multiple
// news outlets, 24 Nov 2026: São Paulo GP (Interlagos), Round 21, 5-7 Nov
// 2027. Cross-checked against the real unmatched externalCalendarEvents row
// (id 95a0cde1-3525-4681-8d8f-35473361f08c, name "Brazilian Grand Prix",
// startDate 2027-11-05) — matches, despite the calendar row using F1's
// "Brazilian Grand Prix" label rather than our own "São Paulo Grand Prix"
// branding; kept our existing name convention, only the year changes.
//
// IMPORTANT FORMAT CHANGE, confirmed via two independent sources: 2026 was
// a CLASSIC weekend (no Sprint — Interlagos was dropped from the 2026
// Sprint calendar). 2027 brings Sprint back to Interlagos per F1's
// confirmed 2027 calendar (Bahrain, Australia, Japan, Canada, Monaco, Great
// Britain, Italy, Brazil, Qatar, Abu Dhabi). This is the opposite direction
// from Singapore's 2026(Sprint)->2027(classic) rollover — experiences and
// spoke content need a classic->Sprint rewrite, not a Sprint->classic one.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BRAZILIAN_GP_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const NEW_CALENDAR_ROW_ID = "95a0cde1-3525-4681-8d8f-35473361f08c"; // real 2027 row, confirmed unmatched ("Brazilian Grand Prix")

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, BRAZILIAN_GP_ID));
if (!before) throw new Error("Brazilian GP event row not found");
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
    name: "São Paulo Grand Prix 2027", // name carries the edition year, same pattern as Singapore/US GP/Mexico City
    editionYear: 2027,
    seasonYear: 2027, // keep in sync with editionYear so HubPage.tsx's displayEventName renders the year (lesson from Mexico City's rollover)
    startDate: "2027-11-05",
    endDate: "2027-11-07",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, BRAZILIAN_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, seasonYear: after.seasonYear, startDate: after.startDate, endDate: after.endDate });

const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, BRAZILIAN_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: BRAZILIAN_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

console.log("\n⚠ FLAG for curator: earlyBirdCutoff was 2026-10-10 (already stale) before this rollover — needs a new 2027 cutoff date set via /curator/price.");

await client.end();
