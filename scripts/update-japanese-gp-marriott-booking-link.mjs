import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Real, founder-supplied CJ Affiliate tracked Booking.com link for the
// Nagoya Marriott Associa Hotel — the pack's own top pick in HotelsSpoke.tsx
// ("Which specific stay we'd pick"). Added 29 Sep 2026, per
// feedback_booking_com_affiliate_links memory's standing workflow.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const bookingLinks = [
  {
    platform: "booking.com",
    label: "Nagoya Marriott Associa Hotel",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fjp%2Fnagoya-marriott-associa.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-b206c0b0-2c3b-4b31-b259-607e25beb2ce%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2027-04-08%26checkout%3D2027-04-12%26dest_id%3D668083%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1790701569%26srpvid%3Dc200203bb2e42b356e526566c3fc3366%26type%3Dtotal%26ucfs%3D1%26",
  },
];

try {
  const result = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(like(experiences.slug, "japanese-gp-suzuka-where-to-stay%"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("✓ Updated bookingLinks:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
