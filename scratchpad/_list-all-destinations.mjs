import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const dests = await sql`SELECT slug, name, hero_image_url IS NOT NULL AS has_hero FROM destinations ORDER BY name`;
console.log(`Total destinations: ${dests.length}`);
for (const d of dests) {
  console.log(`${d.slug.padEnd(30)} ${d.name.padEnd(30)} hero=${d.has_hero}`);
}

await sql.end();
