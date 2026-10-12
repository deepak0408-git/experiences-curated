import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "fs";
import { tripIntelligenceEngineConfigurations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Imports the selected experimental matching-engine policy from the
// handoff's experience-first-030-policy.json verbatim. Status stays
// "experimental" — the README is explicit this candidate is "not final
// production sign-off" (§10) even though editorial QA for ratings/insights
// has separately been approved. New policy versions are always a new row
// (configuration_key bumped), never an overwrite of this one.
const HANDOFF_PATH =
  "C:\\Users\\HP\\AppData\\Local\\Temp\\claude\\c--Users-HP--claude-projects-ExperienceCurator\\db057678-2035-47e9-966b-0109810aa130\\scratchpad\\trip_intel_handoff\\trip-intelligence-developer-handoff\\config\\experience-first-030-policy.json";

const policy = JSON.parse(readFileSync(HANDOFF_PATH, "utf8"));

await db
  .insert(tripIntelligenceEngineConfigurations)
  .values({
    configurationKey: policy.version, // "candidate-v3-experience-first-030"
    configurationPayload: policy,
    status: "experimental",
  })
  .onConflictDoUpdate({
    target: tripIntelligenceEngineConfigurations.configurationKey,
    set: { configurationPayload: policy, status: "experimental", updatedAt: new Date() },
  });

console.log(`Engine configuration "${policy.version}" seeded as experimental.`);
await client.end();
