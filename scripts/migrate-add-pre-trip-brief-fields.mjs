import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

console.log("Adding pre_trip_brief_live_at and pre_trip_brief_approval_token to sporting_events...");
await sql`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS pre_trip_brief_live_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pre_trip_brief_approval_token VARCHAR(64)
`;
console.log("✓ columns added");

await sql.end();
