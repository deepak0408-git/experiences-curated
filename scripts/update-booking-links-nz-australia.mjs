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
    title: "Where to Stay in Perth for the First Test",
    bookingLinks: [
      { platform: "booking.com", label: "Crown Towers Perth", url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fcrown-towers-perth.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D2401859%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1786979090%26srpvid%3D438f6a0403eb0e0d%26type%3Dtotal%26ucfs%3D1%26#no_availability_msg" },
      { platform: "booking.com", label: "InterContinental Perth City Centre", url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fintercontinental-perth-city-centre.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D248985404_411987417_2_42_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D2489854%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D248985404_411987417_2_42_0%26hpos%3D1%26matching_block_id%3D248985404_411987417_2_42_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D248985404_411987417_2_42_0__111400%26srepoch%3D1786979429%26srpvid%3Dd3a76aaf61f408ff%26type%3Dtotal%26ucfs%3D1%26" },
    ],
  },
  {
    title: "Where to Stay in Adelaide — City vs. North Adelaide",
    bookingLinks: [
      { platform: "booking.com", label: "Oval Hotel Adelaide", url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Foval.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D612311101_244993096_2_2_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D6123111%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D612311101_244993096_2_2_0%26hpos%3D1%26matching_block_id%3D612311101_244993096_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D612311101_244993096_2_2_0__95030%26srepoch%3D1786979474%26srpvid%3D0b256ac56acb0583%26type%3Dtotal%26ucfs%3D1%26" },
      { platform: "booking.com", label: "InterContinental Adelaide", url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fintercontinental-adelaide.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D17952422_411987680_2_2_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D6123111%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D2%26highlighted_blocks%3D17952422_411987680_2_2_0%26hpos%3D2%26matching_block_id%3D17952422_411987680_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D17952422_411987680_2_2_0__76500%26srepoch%3D1786979478%26srpvid%3D0b256ac56acb0583%26type%3Dtotal%26ucfs%3D1%26" },
    ],
  },
  {
    title: "Where to Stay in Melbourne for Boxing Day",
    bookingLinks: [
      { platform: "booking.com", label: "Pullman East Melbourne", url: "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fpullman-melbourne-on-the-park.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D3803428_95161951_2_34_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D38034%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D3803428_95161951_2_34_0%26hpos%3D1%26matching_block_id%3D3803428_95161951_2_34_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D3803428_95161951_2_34_0__88900%26srepoch%3D1786979571%26srpvid%3D8c936af2baa20421%26type%3Dtotal%26ucfs%3D1%26" },
      { platform: "booking.com", label: "Sofitel Melbourne on Collins", url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fsofitel-melbourne-on-collins.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D3582614_95157711_2_2_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D35826%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D3582614_95157711_2_2_0%26hpos%3D1%26matching_block_id%3D3582614_95157711_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D3582614_95157711_2_2_0__127980%26srepoch%3D1786979604%26srpvid%3Dd1256affe5c81643%26type%3Dtotal%26ucfs%3D1%26" },
    ],
  },
  {
    title: "Where to Stay in Sydney for the Fourth Test",
    bookingLinks: [
      { platform: "booking.com", label: "Mrs Banks Hotel (Paddington)", url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fmrs-banks.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D258888801_129024896_2_0_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dest_id%3D2588888%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D258888801_129024896_2_0_0%26hpos%3D1%26matching_block_id%3D258888801_129024896_2_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D258888801_129024896_2_0_0__98000%26srepoch%3D1786979635%26srpvid%3Dc8096b0ff4ac1a3b%26type%3Dtotal%26ucfs%3D1%26" },
      { platform: "booking.com", label: "QT Sydney CBD", url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fqtsydney.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4As3FjNQGwAIB0gIkZmZhMzY0OWUtNDBhOS00NGQ4LTkxNmMtZWVkZDNiMThjY2Ri2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D44939902_330256184_0_2_0%26checkin%3D2026-12-09%26checkout%3D2026-12-12%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D44939902_330256184_0_2_0%26hpos%3D1%26matching_block_id%3D44939902_330256184_0_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D44939902_330256184_0_2_0__209570%26srepoch%3D1786979667%26srpvid%3Db3c76b1e358401e2%26type%3Dtotal%26ucfs%3D1%26" },
    ],
  },
];

try {
  for (const { title, bookingLinks } of updates) {
    const [result] = await db.update(experiences)
      .set({ bookingLinks })
      .where(eq(experiences.title, title))
      .returning({ id: experiences.id, title: experiences.title, bookingLinks: experiences.bookingLinks });

    if (!result) {
      console.error(`NOT FOUND: ${title}`);
      continue;
    }
    console.log(`Updated: ${result.title} — ${result.bookingLinks.map((l) => l.label).join(", ")}`);
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
