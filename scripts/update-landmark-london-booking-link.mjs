// Real Booking.com affiliate link for The Landmark London — founder-supplied
// 1 Oct 2026, wired into experiences.bookingLinks so it flows automatically
// into both the experience page's "Book" field and the destination page's
// Where to Stay affiliate sidebar (both read from this same column).
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(experiences)
  .set({
    bookingLinks: [
      {
        platform: "Booking.com",
        label: "The Landmark London",
        url: "https://www.jdoqocy.com/click-101774030-12937117?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fgb%2Flandmark-london-ld.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-557a3f4b-925b-4f9b-93fa-85f4376a6613%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D3060301_95154647_2_2_0%26checkin%3D2027-06-27%26checkout%3D2027-07-01%26dest_id%3D30603%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D3060301_95154647_2_2_0%26hpos%3D1%26matching_block_id%3D3060301_95154647_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D3060301_95154647_2_2_0__221324%26srepoch%3D1790852364%26srpvid%3D7c88d1e11393ff34875c5e76419b1c10%26type%3Dtotal%26ucfs%3D1%26",
      },
    ],
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, "the-landmark-london-for-the-lord-s-odi-mp49n5ln"));

console.log("✓ the-landmark-london-for-the-lord-s-odi-mp49n5ln bookingLinks updated.");
await client.end();
