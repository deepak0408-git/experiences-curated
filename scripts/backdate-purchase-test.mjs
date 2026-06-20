import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

const result = await sql`
  UPDATE purchases
  SET purchased_at = ${threeHoursAgo}, rescue_sent_at = NULL
  WHERE paddle_order_id = 'pay_0NgpObE49XsHwAiOuI9LR'
  RETURNING id, email, purchased_at, rescue_sent_at, status
`;

console.log("Updated row:");
console.table(result);

await sql.end();
