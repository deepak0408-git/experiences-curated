import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT slug, body_content
  FROM experiences
  WHERE slug IN ('qatar-gp-pearl-katara-mtymxyz1', 'qatar-gp-qatari-cuisine-souq-mtynabc2')
     OR body_content LIKE '%See live rating%'
  LIMIT 5
`;
for (const r of rows) {
  const idx = r.body_content.indexOf('See live rating');
  console.log(r.slug, '\n', r.body_content.slice(Math.max(0, idx - 150), idx + 200), '\n---');
}
await sql.end();
