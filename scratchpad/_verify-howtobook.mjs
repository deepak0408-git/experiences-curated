import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT title, practical_info FROM experiences WHERE slug IN ('japanese-gp-nagoya-food-scene','japanese-gp-cherry-blossoms')`;
for (const r of rows) console.log(r.title, "\n", JSON.stringify(r.practical_info, null, 2), "\n");
await sql.end();
