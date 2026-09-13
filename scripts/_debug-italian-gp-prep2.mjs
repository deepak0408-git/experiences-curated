import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const rows = await sql`
  SELECT id, title, body_content, practical_info
  FROM experiences
  WHERE sporting_event_id = 'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e'
  ORDER BY title
`;
for (const r of rows) {
  console.log("=== " + r.title + " (" + r.id + ") ===");
}
console.log("\nTotal:", rows.length);
await sql.end();
