import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const total = await sql`SELECT COUNT(*)::int AS n FROM newsletter_subscribers`;
console.log("Total rows:", total[0].n);

const bySource = await sql`
  SELECT source, COUNT(*)::int AS n
  FROM newsletter_subscribers
  GROUP BY source
  ORDER BY n DESC
`;
console.log("\nBy source:");
for (const r of bySource) console.log(` ${r.source || "(null)"}: ${r.n}`);

const backfilled = await sql`
  SELECT email, created_at FROM newsletter_subscribers WHERE source = 'purchase_backfill' ORDER BY email
`;
console.log("\npurchase_backfill rows:", backfilled.length);
for (const r of backfilled) console.log(" -", r.email, r.created_at.toISOString());

await sql.end();
