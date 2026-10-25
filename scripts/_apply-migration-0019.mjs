import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const migrationSql = fs.readFileSync("drizzle/migrations/0019_tennis_wimbledon_arena_codes.sql", "utf8");

// ALTER TYPE ... ADD VALUE cannot run inside the same transaction as other
// statements referencing the new value, but these 4 statements are
// independent ADD VALUE calls with no dependent reads, so sequential
// unwrapped execution (same approach as migration 0015's French Open
// equivalent) is safe.
const statements = migrationSql
  .split("\n")
  .filter((l) => l.trim().startsWith("ALTER TYPE"));

for (const stmt of statements) {
  console.log(`Running: ${stmt}`);
  await sql.unsafe(stmt);
}

const [{ enum_values }] = await sql`
  SELECT array_agg(enumlabel ORDER BY enumsortorder) AS enum_values
  FROM pg_enum
  WHERE enumtypid = 'tennis_arena_code'::regtype
`;
console.log("tennis_arena_code enum values now:", enum_values);

await sql.end();
