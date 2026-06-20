import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

const [row] = await sql`
  UPDATE sporting_events
  SET start_date = '2026-06-16', pre_trip_brief_live_at = NULL, pre_trip_brief_approval_token = NULL
  WHERE slug = 'wimbledon-2026'
  RETURNING slug, start_date
`;

console.log("Restored:");
console.table([row]);

await sql.end();
