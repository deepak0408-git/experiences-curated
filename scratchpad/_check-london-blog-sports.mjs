import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
const rows = await sql`SELECT title, sport, sporting_event_id FROM blog_articles WHERE status = 'published' AND sport && ARRAY['cricket','tennis']::sport[] ORDER BY published_at DESC`;
console.log(rows);
await sql.end();
