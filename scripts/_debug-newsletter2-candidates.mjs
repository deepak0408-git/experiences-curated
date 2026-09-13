import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

console.log("=== Sporting events (Italian GP, US Open, BMW PGA) ===");
const events = await sql`
  SELECT id, name, slug, start_date, end_date, is_hidden
  FROM sporting_events
  WHERE name ILIKE '%italian%' OR name ILIKE '%us open%' OR name ILIKE '%bmw pga%'
  ORDER BY start_date
`;
for (const e of events) {
  console.log(`${e.name} | slug=${e.slug} | ${e.start_date.toISOString().slice(0,10)} - ${e.end_date.toISOString().slice(0,10)} | hidden=${e.is_hidden}`);
}

console.log("\n=== Blog articles - Italian GP / F1 / Monza ===");
const blogsF1 = await sql`
  SELECT id, title, slug, status, read_minutes, published_at, created_at
  FROM blog_articles
  WHERE title ILIKE '%italian%' OR title ILIKE '%monza%' OR title ILIKE '%formula%' OR title ILIKE '%f1%'
  ORDER BY published_at DESC NULLS LAST, created_at DESC
`;
for (const b of blogsF1) console.log(`${b.title} | ${b.status} | ${b.read_minutes}min | slug=${b.slug} | pub=${b.published_at?.toISOString().slice(0,10) || 'n/a'}`);

console.log("\n=== Blog articles - US Open / tennis ===");
const blogsTennis = await sql`
  SELECT id, title, slug, status, read_minutes, published_at, created_at
  FROM blog_articles
  WHERE title ILIKE '%us open%' OR title ILIKE '%tennis%' OR title ILIKE '%flushing%'
  ORDER BY published_at DESC NULLS LAST, created_at DESC
`;
for (const b of blogsTennis) console.log(`${b.title} | ${b.status} | ${b.read_minutes}min | slug=${b.slug} | pub=${b.published_at?.toISOString().slice(0,10) || 'n/a'}`);

console.log("\n=== Blog articles - BMW PGA / golf ===");
const blogsGolf = await sql`
  SELECT id, title, slug, status, read_minutes, published_at, created_at
  FROM blog_articles
  WHERE title ILIKE '%golf%' OR title ILIKE '%pga%' OR title ILIKE '%wentworth%' OR title ILIKE '%ryder%'
  ORDER BY published_at DESC NULLS LAST, created_at DESC
`;
for (const b of blogsGolf) console.log(`${b.title} | ${b.status} | ${b.read_minutes}min | slug=${b.slug} | pub=${b.published_at?.toISOString().slice(0,10) || 'n/a'}`);

console.log("\n=== Most recent blog articles overall (any topic, for context) ===");
const recent = await sql`
  SELECT title, status, read_minutes, published_at
  FROM blog_articles
  ORDER BY published_at DESC NULLS LAST, created_at DESC
  LIMIT 10
`;
for (const b of recent) console.log(`${b.title} | ${b.status} | ${b.read_minutes}min | pub=${b.published_at?.toISOString().slice(0,10) || 'n/a'}`);

await sql.end();
