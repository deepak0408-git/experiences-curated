import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Test-only second seasonal band per destination, deliberately priced LOWER
// than the existing row so a wrong-band pickup is visually obvious. Purpose:
// prove getPlannerEvents()'s seasonalBand-matching fix actually discriminates
// between two real rows for the same destination, not just working by
// coincidence because only one band existed. Confirmed with user 19 Jul 2026.
//
// Belgian Ardennes, Milan, New York: real event month is NOT december, so
// adding a "dec" row here is a genuinely distinct second band.
// Abu Dhabi: real event month IS december (Abu Dhabi GP), so a same-band
// "dec" row would just overwrite — added a "jun" row instead as the
// distractor, to prove Abu Dhabi GP (Dec) does NOT pick up the cheaper June
// test price.

const TEST_ROWS = [
  // destId, name, testBand, discount off existing price
  { destId: "101b815a-ba64-4484-aad6-63721a44ed85", name: "Belgian Ardennes", band: "dec" },
  { destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca", name: "Milan", band: "dec" },
  { destId: "fb782de2-bbe6-410f-b466-2a4e628cda10", name: "New York", band: "dec" },
  { destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca", name: "Abu Dhabi", band: "jun" },
];

for (const dest of TEST_ROWS) {
  const existingRows = await sql`
    SELECT origin_market, cost_low, cost_high FROM planner_flight_cost WHERE destination_id = ${dest.destId}
  `;
  let count = 0;
  for (const row of existingRows) {
    // Deliberately ~30% lower than the real row, so a wrong-band pickup is
    // visually obvious (e.g. Belgian GP suddenly showing much cheaper flights).
    const newLow = Math.round(Number(row.cost_low) * 0.7);
    const newHigh = Math.round(Number(row.cost_high) * 0.7);
    await sql`
      INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high)
      VALUES (${dest.destId}, ${row.origin_market}, ${dest.band}, ${newLow}, ${newHigh})
      ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
        cost_low = ${newLow}, cost_high = ${newHigh}, last_updated = now()
    `;
    count++;
  }
  console.log(`✓ ${dest.name} — seeded ${count} rows for band "${dest.band}" (~30% cheaper than existing)`);
}

console.log("\nDone. Each destination now has 2 seasonal bands — verify getPlannerEvents() still picks the EVENT's real month, not the cheaper test band.");

await sql.end();
