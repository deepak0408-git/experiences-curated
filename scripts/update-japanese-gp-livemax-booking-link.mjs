import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Real, founder-supplied CJ Affiliate tracked Booking.com link for Hotel
// LiVEMAX Nagoya-Shinkansenguchi — the pack's own budget pick in
// HotelsSpoke.tsx ("Which specific stay we'd pick"). URL's own booking.com
// slug is a garbled/transliterated Japanese hotel name
// ("hoteruribumatukusuming-gu-wu-xin-gan-xian-kou") — confirmed with the
// founder 29 Sep 2026 that this resolves to Hotel LiVEMAX
// Nagoya-Shinkansenguchi before wiring in. Appends to the existing
// bookingLinks array (Nagoya Marriott Associa added earlier same session
// via scripts/update-japanese-gp-marriott-booking-link.mjs) rather than
// overwriting it.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-where-to-stay";

const newLink = {
  platform: "booking.com",
  label: "Hotel LiVEMAX Nagoya-Shinkansenguchi",
  url: "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fjp%2Fhoteruribumatukusuming-gu-wu-xin-gan-xian-kou.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-b206c0b0-2c3b-4b31-b259-607e25beb2ce%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D707269201_382520695_2_0_0%26checkin%3D2027-04-08%26checkout%3D2027-04-12%26dest_id%3D7072692%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D707269201_382520695_2_0_0%26hpos%3D1%26matching_block_id%3D707269201_382520695_2_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D707269201_382520695_2_0_0__39891852%26srepoch%3D1790701740%26srpvid%3D1486abcf5e51642af9ec13e3f855175b%26type%3Dtotal%26ucfs%3D1%26",
};

try {
  const [existing] = await db
    .select({ id: experiences.id, bookingLinks: experiences.bookingLinks })
    .from(experiences)
    .where(eq(experiences.slug, SLUG));

  const updatedLinks = [...(existing.bookingLinks ?? []), newLink];

  const result = await db
    .update(experiences)
    .set({ bookingLinks: updatedLinks })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, bookingLinks: experiences.bookingLinks });

  console.log("✓ Updated bookingLinks:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
