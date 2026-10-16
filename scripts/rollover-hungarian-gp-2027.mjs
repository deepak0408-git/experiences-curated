import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

// Edition rollover, 2026 -> 2027 (migrate-from-classic-to-hub-spoke skill
// §1a). Archive (scripts/archive-hungarian-gp-2026.mjs) and the slug rename
// (scripts/flip-hungarian-gp-slug.mjs) already ran and were confirmed before
// this script, per the archive-before-roll hard rule.
//
// Dates verified directly against F1's official 2027 calendar announcement
// (corp.formula1.com/2027-calendar-announced-with-10-sprint-events/,
// screenshot confirmed by founder 16 Oct 2026): Round 13, Hungary,
// 30 Jul - 1 Aug 2027. No "S" sprint marker next to Hungary on that
// calendar (unlike Austria/Great Britain, which are marked) — standard
// weekend format (FP1/FP2/FP3/Quali/Race), not sprint.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const HUNGARIAN_GP_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const NEW_CALENDAR_ROW_ID = "3f999020-1b6b-49d6-ba54-ffff1d7a7182"; // real 2027 row, confirmed unmatched, startDate 2027-07-30

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, HUNGARIAN_GP_ID));
if (!before) throw new Error("Hungarian GP event row not found");
if (before.slug !== "hungarian-grand-prix") {
  throw new Error(`Refusing to proceed — slug is "${before.slug}", expected "hungarian-grand-prix". Run the slug rename first.`);
}
if (before.editionYear === 2027) {
  throw new Error("editionYear is already 2027 — already rolled over?");
}

console.log("Before:", { name: before.name, editionYear: before.editionYear, startDate: before.startDate, endDate: before.endDate });

// Honest placeholder — real 2026 pre-trip brief content described
// 2026-specific weather/transport/grandstand-rebuild facts that don't carry
// forward to 2027.
const PLACEHOLDER_BRIEF = [
  "Information around Weather, Transport and Innovations related to the 2027 event will be updated closer to the event start.",
];

// editorialOverview is a short, date-agnostic one-liner (no year/day-of-week
// claims) — kept as-is rather than rewritten, matching the Belgian GP
// rollover's own approach to fields with no edition-specific facts baked in.
const [after] = await db
  .update(sportingEvents)
  .set({
    name: "Hungarian Grand Prix 2027",
    editionYear: 2027,
    startDate: "2027-07-30",
    endDate: "2027-08-01",
    preTripBriefLines: PLACEHOLDER_BRIEF,
    preTripBriefLiveAt: null, // dormant until re-activated closer to the real event
    preTripBriefUpdatedAt: new Date(),
    updatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, HUNGARIAN_GP_ID))
  .returning();

console.log("After:", { name: after.name, editionYear: after.editionYear, startDate: after.startDate, endDate: after.endDate });

// Unmatch the old 2026 calendar row(s) FIRST, then match the new 2027 row —
// order matters, since both queries key off matchedSportingEventId and
// doing it the other way round would unmatch the row we just matched.
const unmatched = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.matchedSportingEventId, HUNGARIAN_GP_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Unmatched old calendar row(s):", unmatched);

const [matchedNew] = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: HUNGARIAN_GP_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID))
  .returning({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate });
console.log("✓ Matched new 2027 calendar row:", matchedNew);

await client.end();
