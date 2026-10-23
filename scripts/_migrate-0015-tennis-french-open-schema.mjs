import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Applies drizzle/migrations/0015_tennis_french_open_arena_codes_and_stand.sql
// by hand (db:generate/db:migrate require a TTY in this environment — see
// feedback_db_migration.md). Each ALTER TYPE ... ADD VALUE runs as its own
// statement/connection (Postgres disallows using a new enum value in the
// same transaction that adds it, and ADD VALUE itself cannot run inside an
// explicit multi-statement transaction block in older PG versions) — the
// `postgres` client with prepare:false and one statement per query avoids
// both issues without needing to open a transaction at all here, since each
// statement is independently safe/idempotent (IF NOT EXISTS / ADD COLUMN IF
// NOT EXISTS).
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const before = await sql`SELECT unnest(enum_range(NULL::tennis_arena_code))::text AS v`;
console.log("tennis_arena_code BEFORE:", before.map((r) => r.v));

for (const code of ["PC", "SL", "SM", "C14"]) {
  await sql.unsafe(`ALTER TYPE "public"."tennis_arena_code" ADD VALUE IF NOT EXISTS '${code}'`);
  console.log(`Added enum value (or already present): ${code}`);
}

await sql`ALTER TABLE "tennis_ticket_intelligence_options" ADD COLUMN IF NOT EXISTS "stand" text`;
console.log("Added column (or already present): tennis_ticket_intelligence_options.stand");

const after = await sql`SELECT unnest(enum_range(NULL::tennis_arena_code))::text AS v`;
console.log("tennis_arena_code AFTER:", after.map((r) => r.v));

const cols = await sql`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name = 'stand'
`;
console.log("stand column:", cols);

await sql.end();
