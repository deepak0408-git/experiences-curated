import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-chennai-muecfeei";

// The Savera has no bookable Booking.com listing (confirmed by founder,
// 9 Oct 2026) — omitted here rather than left as a placeholder/search link.
const bookingLinks = [
  {
    platform: "booking.com",
    label: "The Raintree, St Mary's Road",
    url: "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fraintree-st-mary-s.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D28269701_411174419_2_1_0_1318383%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D28269701_411174419_2_1_0_1318383%26hpos%3D1%26matching_block_id%3D28269701_411174419_2_1_0_1318383%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D28269701_411174419_2_1_0_1318383_5264595%26srepoch%3D1791534406%26srpvid%3D03f03b62662f0773%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "booking.com",
    label: "Grand Chennai by GRT",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fgrt-grand-chennai-chennai.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D107088202_433124506_2_1_0_1182171%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D1070882%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D107088202_433124506_2_1_0_1182171%26hpos%3D1%26matching_block_id%3D107088202_433124506_2_1_0_1182171%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D107088202_433124506_2_1_0_1182171_6156900%26srepoch%3D1791534598%26srpvid%3D62243bbf51e91277%26type%3Dtotal%26ucfs%3D1%26",
  },
];

const [updated] = await db
  .update(experiences)
  .set({
    bookingLinks,
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", updated);
