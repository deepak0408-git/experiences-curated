import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const total = await sql`
  SELECT count(*)::int AS n
  FROM experiences
  WHERE practical_info->>'bookingMethod' IS NOT NULL
    AND trim(practical_info->>'bookingMethod') != ''
`;
console.log("Total experiences with bookingMethod filled in:", total[0].n);

const byStatus = await sql`
  SELECT status, count(*)::int AS n
  FROM experiences
  WHERE practical_info->>'bookingMethod' IS NOT NULL
    AND trim(practical_info->>'bookingMethod') != ''
  GROUP BY status
  ORDER BY n DESC
`;
console.log("By status:", byStatus);

await sql.end();
