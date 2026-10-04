import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const rows = await sql`
  SELECT title, slug, body_content, why_its_special, insider_tips, what_to_avoid, practical_info, getting_there
  FROM experiences
  WHERE title IN ('Cherry Blossoms in Early April — What to Expect', 'Nagoya''s Food Scene — Hitsumabushi and Miso Katsu')
`;
for (const r of rows) {
  console.log("=====", r.title, "=====");
  console.log(JSON.stringify(r, null, 2));
}
await sql.end();
