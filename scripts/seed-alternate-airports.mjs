import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Budget-alternate airports — researched and confirmed with user 19 Jul
// 2026. Only these 6 of 16 destinations have a genuine, sourced secondary
// airport travelers actually use as a deliberate fare/route trade-off; the
// other 10 were explicitly checked and correctly found to have none (see
// design doc "Alternate-airport lever" section for the full research).
const ALTERNATES = [
  {
    destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca",
    name: "Abu Dhabi",
    iata: "DXB",
    note: "Some international travelers route through Dubai (DXB) for better fares/routes, then bus (~2-2.5hr, ~25 AED) or taxi (~90min, ~250-330 AED) to Abu Dhabi. AUH remains the recommended default — DXB is a fallback for travelers whose travel origin has better Dubai connections.",
  },
  {
    destId: "101b815a-ba64-4484-aad6-63721a44ed85",
    name: "Belgian Ardennes",
    iata: "CRL",
    note: "Charleroi (CRL) is a Ryanair base and often cheaper than Brussels — Flibco shuttle to Brussels, ~€14-20/person, ~55-60min, buses every ~20min.",
  },
  {
    destId: "0d01105a-1e01-40a7-91af-89299939389b",
    name: "Budapest",
    iata: "BTS",
    note: "Bratislava (BTS) is sometimes cheaper on budget carriers — Flixbus/RegioJet to Budapest, ~2.5hr, from ~€6.50.",
  },
  {
    destId: "75758888-28b9-4e09-82ba-f05681ecc904",
    name: "London",
    iata: "STN",
    note: "Stansted (STN, Ryanair/Wizz) is often cheaper than Heathrow on budget-carrier routes — rail/coach into central London, ~45min-1hr, £9-25 depending on service.",
  },
  {
    destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca",
    name: "Milan",
    iata: "BGY",
    note: "Bergamo (BGY) is Ryanair's major Italian base — often cheaper than Malpensa. Bus to Milan, ~€15-25, 45-60min.",
  },
  {
    destId: "fb782de2-bbe6-410f-b466-2a4e628cda10",
    name: "New York",
    iata: "EWR",
    note: "Newark (EWR, United's hub) is sometimes cheaper on international long-haul fares than JFK. NJ Transit into Manhattan, ~$20, ~30-45min.",
  },
];

for (const d of ALTERNATES) {
  await sql`
    UPDATE destinations
    SET budget_alternate_airport_iata = ${d.iata}, alternate_airport_note = ${d.note}
    WHERE id = ${d.destId}
  `;
  console.log(`✓ ${d.name} -> ${d.iata}`);
}

await sql.end();
