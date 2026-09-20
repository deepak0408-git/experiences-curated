import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT slug, google_maps_rating, google_maps_review_count, google_maps_url
  FROM experiences
  WHERE slug LIKE 'brazilian-gp-budget-hotels-morumbi-%'
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
