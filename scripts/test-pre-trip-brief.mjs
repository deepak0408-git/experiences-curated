import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

// Set Wimbledon to Jun 16 for testing (original: 2026-06-29)
const [row] = await sql`
  UPDATE sporting_events
  SET start_date = '2026-06-16', pre_trip_brief_live_at = NULL, pre_trip_brief_approval_token = NULL
  WHERE slug = 'wimbledon-2026'
  RETURNING id, name, slug, start_date, pre_trip_brief_live_at, pre_trip_brief_approval_token
`;

console.log("Updated to test date:");
console.table([row]);

await sql.end();
