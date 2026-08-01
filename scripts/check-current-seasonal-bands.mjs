import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT d.name, pfc.seasonal_band, count(*) as cnt
  FROM planner_flight_cost pfc JOIN destinations d ON d.id = pfc.destination_id
  WHERE d.id IN (
    '101b815a-ba64-4484-aad6-63721a44ed85', -- Belgian Ardennes
    '0b0d8f9a-911d-4cc7-8049-50e4685958ca', -- Milan
    'd4d2ed49-0217-441d-8d1f-38c9b03db2ca', -- Abu Dhabi
    'fb782de2-bbe6-410f-b466-2a4e628cda10'  -- New York
  )
  GROUP BY d.name, pfc.seasonal_band
  ORDER BY d.name
`;
console.log(rows);
await sql.end();
