import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Nearest bookable airport per destination — researched and confirmed with
// user 19 Jul 2026. Belgian Ardennes -> BRU chosen over the geographically
// closer LGG (Liège) because LGG has very limited scheduled passenger
// service and won't return usable fares for real flight-price seeding.
const DESTINATIONS = [
  { destId: "101b815a-ba64-4484-aad6-63721a44ed85", name: "Belgian Ardennes", iata: "BRU" },
  { destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca", name: "Milan", iata: "MXP" },
  { destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca", name: "Abu Dhabi", iata: "AUH" },
  { destId: "fb782de2-bbe6-410f-b466-2a4e628cda10", name: "New York", iata: "JFK" },
];

for (const d of DESTINATIONS) {
  await sql`
    UPDATE destinations SET nearest_airport_iata = ${d.iata} WHERE id = ${d.destId}
  `;
  console.log(`✓ ${d.name} -> ${d.iata}`);
}

await sql.end();
