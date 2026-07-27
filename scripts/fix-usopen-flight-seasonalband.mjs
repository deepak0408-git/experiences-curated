import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// BUG FIX 23 Jul 2026: getPlannerEvents.ts derives eventSeasonalBand from
// sportingEvents.startDate's month (US Open startDate = Aug 30 -> "aug"),
// not from the Flights methodology's own event-window month choice. US
// Open's flight rows were seeded under "sep" (matching the broader Aug
// 30-Sep 13 window), causing a silent lookup mismatch -- the whole US Open
// card was being skipped from planner results since flightRow never
// matched. Fixed by relabeling seasonalBand to "aug" for all 49 rows --
// same destination, same origins, same $ values, just the band string.
const dest = await sql`SELECT id FROM destinations WHERE name = 'New York'`;
const destinationId = dest[0].id;

const before = await sql`
  SELECT seasonal_band, COUNT(*) as n FROM planner_flight_cost
  WHERE destination_id = ${destinationId} GROUP BY seasonal_band
`;
console.log("Before:", before);

const result = await sql`
  UPDATE planner_flight_cost
  SET seasonal_band = 'aug'
  WHERE destination_id = ${destinationId} AND seasonal_band = 'sep'
  RETURNING id
`;
console.log(`Updated ${result.length} rows`);

const after = await sql`
  SELECT seasonal_band, COUNT(*) as n FROM planner_flight_cost
  WHERE destination_id = ${destinationId} GROUP BY seasonal_band
`;
console.log("After:", after);

await sql.end();
