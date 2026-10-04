import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT slug, booking_links FROM experiences WHERE slug IN ('japanese-gp-nagoya-day-trip','japanese-gp-ise-grand-shrine','japanese-gp-osaka-day-trip','japanese-gp-sumo-near-nagoya')`;
for (const r of rows) console.log(r.slug, JSON.stringify(r.booking_links, null, 2));
await sql.end();
