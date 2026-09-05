import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  {
    slug: "atlantis-the-royal-dubai-mtff9m96qbmb",
    label: "Atlantis The Royal",
    url: "https://www.dpbolvw.net/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fthe-royal-atlantis.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D524808733_440660748_2_1_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D5248087%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D524808733_440660748_2_1_0%26hpos%3D1%26matching_block_id%3D524808733_440660748_2_1_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D524808733_440660748_2_1_0__1183600%26srepoch%3D1788545165%26srpvid%3D64f27f3190e504a4%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "beach-rotana-corniche-abu-dhabi-mtffcv837hba",
    label: "Beach Rotana",
    url: "https://www.kqzyfj.com/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fbeach-rotana-towers.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D6726267_430124859_2_42_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D67262%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D6726267_430124859_2_42_0%26hpos%3D1%26matching_block_id%3D6726267_430124859_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D6726267_430124859_2_42_0__253088%26srepoch%3D1788545564%26srpvid%3D644c8005754b0097%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "crowne-plaza-yas-island-mtffcv8374vs",
    label: "Crowne Plaza Yas Island",
    url: "https://www.anrdoezrs.net/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fcrowne-plaza-yas-island.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D18579453_94337391_3_42_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D185794%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D18579453_94337391_3_42_0%26hpos%3D1%26matching_block_id%3D18579453_94337391_3_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D18579453_94337391_3_42_0__366300%26srepoch%3D1788545571%26srpvid%3D24c6800c1ba70184%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "ibis-deira-creekside-dubai-mtffbz4ut7aw",
    label: "ibis Deira Creekside",
    url: "https://www.jdoqocy.com/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fibis-deira-city-centre.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D4827501_94270532_2_34_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D48275%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D4827501_94270532_2_34_0%26hpos%3D1%26matching_block_id%3D4827501_94270532_2_34_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D4827501_94270532_2_34_0__143460%26srepoch%3D1788545645%26srpvid%3Ddd52802e14770580%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "park-regis-business-bay-dubai-mtffbz4u3r4n",
    label: "Park Regis Business Bay",
    url: "https://www.dpbolvw.net/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fpark-regis-business-bay.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D509089102_0_2_0_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D5090891%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D509089102_0_2_0_0%26hpos%3D1%26matching_block_id%3D509089102_0_2_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D509089102_0_2_0_0__312981%26srepoch%3D1788545649%26srpvid%3D5ea580343c21007a%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "w-abu-dhabi-yas-island-mtff9m96eu89",
    // Note: resolves to Booking.com's "The Yas Hotel" listing, not a
    // W-branded listing — confirmed intentional substitute by the founder
    // 4 Sep 2026 (same on-circuit Yas Marina trackside category as W Abu
    // Dhabi; W itself may not carry its own bookable Booking.com listing).
    label: "The Yas Hotel (Yas Marina trackside)",
    url: "https://www.jdoqocy.com/click-101774030-17179188?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fae%2Fthe-yas.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4ApuP7NQGwAIB0gIkMTE5MjAwN2MtNTI4ZC00NTkxLWE4MjUtZDMyMGFlYThmMzVl2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D18344323_225809573_2_42_0%26checkin%3D2026-11-18%26checkout%3D2026-11-22%26dest_id%3D183443%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D18344323_225809573_2_42_0%26hpos%3D1%26matching_block_id%3D18344323_225809573_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D18344323_225809573_2_42_0__419388%26srepoch%3D1788545707%26srpvid%3D40c58054d63f0a22%26type%3Dtotal%26ucfs%3D1%26",
  },
];

for (const u of updates) {
  const [updated] = await db
    .update(experiences)
    .set({
      bookingLinks: [{ platform: "booking.com", label: u.label, url: u.url }],
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updated);
}

await client.end();
