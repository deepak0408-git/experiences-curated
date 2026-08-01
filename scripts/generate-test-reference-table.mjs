import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const DESTS = [
  { destId: "101b815a-ba64-4484-aad6-63721a44ed85", name: "Belgian Ardennes", event: "Belgian GP", eventBand: "jul", otherBand: "dec" },
  { destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca", name: "Milan", event: "Italian GP", eventBand: "sep", otherBand: "dec" },
  { destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca", name: "Abu Dhabi", event: "Abu Dhabi GP", eventBand: "dec", otherBand: "jun" },
  { destId: "fb782de2-bbe6-410f-b466-2a4e628cda10", name: "New York", event: "US Open", eventBand: "aug", otherBand: "dec" },
];

const CITIES = ["New York City", "London", "Tokyo", "Sydney", "Dubai", "Johannesburg", "Sao Paulo"];

for (const dest of DESTS) {
  console.log(`\n=== ${dest.name} (${dest.event}, real band = ${dest.eventBand}) ===`);
  console.log(`Origin`.padEnd(20), `Event price (${dest.eventBand})`.padEnd(22), `Test decoy (${dest.otherBand})`);
  for (const city of CITIES) {
    const rows = await sql`
      SELECT seasonal_band, cost_low, cost_high FROM planner_flight_cost
      WHERE destination_id = ${dest.destId} AND origin_market = ${city}
    `;
    const eventRow = rows.find(r => r.seasonal_band === dest.eventBand);
    const otherRow = rows.find(r => r.seasonal_band === dest.otherBand);
    const eventStr = eventRow ? `$${eventRow.cost_low}-${eventRow.cost_high}` : "—";
    const otherStr = otherRow ? `$${otherRow.cost_low}-${otherRow.cost_high}` : "—";
    console.log(city.padEnd(20), eventStr.padEnd(22), otherStr);
  }
}
await sql.end();
