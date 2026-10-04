import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT slug, name, country_code, lat, lng FROM destinations ORDER BY country_code, name`;
for (const r of rows) console.log(`${r.slug.padEnd(30)} ${r.name.padEnd(25)} ${r.country_code} lat=${r.lat} lng=${r.lng}`);
await sql.end();
