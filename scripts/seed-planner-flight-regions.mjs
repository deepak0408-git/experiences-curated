import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Test data only — placeholder regional flight bands, not real pricing.
// Confirmed with user 18 Jul 2026: seed per-REGION (5 bands), not per-city
// (45 cities). Real per-city data is a documented production TODO in the
// design doc. Every city in ORIGIN_MARKETS' region shares its region's row.
//
// Regions: North America, Europe, Asia-Pacific, Latin America, Africa
// Each event's existing "unspecified" row is treated as the rough North
// America price (that's what it was implicitly modeled on); other regions
// are derived relative to actual geography — e.g. Europe is cheap to fly to
// Belgium/Italy (short-haul) but expensive to Abu Dhabi is NOT true (Gulf
// is closer to Europe than to NA) — priced with real geography in mind, not
// just scaled uniformly.

const EVENTS = [
  { destId: "101b815a-ba64-4484-aad6-63721a44ed85", name: "Belgian GP", band: "jul" },
  { destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca", name: "Italian GP", band: "sep" },
  { destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca", name: "Abu Dhabi GP", band: "dec" },
  { destId: "fb782de2-bbe6-410f-b466-2a4e628cda10", name: "US Open", band: "sep" },
];

// Region -> { low, high } per event, in USD. Rough real-world geography:
// - Belgian/Italian GP (Europe): cheapest from Europe, moderate from NA,
//   pricier from Asia-Pacific/Latin America/Africa
// - Abu Dhabi GP (Middle East): cheapest from Africa/Asia (closer), moderate
//   from Europe, pricier from NA/Latin America
// - US Open (New York): cheapest from North America, moderate from Europe/
//   Latin America, pricier from Asia-Pacific/Africa
const REGION_FLIGHTS = {
  "Belgian GP": {
    "North America": { low: 450, high: 650 },
    "Europe": { low: 80, high: 180 },
    "Asia-Pacific": { low: 650, high: 950 },
    "Latin America": { low: 700, high: 1000 },
    "Africa": { low: 500, high: 750 },
  },
  "Italian GP": {
    "North America": { low: 480, high: 680 },
    "Europe": { low: 90, high: 200 },
    "Asia-Pacific": { low: 620, high: 920 },
    "Latin America": { low: 720, high: 1020 },
    "Africa": { low: 520, high: 780 },
  },
  "Abu Dhabi GP": {
    "North America": { low: 700, high: 1000 },
    "Europe": { low: 350, high: 550 },
    "Asia-Pacific": { low: 300, high: 500 },
    "Latin America": { low: 900, high: 1300 },
    "Africa": { low: 400, high: 650 },
  },
  "US Open": {
    "North America": { low: 120, high: 300 },
    "Europe": { low: 400, high: 650 },
    "Asia-Pacific": { low: 800, high: 1200 },
    "Latin America": { low: 350, high: 600 },
    "Africa": { low: 750, high: 1100 },
  },
};

const ORIGIN_MARKETS_BY_REGION = {
  "North America": [
    "New York City", "Los Angeles", "Chicago", "Toronto", "Boston", "Dallas",
    "Washington D.C.", "Atlanta", "San Francisco", "Philadelphia", "Miami",
    "Montreal", "Vancouver",
  ],
  "Europe": [
    "London", "Madrid", "Paris", "Manchester", "Barcelona", "Munich", "Milan",
    "Rome", "Berlin", "Dublin", "Amsterdam", "Stockholm", "Zurich", "Moscow",
  ],
  "Asia-Pacific": [
    "Tokyo", "Sydney", "Melbourne", "Seoul", "Singapore", "Mumbai", "Bangalore",
    "Beijing", "Shanghai", "Hong Kong", "Manila", "New Delhi", "Dubai", "Doha",
  ],
  "Latin America": ["Sao Paulo", "Rio de Janeiro", "Mexico City", "Buenos Aires"],
  "Africa": ["Cairo", "Casablanca", "Johannesburg", "Nairobi"],
};

let count = 0;
for (const event of EVENTS) {
  const regionPrices = REGION_FLIGHTS[event.name];
  for (const [region, cities] of Object.entries(ORIGIN_MARKETS_BY_REGION)) {
    const { low, high } = regionPrices[region];
    for (const city of cities) {
      await sql`
        INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high)
        VALUES (${event.destId}, ${city}, ${event.band}, ${low}, ${high})
        ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
          cost_low = ${low}, cost_high = ${high}, last_updated = now()
      `;
      count++;
    }
  }
  console.log(`✓ Seeded ${event.name} — 45 city rows across 5 regions`);
}

console.log(`\nDone. ${count} planner_flight_cost rows seeded (45 cities × 4 events).`);
console.log("Existing 'unspecified' rows kept as-is (fallback for any origin not yet in the list).");

await sql.end();
