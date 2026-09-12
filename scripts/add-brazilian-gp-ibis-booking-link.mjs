import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-budget-hotels-morumbi-mtx71o4h";

// Real Booking.com affiliate link (CJ redirect via kqzyfj.com), provided
// by the founder 12 Sep 2026. Verified via isRealAffiliateLink()'s own
// detection logic — genuine CJ redirect, embedded destination resolves to
// booking.com/hotel/br/ibis-budget-sao-paulo-morumbi.en-gb.html. Never
// constructed by Claude, per feedback_affiliate_link_generation. Completes
// this experience's 2 named hotels (Blue Tree Premium Verbo Divino added
// in the prior script run).
const IBIS_URL =
  "https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fbr%2Fibis-budget-sao-paulo-morumbi.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AsK3lNUGwAIB0gIkYmM5YTVhZjctYWEyMi00YjAyLWJjZjktOTY2NzgwMTRlZTc22AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D231122903_100039455_2_1_0%26checkin%3D2026-11-05%26checkout%3D2026-11-09%26dest_id%3D2311229%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D231122903_100039455_2_1_0%26hpos%3D1%26matching_block_id%3D231122903_100039455_2_1_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D231122903_100039455_2_1_0__344200%26srepoch%3D1789205624%26srpvid%3De42b431cc6b20260%26type%3Dtotal%26ucfs%3D1%26";

const [current] = await sql`SELECT booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== "Ibis Budget Sao Paulo Morumbi"),
  { platform: "booking.com", label: "Ibis Budget Sao Paulo Morumbi", url: IBIS_URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;

const [row] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
console.log("Updated:", row.title);
console.log(JSON.stringify(row.booking_links, null, 2));

await sql.end();
