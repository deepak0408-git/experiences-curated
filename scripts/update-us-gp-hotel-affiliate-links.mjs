import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Real Booking.com affiliate URLs, supplied directly by the founder 5 Sep
// 2026 — never self-constructed, per standing rule. Each hotel gets its own
// distinct label since all 3 share the "Booking.com" platform value.
const BOOKING_LINKS = [
  {
    platform: "Booking.com",
    label: "Hotel Magdalena",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fmagdalena.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtaP8dQGwAIB0gIkYzUzOTZmYTYtMTY5ZC00MzE4LWEzZWUtMGZjMmZlNTk3M2Yw2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D669132222_273676645_2_42_0%26checkin%3D2026-10-22%26checkout%3D2026-10-26%26dest_id%3D6691322%26dest_type%3Dhotel%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D669132222_273676645_2_42_0%26hpos%3D1%26keep_landing%3D1%26matching_block_id%3D669132222_273676645_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D669132222_273676645_2_42_0__634400%26srepoch%3D1788626930%26srpvid%3D543a7637cc59084c%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Booking.com",
    label: "Austin Marriott Downtown",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Faustin-marriott-downtown.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtaP8dQGwAIB0gIkYzUzOTZmYTYtMTY5ZC00MzE4LWEzZWUtMGZjMmZlNTk3M2Yw2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-10-22%26checkout%3D2026-10-26%26dest_id%3D6186870%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26keep_landing%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1788627025%26srpvid%3Dfb297643a92403dc%26type%3Dtotal%26ucfs%3D1%26#no_availability_msg",
  },
  {
    platform: "Booking.com",
    label: "Embassy Suites by Hilton Austin Downtown South Congress",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fembassy-suites-austin-downtown-town-lake.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtaP8dQGwAIB0gIkYzUzOTZmYTYtMTY5ZC00MzE4LWEzZWUtMGZjMmZlNTk3M2Yw2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D4194522_94258720_2_33_0%26checkin%3D2026-10-22%26checkout%3D2026-10-26%26dest_id%3D41945%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D4194522_94258720_2_33_0%26hpos%3D1%26matching_block_id%3D4194522_94258720_2_33_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D4194522_94258720_2_33_0__267600%26srepoch%3D1788627121%26srpvid%3Df19b7697f2b31cf6%26type%3Dtotal%26ucfs%3D1%26",
  },
];

const [row] = await db
  .select({ id: experiences.id, slug: experiences.slug })
  .from(experiences)
  .where(eq(experiences.slug, "us-gp-where-to-stay-mtnrooyy"));

if (!row) {
  console.error("Experience not found: us-gp-where-to-stay-mtnrooyy");
  process.exit(1);
}

await db.update(experiences).set({ bookingLinks: BOOKING_LINKS }).where(eq(experiences.id, row.id));

console.log("✓ Updated bookingLinks for", row.slug);
console.log("  - Hotel Magdalena");
console.log("  - Austin Marriott Downtown");
console.log("  - Embassy Suites by Hilton Austin Downtown South Congress");
console.log("\n✓ Done — re-publish this row in /curator/review to clear the 1-hour cache.");
await client.end();
