import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`
  select ba.slug, ba.title, ba.content_category, ba.sport, ba.status, se.name as event_name
  from blog_articles ba
  left join sporting_events se on se.id = ba.sporting_event_id
  where se.name ilike '%Brazil%' or se.name ilike '%São Paulo%' or se.name ilike '%Sao Paulo%' or se.name ilike '%United States%' or se.name ilike '%Austin%'
  order by se.name, ba.published_at
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
