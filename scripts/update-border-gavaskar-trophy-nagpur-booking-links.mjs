import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-nagpur-muec4r6c";

const bookingLinks = [
  {
    platform: "booking.com",
    label: "Radisson Blu Hotel, Nagpur",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fradisson-blu-nagpur.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D42496801_204050534_2_1_0_28110%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D424968%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D42496801_204050534_2_1_0_28110%26hpos%3D1%26matching_block_id%3D42496801_204050534_2_1_0_28110%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D42496801_204050534_2_1_0_28110_7500000%26srepoch%3D1791534215%26srpvid%3D12573b007aa30e6d%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "booking.com",
    label: "Le Méridien Nagpur",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fle-meridien-nagpur.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D25211011_428114136_2_42_0%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D252110%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D25211011_428114136_2_42_0%26hpos%3D1%26matching_block_id%3D25211011_428114136_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D25211011_428114136_2_42_0__17749500%26srepoch%3D1791534222%26srpvid%3D644c3b06d438127f%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "booking.com",
    label: "Hotel Centre Point",
    url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fcentre-point-nagpur.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D50615908_420929376_2_41_0%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D506159%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D50615908_420929376_2_41_0%26hpos%3D1%26matching_block_id%3D50615908_420929376_2_41_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D50615908_420929376_2_41_0__4510000%26srepoch%3D1791534250%26srpvid%3D92033b14e64809fd%26type%3Dtotal%26ucfs%3D1%26",
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
