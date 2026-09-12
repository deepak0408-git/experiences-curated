import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-hotel-emiliano-mtx6y6xb";

// Real Booking.com affiliate link (CJ redirect via jdoqocy.com), provided
// by the founder 12 Sep 2026. Verified via isRealAffiliateLink()'s own
// detection logic — genuine CJ redirect, embedded destination resolves to
// booking.com/hotel/br/emiliano.en-gb.html. Never constructed by Claude,
// per feedback_affiliate_link_generation.
const AFFILIATE_URL =
  "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fbr%2Femiliano.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AsK3lNUGwAIB0gIkYmM5YTVhZjctYWEyMi00YjAyLWJjZjktOTY2NzgwMTRlZTc22AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D34033101_170607076_0_2_0%26checkin%3D2026-11-05%26checkout%3D2026-11-09%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D34033101_170607076_0_2_0%26hpos%3D1%26matching_block_id%3D34033101_170607076_0_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D34033101_170607076_0_2_0__2599800%26srepoch%3D1789205479%26srpvid%3Dd9f642f2f5400dbf%26type%3Dtotal%26ucfs%3D1%26";

const bookingLinks = [
  { platform: "booking.com", label: "Hotel Emiliano", url: AFFILIATE_URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;

const [row] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
console.log("Updated:", row.title);
console.log(JSON.stringify(row.booking_links, null, 2));

await sql.end();
