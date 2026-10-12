import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "fs";
import { sportingEvents, tripIntelligenceGrandPrixProfiles } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import { TRIP_INTELLIGENCE_SLUG_MAP } from "./_lib/tripIntelligenceSlugMap.mjs";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Imports all 24 Grand Prix profiles from the Trip Intelligence developer
// handoff's grand-prix-master.json verbatim — no scores rewritten, per
// README §4's "the existing master dataset is the canonical numerical
// source. Do not re-rate events while implementing." See memory
// project_trip_intelligence_build.md for full build context.
const HANDOFF_PATH =
  "C:\\Users\\HP\\AppData\\Local\\Temp\\claude\\c--Users-HP--claude-projects-ExperienceCurator\\db057678-2035-47e9-966b-0109810aa130\\scratchpad\\trip_intel_handoff\\trip-intelligence-developer-handoff\\data\\grand-prix-master.json";

const dataset = JSON.parse(readFileSync(HANDOFF_PATH, "utf8"));
const datasetVersion = dataset.metadata.version;

let inserted = 0;
for (const event of dataset.events) {
  const dbSlug = TRIP_INTELLIGENCE_SLUG_MAP[event.sporting_event_id];
  if (!dbSlug) {
    throw new Error(`No slug mapping for dataset event "${event.sporting_event_id}" — aborting, mapping must cover all 24.`);
  }

  const [row] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, dbSlug));
  if (!row) {
    throw new Error(`sporting_events row not found for slug "${dbSlug}" (dataset slug "${event.sporting_event_id}") — aborting.`);
  }

  const c = event.characteristics;
  // Two shapes in this dataset: the original 6 pilot events (silverstone,
  // spa, monaco, singapore, melbourne, suzuka) store C10 as a bare number
  // directly on the event object; the other 18 events nest it under
  // characteristics.C10.derived_score. Handle both rather than assuming one.
  const c10Score = typeof c.C10 === "object" ? c.C10.derived_score : event.C10;
  if (c10Score === undefined) {
    throw new Error(`No C10 score found for "${event.sporting_event_id}" in either shape — aborting.`);
  }

  // `affordability` (the cost-basket breakdown C10 is derived from) is a
  // top-level sibling of `characteristics` in the source JSON, not nested
  // inside it — preserve both together so the full audit trail survives,
  // not just the C01-C09 subdimension detail.
  const detail = { characteristics: c, affordability: event.affordability ?? null };

  await db
    .insert(tripIntelligenceGrandPrixProfiles)
    .values({
      sportingEventId: row.id,
      sourceSlug: event.sporting_event_id,
      grandPrixName: event.name,
      c01RacingActionCircuitExperience: String(c.C01.derived_score),
      c02AtmosphereFanPassion: String(c.C02.derived_score),
      c03CircuitHeritagePrestige: String(c.C03.derived_score),
      c04SpectacleGlamour: String(c.C04.derived_score),
      c05SpectatorViewingExperience: String(c.C05.derived_score),
      c06DestinationAppeal: String(c.C06.derived_score),
      c07AccessibilityConvenience: String(c.C07.derived_score),
      c08WeatherPhysicalComfort: String(c.C08.derived_score),
      c09FanEngagementEntertainment: String(c.C09.derived_score),
      c10Affordability: String(c10Score),
      subdimensionDetail: detail,
      datasetStatus: event.status ?? null,
      datasetVersion,
    })
    .onConflictDoUpdate({
      target: tripIntelligenceGrandPrixProfiles.sourceSlug,
      set: {
        sportingEventId: row.id,
        grandPrixName: event.name,
        c01RacingActionCircuitExperience: String(c.C01.derived_score),
        c02AtmosphereFanPassion: String(c.C02.derived_score),
        c03CircuitHeritagePrestige: String(c.C03.derived_score),
        c04SpectacleGlamour: String(c.C04.derived_score),
        c05SpectatorViewingExperience: String(c.C05.derived_score),
        c06DestinationAppeal: String(c.C06.derived_score),
        c07AccessibilityConvenience: String(c.C07.derived_score),
        c08WeatherPhysicalComfort: String(c.C08.derived_score),
        c09FanEngagementEntertainment: String(c.C09.derived_score),
        c10Affordability: String(c10Score),
        subdimensionDetail: detail,
        datasetStatus: event.status ?? null,
        datasetVersion,
        updatedAt: new Date(),
      },
    });

  inserted++;
  console.log(`  ${event.sporting_event_id} -> ${dbSlug} (${row.id})`);
}

console.log(`\n${inserted} Grand Prix profiles seeded (dataset version ${datasetVersion}).`);
await client.end();
