import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const doha = await sql`SELECT id, name, next_closest_hotel_destination_id, nearest_airport_iata FROM destinations WHERE id = '4e53af71-7526-4d55-bf81-5d57d6f22136'`;
console.log("DOHA:", doha);

const lusail = await sql`SELECT id, name FROM destinations WHERE name ILIKE '%lusail%'`;
console.log("LUSAIL rows:", lusail);

const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'destinations' AND column_name ILIKE '%hotel%'`;
console.log("hotel-related columns on destinations:", cols);

const existing = await sql`SELECT * FROM planner_hotel_tier_cost WHERE destination_id = '4e53af71-7526-4d55-bf81-5d57d6f22136'`;
console.log("Existing Qatar/Doha hotel rows:", existing);

await sql.end();
