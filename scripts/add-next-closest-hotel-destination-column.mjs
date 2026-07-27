import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

await sql`
  ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS next_closest_hotel_destination_id uuid REFERENCES destinations(id);
`;

console.log("✓ next_closest_hotel_destination_id column added");

const check = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'next_closest_hotel_destination_id'`;
console.log(check);

await sql.end();
