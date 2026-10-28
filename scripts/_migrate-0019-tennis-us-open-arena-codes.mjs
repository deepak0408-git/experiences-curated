import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Adds AA/LA/GS (Arthur Ashe Stadium, Louis Armstrong Stadium, Grandstand)
// to tennis_arena_code for US Open 2027 — same pattern as
// _migrate-0015-tennis-french-open-schema.mjs's PC/SL/SM/C14 addition.
// US Open's Grounds Admission reuses the existing GP code, so no new
// value is needed for it. Each ALTER TYPE ... ADD VALUE runs as its own
// statement (Postgres disallows using a new enum value in the same
// transaction that adds it) — prepare:false, one statement per query,
// no explicit transaction, idempotent via IF NOT EXISTS.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const before = await sql`SELECT unnest(enum_range(NULL::tennis_arena_code))::text AS v`;
console.log("tennis_arena_code BEFORE:", before.map((r) => r.v));

for (const code of ["AA", "LA", "GS"]) {
  await sql.unsafe(`ALTER TYPE "public"."tennis_arena_code" ADD VALUE IF NOT EXISTS '${code}'`);
  console.log(`Added enum value (or already present): ${code}`);
}

const after = await sql`SELECT unnest(enum_range(NULL::tennis_arena_code))::text AS v`;
console.log("tennis_arena_code AFTER:", after.map((r) => r.v));

await sql.end();
