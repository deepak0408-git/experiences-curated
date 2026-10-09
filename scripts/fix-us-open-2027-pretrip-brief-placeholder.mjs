import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

// The old preTripBriefLines described the 2026 edition specifically (30 Aug
// 2026 dates, "new for 2026" transit changes, named 2026 Mixed Doubles
// pairings that already played) — stale content for a row that now reads
// as the 2027 edition. Replaced with an honest placeholder per the
// migration skill's §1a edition-rollover rule, and preTripBriefLiveAt
// cleared so the pre-trip-brief-reminder cron treats this as needing
// fresh approval/activation ahead of the 2027 event, not already-live.
const [updated] = await db
  .update(sportingEvents)
  .set({
    preTripBriefLines: [
      "Information around Weather, Transport and Innovations related to the 2027 event will be updated closer to the event start.",
    ],
    preTripBriefLiveAt: null,
  })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, preTripBriefLines: sportingEvents.preTripBriefLines, preTripBriefLiveAt: sportingEvents.preTripBriefLiveAt });

console.log("✓ Updated:", JSON.stringify(updated, null, 2));
await client.end();
