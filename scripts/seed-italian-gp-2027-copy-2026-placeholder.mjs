import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Italian GP 2027 planner data -- INTERIM PLACEHOLDER, copied from real 2026
// research. NOT fresh 2027 research.
//
// Why: Italian GP 2027 (3-5 Sep 2027) needs a live planner entry now so the
// pack can go live, but its real flight search window (~29 Aug-10 Sep 2027)
// sits ~11.5 months from today (19 Sep 2026) -- past Google Flights'
// confirmed ~10-month booking horizon. Live-probed 19 Sep 2026
// (Amsterdam->Milan, scripts/_flight-research-tool.mjs): Google Flights
// returned "date too far in the future" / 0 results; Kayak alone returned
// real data. Per the planner-data-researcher skill, 2 mandatory sources are
// required for Flights -- proceeding single-source wasn't the founder's
// call here.
//
// Founder's explicit decision, 19 Sep 2026: copy 2026's real Flights/Hotels/
// Tickets data forward into 2027 rows now as a placeholder, and come back to
// do genuine 2027 research in ~2 months once Google Flights' horizon opens
// for the real dates. This script is that copy -- NOT a substitute for the
// real research pass. When the real pass runs, it INSERTs new edition_year
// 2027 rows the normal way (unique constraint is on
// destination/event + tier/season + edition_year), so re-running real
// research later requires first deleting these placeholder rows (or the
// insert will collide) -- see the companion note below.
//
// Tables copied: planner_flight_cost (49 rows), planner_hotel_tier_cost
// (4 rows), planner_ticket_tier_cost (4 rows). planner_destination_bands
// is untouched -- it's not edition-scoped (Local Travel/Food don't vary by
// edition per the skill).
//
// refreshPass is set to "initial" on every copied row -- this genuinely is
// the first 2027-edition pass on record, even though the underlying numbers
// are carried over rather than freshly researched.

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP

const FROM_EDITION = 2026;
const TO_EDITION = 2027;

// Guard: don't double-insert if this script is re-run.
const existingFlights = await sql`
  SELECT count(*) FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND edition_year = ${TO_EDITION}
`;
const existingHotels = await sql`
  SELECT count(*) FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID} AND edition_year = ${TO_EDITION}
`;
const existingTickets = await sql`
  SELECT count(*) FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID} AND edition_year = ${TO_EDITION}
`;

if (Number(existingFlights[0].count) > 0 || Number(existingHotels[0].count) > 0 || Number(existingTickets[0].count) > 0) {
  console.log("2027 rows already exist for Italian GP -- aborting to avoid duplicates.");
  console.log({ flights: existingFlights[0].count, hotels: existingHotels[0].count, tickets: existingTickets[0].count });
  await sql.end();
  process.exit(1);
}

// --- Flights ---
const flights2026 = await sql`
  SELECT origin_market, seasonal_band, cost_low, cost_high, currency
  FROM planner_flight_cost
  WHERE destination_id = ${DESTINATION_ID} AND edition_year = ${FROM_EDITION}
`;

let flightCount = 0;
for (const row of flights2026) {
  await sql`
    INSERT INTO planner_flight_cost
      (destination_id, origin_market, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass)
    VALUES
      (${DESTINATION_ID}, ${row.origin_market}, ${row.seasonal_band}, ${TO_EDITION}, ${row.cost_low}, ${row.cost_high}, ${row.currency}, 'initial')
  `;
  flightCount++;
}
console.log(`Flights copied: ${flightCount}`);

// --- Hotels ---
const hotels2026 = await sql`
  SELECT tier, seasonal_band, cost_low, cost_high, currency
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID} AND edition_year = ${FROM_EDITION}
`;

let hotelCount = 0;
for (const row of hotels2026) {
  await sql`
    INSERT INTO planner_hotel_tier_cost
      (destination_id, tier, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass)
    VALUES
      (${DESTINATION_ID}, ${row.tier}, ${row.seasonal_band}, ${TO_EDITION}, ${row.cost_low}, ${row.cost_high}, ${row.currency}, 'initial')
  `;
  hotelCount++;
}
console.log(`Hotels copied: ${hotelCount}`);

// --- Tickets ---
const tickets2026 = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high, currency
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID} AND edition_year = ${FROM_EDITION}
`;

let ticketCount = 0;
for (const row of tickets2026) {
  await sql`
    INSERT INTO planner_ticket_tier_cost
      (sporting_event_id, tier, event_tier_label, edition_year, cost_low, cost_high, currency)
    VALUES
      (${EVENT_ID}, ${row.tier}, ${row.event_tier_label}, ${TO_EDITION}, ${row.cost_low}, ${row.cost_high}, ${row.currency})
  `;
  ticketCount++;
}
console.log(`Tickets copied: ${ticketCount}`);

console.log("\nDone. Italian GP 2027 now has placeholder planner data copied from 2026.");
console.log("REMINDER: re-research for real 2027 dates once Google Flights' booking horizon opens (~mid-Nov 2026 onward), then DELETE these placeholder rows before inserting fresh ones.");

await sql.end();
