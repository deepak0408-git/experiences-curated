// Seed: Japanese Grand Prix 2027 sporting event + Suzuka destination.
//
// Created via event-builder -> hub-and-spoke-event-pack skill flow, 21 Sep 2026.
// Scope: event + destination rows ONLY. No experiences, no spokes, no pricing
// content yet — those require a confirmed experience list session first, per
// CLAUDE.md's memory-file-first rule for experience lists.
//
// Research (sourced 21 Sep 2026):
// - Dates: 9-11 Apr 2027, race Sunday 11 Apr 2027. Round 4 of 2027 F1 season.
//   https://ticketing.formula1.com/japan/ (official F1 ticket store, "09 - 11 Apr")
//   https://en.wikipedia.org/wiki/2027_Formula_One_World_Championship (race date 11 April, round 4)
// - Sprint format weekend — Suzuka's first-ever Sprint, confirmed via Williams F1's
//   official 2027 calendar sprint announcement (10 sprint events: Bahrain, Australia,
//   Japan, Canada, Monaco, Great Britain, Italy, Brazil, Qatar, Abu Dhabi).
// - nearestAirportIata: NGO (Chubu Centrair) — approved by founder 21 Sep 2026.
//   Real international gateway ~1hr from Suzuka Circuit via Meitetsu/JR/Ise Railway
//   or direct Kintetsu to Shiroko + shuttle. See project_japanese_gp_2027_build_status
//   memory for the founder's note on documenting NRT+Shinkansen as a secondary option
//   in a future Getting There experience.
//
// DB verified clean before this script: zero existing rows for Japan/Suzuka in
// both sportingEvents and destinations (checked 21 Sep 2026).
//
// CORRECTED 22 Sep 2026: this script inserted slug "japanese-grand-prix-2027",
// which was wrong — event slugs are evergreen, never year-suffixed (matches
// every other GP: "italian-grand-prix", "brazilian-grand-prix", etc.). The DB
// row and all code (spoke folder, registry.ts, spokeConfig.ts, HubPage.tsx,
// BrandHero.tsx, packPricing.ts, app/experience/[slug]/page.tsx) were migrated
// to slug "japanese-grand-prix". This file is left as the historical record of
// what actually ran — do not re-run it, and do not treat its slug value below
// as current truth.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations, sportingEvents, externalCalendarEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// 1. Create Suzuka destination
const [suzuka] = await db
  .insert(destinations)
  .values({
    name: "Suzuka",
    slug: "suzuka",
    countryCode: "JP",
    region: "Mie Prefecture",
    destinationType: "city",
    nearestAirportIata: "NGO",
    currency: "JPY",
    language: "Japanese",
    timezone: "Asia/Tokyo",
  })
  .returning({ id: destinations.id, name: destinations.name, slug: destinations.slug });

console.log("Created destination:", suzuka);

// 2. Create Japanese GP 2027 sporting event
const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Japanese Grand Prix 2027",
    slug: "japanese-grand-prix-2027",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    destinationId: suzuka.id,
    venueName: "Suzuka Circuit",
    venueAddress: "7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
    startDate: "2027-04-09",
    endDate: "2027-04-11",
    recurrence: "annual",
    ticketingUrl: "https://ticketing.formula1.com/japan/",
    editorialOverview:
      "Formula 1 returns to Suzuka for round 4 of the 2027 season — the circuit's first-ever Sprint weekend, run on one of the sport's most demanding and best-loved tracks.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "built_hidden",
    packFormat: "hub_and_spoke",
  })
  .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug });

console.log("Created sporting event:", event);

// 3. Link to the pre-existing externalCalendarEvents row (Sports Calendar page)
// — confirmed present, non-provisional, 9-11 Apr 2027, "Official FIA 2027 F1
// calendar (confirmed)" — BLOCKER per hub-and-spoke-event-pack skill §0.
const calRow = await db
  .select({ id: externalCalendarEvents.id, matchedSportingEventId: externalCalendarEvents.matchedSportingEventId })
  .from(externalCalendarEvents)
  .where(eq(externalCalendarEvents.id, "feb8b942-0a70-4a95-b515-5ccc3b595fa8"));

if (calRow.length === 0) {
  console.error("WARNING: expected externalCalendarEvents row not found by id — matchedSportingEventId NOT set. Investigate manually.");
} else {
  await db
    .update(externalCalendarEvents)
    .set({ matchedSportingEventId: event.id, updatedAt: new Date() })
    .where(eq(externalCalendarEvents.id, "feb8b942-0a70-4a95-b515-5ccc3b595fa8"));
  console.log("Linked externalCalendarEvents row feb8b942-... -> sportingEvents", event.id);
}

await client.end();
console.log("\nDone. Event + destination created. No experiences/spokes/pricing yet.");
