import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT e.slug, e.title, e.experience_type, e.hero_image_url IS NOT NULL as has_image
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'
  ORDER BY e.title
`;
rows.forEach(r => console.log(`${r.has_image ? "✓" : "✗"} ${r.slug} | ${r.title} | ${r.experience_type}`));
await sql.end();
