import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

const rows = await sql`
  SELECT id, title, body_content, practical_info
  FROM experiences
  WHERE title ILIKE '%prepar%'
     OR title ILIKE '%getting there%'
     OR title ILIKE '%travel guide%'
     OR title ILIKE '%how to get%'
`;

for (const r of rows) {
  console.log("=== " + r.title + " (" + r.id + ") ===");
  console.log(JSON.stringify(r.practical_info));
  console.log((r.body_content || "").slice(0, 4000));
  console.log("\n\n");
}

await sql.end();
