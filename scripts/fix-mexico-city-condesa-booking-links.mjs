import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Replaces plain, non-affiliate booking.com URLs (written in error during
// original seeding — per feedback_affiliate_link_generation.md, affiliate
// link identification is the only part done here; the founder generates
// the real affiliate URL, never me) with the real affiliate links the
// founder supplied directly, 7 Sep 2026. Adds a distinct `label` per entry
// (hotel name) per CLAUDE.md's bookingLinks rule — the page renders
// `link.label ?? link.platform`, and two "Booking.com" platform values with
// no label would render identical, unhelpful link text.

const EXPERIENCE_ID = "beb0a3f4-97bc-4c8b-bea9-c77ce72afd45";

const bookingLinks = [
  {
    platform: "Booking.com",
    label: "Condesa df",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fmx%2Fcondesa-df.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aof5-NQGwAIB0gIkNDBhNDA0OTItNWY4Mi00NTI5LWE2ZjUtN2FkNjI2ZTBhZGI52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D17627004_89150832_2_1_0%26checkin%3D2026-10-29%26checkout%3D2026-11-02%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D17627004_89150832_2_1_0%26hpos%3D1%26matching_block_id%3D17627004_89150832_2_1_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D17627004_89150832_2_1_0__284889%26srepoch%3D1788755172%26srpvid%3D543a1f312eab23a6%26type%3Dtotal%26ucfs%3D1%26",
    pricePoint: "splurge",
  },
  {
    platform: "Booking.com",
    label: "Casa Cuenca",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fmx%2Fcasa-cuenca.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aof5-NQGwAIB0gIkNDBhNDA0OTItNWY4Mi00NTI5LWE2ZjUtN2FkNjI2ZTBhZGI52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-10-29%26checkout%3D2026-11-02%26dest_id%3D11826518%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1788755337%26srpvid%3De13f1f1b90a806d1%26type%3Dtotal%26ucfs%3D1%26%23no_availability_msg",
    pricePoint: "moderate",
  },
];

const [result] = await db
  .update(experiences)
  .set({ bookingLinks, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
