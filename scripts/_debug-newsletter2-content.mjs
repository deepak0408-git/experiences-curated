import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const slugs = [
  "the-business-of-the-us-open",
  "tifosi-monza-pilgrimage-no-fixed-seat",
  "wentworths-burma-road-nickname",
];

const rows = await sql`
  SELECT title, slug, excerpt, hero_image_url, hero_image_alt, body_content, read_minutes
  FROM blog_articles
  WHERE slug = ANY(${slugs})
`;

for (const r of rows) {
  console.log("=== " + r.title + " ===");
  console.log("Slug:", r.slug);
  console.log("Subtitle:", r.excerpt);
  console.log("Hero:", r.hero_image_url);
  console.log("Body (first 500 chars):", (r.body_content||"").slice(0,500));
  console.log("\n");
}
await sql.end();
