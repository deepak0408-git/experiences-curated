import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "brazilian-gp-budget-hotels-morumbi-mtx71o4h";

// Real Booking.com affiliate links (CJ redirects), provided by the founder
// 12 Sep 2026. Blue Tree Premium Verbo Divino verified via
// isRealAffiliateLink()'s own detection logic — genuine CJ redirect
// (anrdoezrs.net), embedded destination resolves to
// booking.com/hotel/br/blue-tree-premium-verbo-divino.en-gb.html. Never
// constructed by Claude, per feedback_affiliate_link_generation. Ibis
// Budget Sao Paulo Morumbi (the experience's other named hotel) still
// needs its own separate link — not yet provided.
const BLUE_TREE_URL =
  "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fbr%2Fblue-tree-premium-verbo-divino.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AsK3lNUGwAIB0gIkYmM5YTVhZjctYWEyMi00YjAyLWJjZjktOTY2NzgwMTRlZTc22AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D24989812_91468814_0_1_0_411779%26checkin%3D2026-11-05%26checkout%3D2026-11-09%26dest_id%3D249898%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D24989812_91468814_0_1_0_411779%26hpos%3D1%26matching_block_id%3D24989812_91468814_0_1_0_411779%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D24989812_91468814_0_1_0_411779_842100%26srepoch%3D1789205540%26srpvid%3D4c6742fd901c0baa%26type%3Dtotal%26ucfs%3D1%26";

const [current] = await sql`SELECT booking_links FROM experiences WHERE slug = ${SLUG}`;
const existing = current.booking_links ?? [];
const bookingLinks = [
  ...existing.filter((l) => l.label !== "Blue Tree Premium Verbo Divino"),
  { platform: "booking.com", label: "Blue Tree Premium Verbo Divino", url: BLUE_TREE_URL },
];

await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${SLUG}`;

const [row] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${SLUG}`;
console.log("Updated:", row.title);
console.log(JSON.stringify(row.booking_links, null, 2));
console.log("\nStill needed: Ibis Budget Sao Paulo Morumbi's own affiliate link.");

await sql.end();
