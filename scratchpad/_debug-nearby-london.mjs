import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const london = await sql`SELECT id, lat, lng FROM destinations WHERE slug = 'london-gb'`;
console.log("London:", london[0]);

const rows = await sql`
  SELECT se.name, se.slug, d.name as dest_name, d.lat, d.lng,
    6371 * acos(least(1, greatest(-1,
      cos(radians(${london[0].lat}::float)) * cos(radians(d.lat::float)) *
        cos(radians(d.lng::float) - radians(${london[0].lng}::float)) +
      sin(radians(${london[0].lat}::float)) * sin(radians(d.lat::float))
    ))) as distance_km
  FROM sporting_events se
  JOIN destinations d ON se.destination_id = d.id
  WHERE se.destination_id != ${london[0].id}
    AND d.lat IS NOT NULL AND d.lng IS NOT NULL
`;
console.log(rows);
await sql.end();
