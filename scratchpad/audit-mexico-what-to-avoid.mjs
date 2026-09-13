import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const rows = await sql`
  SELECT e.id, e.title, e.body_content, e.why_its_special, e.insider_tips, e.what_to_avoid
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '538fdb6f-0e39-49a6-ba77-32dec65d640a'
  AND e.status = 'in_review'
  ORDER BY e.title
`;

console.log("Total in_review Mexico experiences:", rows.length);
for (const r of rows) {
  console.log("\n===", r.title, "===");
  console.log("ID:", r.id);
  console.log("AVOID:", r.what_to_avoid);
}
await sql.end();
