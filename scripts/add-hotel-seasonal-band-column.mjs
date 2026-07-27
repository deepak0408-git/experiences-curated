import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// 1. Drop the old unique constraint (destination_id, tier)
await sql`
  ALTER TABLE planner_hotel_tier_cost
  DROP CONSTRAINT IF EXISTS planner_hotel_tier_cost_dest_tier_unique
`;

// 2. Add the new column, nullable first so we can backfill
await sql`
  ALTER TABLE planner_hotel_tier_cost
  ADD COLUMN IF NOT EXISTS seasonal_band varchar(20)
`;

// 3. Backfill existing rows with their real event month (lowercase 3-letter,
// matching planner_flight_cost's convention)
// NYC (US Open) = Aug/Sep 2026 window -> Aug 28-Sep 4 -> "aug"
// Milan (Italian GP) = Sep 2-9 2026 -> "sep"
// Virginia Water (BMW PGA) = Sep 15-22 2026 -> "sep"
await sql`
  UPDATE planner_hotel_tier_cost
  SET seasonal_band = 'aug'
  WHERE destination_id = 'fb782de2-bbe6-410f-b466-2a4e628cda10' -- New York
    AND seasonal_band IS NULL
`;
await sql`
  UPDATE planner_hotel_tier_cost
  SET seasonal_band = 'sep'
  WHERE destination_id = '0b0d8f9a-911d-4cc7-8049-50e4685958ca' -- Milan
    AND seasonal_band IS NULL
`;
await sql`
  UPDATE planner_hotel_tier_cost
  SET seasonal_band = 'sep'
  WHERE destination_id = '0b015fab-26a0-48b4-a8ff-ef7c7ed977a7' -- Virginia Water
    AND seasonal_band IS NULL
`;

// 4. Now make it NOT NULL
await sql`
  ALTER TABLE planner_hotel_tier_cost
  ALTER COLUMN seasonal_band SET NOT NULL
`;

// 5. Add the new 3-column unique constraint
await sql`
  ALTER TABLE planner_hotel_tier_cost
  ADD CONSTRAINT planner_hotel_tier_cost_dest_tier_season_unique
  UNIQUE (destination_id, tier, seasonal_band)
`;

const rows = await sql`
  SELECT destination_id, tier, seasonal_band, cost_low, cost_high
  FROM planner_hotel_tier_cost
  ORDER BY destination_id, tier
`;
console.log("Confirmed state after migration:");
console.table(rows);

await sql.end();
