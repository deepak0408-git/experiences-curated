import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "TEST Annual Pro Notification Event",
    slug: "test-notification-event",
    sport: "tennis",
    tournamentSeries: "TEST — delete after use",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "Test Venue",
    venueAddress: "N/A",
    startDate: "2026-12-01",
    endDate: "2026-12-03",
    isHidden: true,
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, slug: sportingEvents.slug, name: sportingEvents.name });

if (event) {
  console.log("✓ Test event created:", event.name);
  console.log("  ID:  ", event.id);
  console.log("  Slug:", event.slug);
  console.log("  isHidden: true (not yet activated)");
} else {
  const [existing] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "test-notification-event"));
  console.log("✓ Test event already exists:", existing);
}

await client.end();
