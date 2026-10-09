import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const OLD_CALENDAR_ROW_ID = "8c66b216-2d4d-4b44-a852-c87775a14073"; // 2026 dates
const NEW_CALENDAR_ROW_ID = "905c1500-16b0-4137-a0f9-8e7f6a2b45be"; // 2027 dates, already unmatched

// 1. Update the sporting_events row's own name/seasonYear (dates already set)
const [updated] = await db
  .update(sportingEvents)
  .set({
    name: "US Open 2027",
    seasonYear: 2027,
  })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate, seasonYear: sportingEvents.seasonYear });

console.log("✓ sportingEvents updated:", JSON.stringify(updated, null, 2));

// 2. Match the real 2027 calendar row to the evergreen sportingEvents.id
await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: EVENT_ID })
  .where(eq(externalCalendarEvents.id, NEW_CALENDAR_ROW_ID));
console.log("✓ 2027 calendar row matched to", EVENT_ID);

// 3. Unmatch the old 2026 calendar row — do not leave it pointing at a guide
// that's since moved on to the 2027 edition (per migration skill §1a)
await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: null })
  .where(eq(externalCalendarEvents.id, OLD_CALENDAR_ROW_ID));
console.log("✓ 2026 calendar row unmatched");

await client.end();
