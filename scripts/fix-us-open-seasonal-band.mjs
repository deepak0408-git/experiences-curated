import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const NEW_YORK_DEST_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";

// Real US Open flight rows were seeded with band "sep" but the event's real
// start_date is Aug 30 — getPlannerEvents() derives "aug" from start_date,
// so these rows were never actually matchable. Rename sep -> aug.
const updated = await sql`
  UPDATE planner_flight_cost
  SET seasonal_band = 'aug', last_updated = now()
  WHERE destination_id = ${NEW_YORK_DEST_ID} AND seasonal_band = 'sep'
  RETURNING origin_market
`;
console.log(`✓ Renamed ${updated.length} 'sep' rows -> 'aug' for New York (US Open)`);

await sql.end();
