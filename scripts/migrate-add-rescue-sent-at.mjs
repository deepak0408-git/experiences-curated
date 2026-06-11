import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

console.log("Adding rescue_sent_at column to purchases...");
await sql`
  ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS rescue_sent_at TIMESTAMPTZ
`;
console.log("✓ rescue_sent_at column added");

await sql.end();
