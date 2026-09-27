import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`
  select slug, title, content_category, status, read_minutes, hero_image_url
  from blog_articles
  where sporting_event_id = '64792f75-c009-4070-a12b-23d7bd0a3a7f'
  order by published_at
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
