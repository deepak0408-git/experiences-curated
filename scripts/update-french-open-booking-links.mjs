import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const today = new Date().toISOString().slice(0, 10);

const updates = [
  {
    slug: "hotel-molitor-paris-luxury-stay",
    bookingLinks: [
      {
        platform: "booking.com",
        label: "Hôtel Molitor Paris - MGallery",
        url: "https://www.tkqlhce.com/click-101774030-12319493?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Ffr%2Fmgallery-molitor.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aqn0-9QGwAIB0gIkZDZmYTY5ZmYtOGJjZi00NDlmLWJjNWEtY2UxOWJiNTNiNWU52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D90931201_94576603_2_34_0%26checkin%3D2027-02-04%26checkout%3D2027-02-09%26dest_id%3D909312%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D90931201_94576603_2_34_0%26hpos%3D1%26matching_block_id%3D90931201_94576603_2_34_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D90931201_94576603_2_34_0__177760%26srepoch%3D1788803654%26srpvid%3D519b7de278d20015%26type%3Dtotal%26ucfs%3D1%26",
      },
    ],
  },
  {
    slug: "ibis-boulogne-billancourt-midrange-stay",
    bookingLinks: [
      {
        platform: "booking.com",
        label: "Ibis Boulogne-Billancourt",
        url: "https://www.anrdoezrs.net/click-101774030-12319493?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Ffr%2Fibis-boulogne-billancourt.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aqn0-9QGwAIB0gIkZDZmYTY5ZmYtOGJjZi00NDlmLWJjNWEtY2UxOWJiNTNiNWU52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D54801702_94490404_2_2_0%26checkin%3D2027-02-04%26checkout%3D2027-02-09%26dest_id%3D548017%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D54801702_94490404_2_2_0%26hpos%3D1%26matching_block_id%3D54801702_94490404_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D54801702_94490404_2_2_0__43272%26srepoch%3D1788803703%26srpvid%3D4c937decc0c80452%26type%3Dtotal%26ucfs%3D1%26",
      },
    ],
  },
];

for (const u of updates) {
  const [updated] = await db
    .update(experiences)
    .set({
      bookingLinks: u.bookingLinks,
      lastVerifiedDate: today,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updated);
}

await client.end();
