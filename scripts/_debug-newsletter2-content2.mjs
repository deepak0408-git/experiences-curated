import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const rows = await sql`
  SELECT title, slug, excerpt, hero_image_url, body_content
  FROM blog_articles
  WHERE slug = 'why-us-open-night-sessions-are-tennis-best-theater'
`;
for (const r of rows) {
  console.log("=== " + r.title + " ===");
  console.log("Excerpt:", r.excerpt);
  console.log("Hero:", r.hero_image_url);
  console.log("Body first 800:", (r.body_content||"").slice(0,800));
}

console.log("\n=== Italian GP pack ===");
const pack = await sql`
  SELECT name, slug, start_date, end_date, hero_image_url
  FROM sporting_events
  WHERE slug = 'italian-gp-2026'
`;
console.log(pack[0]);

await sql.end();
