import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "ac9439b1-54bd-4ef2-ba9c-85cf34335e6f"; // Staying in Pest

const bookingLinks = [
  {
    platform: "Carat Boutique Hotel (Booking.com)",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fhu%2Fboutique-cosmo.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asz5zNIGwAIB0gIkNTgxYmM0NjEtMmQyMS00OGQ4LWFjYTktN2VmZGMwZDAwZjY52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D7529715_91906322_0_1_0%26checkin%3D2026-07-23%26checkout%3D2026-07-26%26dest_id%3D75297%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D7529715_91906322_0_1_0%26hpos%3D1%26matching_block_id%3D7529715_91906322_0_1_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D7529715_91906322_0_1_0__80020%26srepoch%3D1783840948%26srpvid%3D3b4433d92b750162%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Florin Apart Hotel (Booking.com)",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fhu%2Fflorinhotel.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asz5zNIGwAIB0gIkNTgxYmM0NjEtMmQyMS00OGQ4LWFjYTktN2VmZGMwZDAwZjY52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D29973001_0_2_0_0%26checkin%3D2026-07-23%26checkout%3D2026-07-26%26dest_id%3D299730%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D29973001_0_2_0_0%26hpos%3D1%26matching_block_id%3D29973001_0_2_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D29973001_0_2_0_0__70748%26srepoch%3D1783840983%26srpvid%3D489f33ea6feb055b%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Danubius Hotel Astoria (Booking.com)",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fhu%2Fastoria.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asz5zNIGwAIB0gIkNTgxYmM0NjEtMmQyMS00OGQ4LWFjYTktN2VmZGMwZDAwZjY52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D7501003_93706157_2_2_0%26checkin%3D2026-07-23%26checkout%3D2026-07-26%26dest_id%3D75010%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D7501003_93706157_2_2_0%26hpos%3D1%26matching_block_id%3D7501003_93706157_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D7501003_93706157_2_2_0__75379%26srepoch%3D1783841017%26srpvid%3D5a1f33fc93880550%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Marone Suites Budapest (Booking.com)",
    url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fhu%2Fmarone-suites-budapest.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asz5zNIGwAIB0gIkNTgxYmM0NjEtMmQyMS00OGQ4LWFjYTktN2VmZGMwZDAwZjY52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D1370738401_419007909_2_2_0%26checkin%3D2026-07-23%26checkout%3D2026-07-26%26dest_id%3D13707384%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D1370738401_419007909_2_2_0%26hpos%3D1%26matching_block_id%3D1370738401_419007909_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D1370738401_419007909_2_2_0__60104%26srepoch%3D1783841055%26srpvid%3Dd7c1340ed0fa0f31%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "Centrooms House (Booking.com)",
    url: "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fhu%2Fcentrooms-house.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Asz5zNIGwAIB0gIkNTgxYmM0NjEtMmQyMS00OGQ4LWFjYTktN2VmZGMwZDAwZjY52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-07-23%26checkout%3D2026-07-26%26dest_id%3D25421%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1783841092%26srpvid%3D3b44342136d1018e%26type%3Dtotal%26ucfs%3D1%26#no_availability_msg",
  },
];

const [result] = await db
  .update(experiences)
  .set({ bookingLinks })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ ${bookingLinks.length} Booking.com affiliate links added: ${result.title}`);

await client.end();
