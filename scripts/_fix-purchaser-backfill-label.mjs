import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const updated = await sql`
  UPDATE newsletter_subscribers
  SET source = 'purchase_backfill'
  WHERE source = 'purchaser_backfill'
  RETURNING email
`;
console.log(`Updated ${updated.length} rows`);
for (const r of updated) console.log(" -", r.email);

await sql.end();
