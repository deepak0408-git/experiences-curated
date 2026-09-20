import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT slug, booking_links FROM experiences
  WHERE slug LIKE 'brazilian-gp-budget-hotels-morumbi-%' OR slug = 'staying-in-milan-city-base-strategy-mrbv33on'
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
