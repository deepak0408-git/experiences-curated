import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

await sql`
  DO $$ BEGIN
    CREATE TYPE planner_refresh_pass AS ENUM ('initial', 't60', 't30');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
`;

await sql`
  ALTER TABLE planner_flight_cost
  ADD COLUMN IF NOT EXISTS refresh_pass planner_refresh_pass NOT NULL DEFAULT 'initial';
`;

await sql`
  ALTER TABLE planner_hotel_tier_cost
  ADD COLUMN IF NOT EXISTS refresh_pass planner_refresh_pass NOT NULL DEFAULT 'initial';
`;

console.log("✓ planner_refresh_pass enum + columns added");

const check1 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planner_flight_cost' AND column_name = 'refresh_pass'`;
const check2 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planner_hotel_tier_cost' AND column_name = 'refresh_pass'`;
console.log("planner_flight_cost:", check1);
console.log("planner_hotel_tier_cost:", check2);

await sql.end();
