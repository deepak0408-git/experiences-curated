import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const slugs = ["melbourne-au", "london-gb", "shanghai", "abu-dhabi"];
for (const slug of slugs) {
  const d = await sql`SELECT name, editorial_overview, region, country_code FROM destinations WHERE slug = ${slug}`;
  console.log(slug, JSON.stringify(d[0]));
}
await sql.end();
