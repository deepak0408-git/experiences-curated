import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const migrationSql = fs.readFileSync("drizzle/migrations/0020_tennis_c1_c5_precision.sql", "utf8");

const statements = migrationSql
  .split("\n")
  .filter((l) => l.trim().startsWith("ALTER TABLE"));

for (const stmt of statements) {
  console.log(`Running: ${stmt}`);
  await sql.unsafe(stmt);
}

const cols = await sql`
  SELECT column_name, numeric_precision, numeric_scale
  FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name LIKE 'c1_%' OR (table_name = 'tennis_ticket_intelligence_options' AND column_name LIKE 'c5_%')
  ORDER BY column_name
`;
console.log(cols);

await sql.end();
