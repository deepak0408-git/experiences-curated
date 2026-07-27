import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Adds Cairo, Casablanca, Nairobi to the Africa region — same region-level
// price bands already seeded for Johannesburg (test data, per-region not
// per-city, see seed-planner-flight-regions.mjs for the full rationale).
const NEW_AFRICA_CITIES = ["Cairo", "Casablanca", "Nairobi"];

const EVENTS = [
  { destId: "101b815a-ba64-4484-aad6-63721a44ed85", name: "Belgian GP", band: "jul", low: 500, high: 750 },
  { destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca", name: "Italian GP", band: "sep", low: 520, high: 780 },
  { destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca", name: "Abu Dhabi GP", band: "dec", low: 400, high: 650 },
  { destId: "fb782de2-bbe6-410f-b466-2a4e628cda10", name: "US Open", band: "sep", low: 750, high: 1100 },
];

let count = 0;
for (const event of EVENTS) {
  for (const city of NEW_AFRICA_CITIES) {
    await sql`
      INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high)
      VALUES (${event.destId}, ${city}, ${event.band}, ${event.low}, ${event.high})
      ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
        cost_low = ${event.low}, cost_high = ${event.high}, last_updated = now()
    `;
    count++;
  }
  console.log(`✓ Seeded ${event.name} — Cairo, Casablanca, Nairobi`);
}

console.log(`\nDone. ${count} planner_flight_cost rows seeded (3 cities × 4 events).`);

await sql.end();
