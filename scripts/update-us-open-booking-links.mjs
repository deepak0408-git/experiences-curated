import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38c57e06-4763-4e19-9ac5-3a7ad571e938"; // Where to Stay for the US Open

const bookingLinks = [
  {
    platform: "Booking.com",
    label: "Boro Hotel, Long Island City",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fthe-boro-hotel-lic.en-gb.html%3Flabel%3Dgen173nr-10CAso7AFCEnRoZS1ib3JvLWhvdGVsLWxpY0gzWARobIgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgC8fnO0gbAAgHSAiQwZjMwNDVhYi1hOGM5LTRlNWYtOWVmZi04MzQ1ZTdkOGUwZWTYAgHgAgE%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
  {
    platform: "Booking.com",
    label: "Hilton Garden Inn Long Island City",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fhilton-garden-inn-long-island-city-manhattan-view.en-gb.html%3Flabel%3Dgen173nr-10CAso7AFCMWhpbHRvbi1nYXJkZW4taW5uLWxvbmctaXNsYW5kLWNpdHktbWFuaGF0dGFuLXZpZXdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Apv6ztIGwAIB0gIkY2RjMDJiNTktOTc4ZC00MDZlLWFiZTktNDkzMDRhNjI5MDcz2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
  {
    platform: "Booking.com",
    label: "Four Points by Sheraton Flushing",
    url: "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Ffour-points-by-sheraton-flushing.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asb4ztIGwAIB0gIkMDMzMjk1MzktNDg2ZS00Zjg0LTgxNWUtYzkxNWJlY2IxZjMz2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-08-29%26checkout%3D2026-08-31%26dest_id%3D7407508%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1783875884%26srpvid%3D5a1f7815655a0a3a%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Booking.com",
    label: "Hyatt Grand Central New York",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fgrand-hyatt-new-york.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asb4ztIGwAIB0gIkMDMzMjk1MzktNDg2ZS00Zjg0LTgxNWUtYzkxNWJlY2IxZjMz2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D18076920_433380674_2_2_0%26checkin%3D2026-08-29%26checkout%3D2026-08-31%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D18076920_433380674_2_2_0%26hpos%3D1%26matching_block_id%3D18076920_433380674_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D18076920_433380674_2_2_0__52958%26srepoch%3D1783875937%26srpvid%3D99fd782cef7d05d8%26type%3Dtotal%26ucfs%3D1%26",
  },
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug, status: experiences.status });

  console.log("✓ Booking.com affiliate links added");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
