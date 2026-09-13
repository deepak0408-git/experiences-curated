import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT title, slug, hero_image_url, hero_image_credit
  FROM experiences
  WHERE sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'
  ORDER BY title
`;
console.log("Total:", rows.length);
rows.forEach(r => console.log(`${r.hero_image_url ? "✓" : "✗ MISSING"} | ${r.title} | credit: ${r.hero_image_credit ?? "(none)"}`));
await sql.end();
