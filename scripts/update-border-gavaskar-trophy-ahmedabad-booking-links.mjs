import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-ahmedabad-muecpb9t";

const bookingLinks = [
  {
    platform: "booking.com",
    label: "Hyatt Regency Ahmedabad",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fhyatt-regency-ahmedabad.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D131252714_366945747_2_1_0_1316643%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D1312527%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D131252714_366945747_2_1_0_1316643%26hpos%3D1%26matching_block_id%3D131252714_366945747_2_1_0_1316643%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D131252714_366945747_2_1_0_1316643_11133050%26srepoch%3D1791534670%26srpvid%3D3d7e3be27858006a%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "booking.com",
    label: "Novotel Ahmedabad",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fnovotel-ahmedabad.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D69991619_94501121_2_42_0%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D699916%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D69991619_94501121_2_42_0%26hpos%3D1%26matching_block_id%3D69991619_94501121_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D69991619_94501121_2_42_0__6571200%26srepoch%3D1791534677%26srpvid%3Da9a53bea86520ca3%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    platform: "booking.com",
    label: "The House of MG",
    url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fin%2Fthe-house-of-mg.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-7283b6be-8055-47c2-9bcb-071b90660656%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D32125703_358807358_2_42_0%26checkin%3D2027-01-28%26checkout%3D2027-02-02%26dest_id%3D321257%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D32125703_358807358_2_42_0%26hpos%3D1%26matching_block_id%3D32125703_358807358_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D32125703_358807358_2_42_0__13256100%26srepoch%3D1791534693%26srpvid%3D8ea43bf2e46e0c1b%26type%3Dtotal%26ucfs%3D1%26",
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
