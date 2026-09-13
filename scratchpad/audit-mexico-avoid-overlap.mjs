import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const rows = await sql`
  SELECT e.id, e.title, e.body_content, e.insider_tips, e.what_to_avoid
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '538fdb6f-0e39-49a6-ba77-32dec65d640a'
  AND e.status = 'in_review'
  ORDER BY e.title
`;

import fs from 'fs';
fs.writeFileSync('scratchpad/mexico-avoid-full-dump.json', JSON.stringify(rows, null, 2));
console.log("Wrote", rows.length, "rows");
await sql.end();
