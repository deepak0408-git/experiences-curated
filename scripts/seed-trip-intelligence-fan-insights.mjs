import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "fs";
import { sportingEvents, tripIntelligenceFanInsights } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import { TRIP_INTELLIGENCE_SLUG_MAP } from "./_lib/tripIntelligenceSlugMap.mjs";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Imports all 24 fan-insight rows from the Trip Intelligence developer
// handoff's fan-recommendation-insights-register-v1.0.json verbatim — no
// insight text rewritten, per the handoff's "preserve approved insight
// text" instruction. publish_ready is forced true here (not read from the
// source JSON, which defaults every row to false) per the founder's
// explicit 24-GP editorial approval, 10 Oct 2026 — see memory
// project_trip_intelligence_build.md.
const HANDOFF_PATH =
  "C:\\Users\\HP\\AppData\\Local\\Temp\\claude\\c--Users-HP--claude-projects-ExperienceCurator\\db057678-2035-47e9-966b-0109810aa130\\scratchpad\\trip_intel_handoff\\trip-intelligence-developer-handoff\\data\\fan-recommendation-insights-register-v1.0.json";

const dataset = JSON.parse(readFileSync(HANDOFF_PATH, "utf8"));

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

  const insights = event.insights;
  const editorial = event.editorial;

  const values = {
    sportingEventId: row.id,
    sourceSlug: event.sporting_event_id,
    experienceHighlights: insights.experience_highlights,
    goodToKnow: insights.good_to_know,
    tradeOffs: insights.trade_offs,
    insiderTip: insights.insider_tip,
    publishReady: true, // founder-approved override, see comment above
    verifiedForSeason: editorial.verified_for_season ?? null,
    lastChecked: editorial.last_checked ?? null,
    sourceUrls: editorial.sources ?? [],
    editorialNotes: editorial.notes ?? null,
  };

  await db
    .insert(tripIntelligenceFanInsights)
    .values(values)
    .onConflictDoUpdate({
      target: tripIntelligenceFanInsights.sourceSlug,
      set: { ...values, updatedAt: new Date() },
    });

  inserted++;
  console.log(`  ${event.sporting_event_id} -> ${dbSlug} (${row.id})`);
}

console.log(`\n${inserted} fan insight rows seeded, publish_ready=true for all (founder-approved 10 Oct 2026).`);
await client.end();
