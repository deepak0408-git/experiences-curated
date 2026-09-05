import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

// Purchasers between 22 Aug and 3 Sep 2026 not yet in newsletter_subscribers.
// Source: purchases table, queried 3 Sep 2026. deepak0408@gmail.com excluded
// (already subscribed). vatsal323@gmail.com purchased twice in-window but
// listed once here since newsletter_subscribers.email is unique.
const emails = [
  "daniele_solorzano@hotmail.com",
  "rachelcochrane9824@gmail.com",
  "da96103@hotmail.com",
  "prithviraj.srinivas@gmail.com",
  "tamiren1997@gmail.com",
  "vatsal323@gmail.com",
  "savibavi1@gmail.com",
  "hirlekarnandan@gmail.com",
  "janek1223e@gmail.com",
  "luanakerekes@yahoo.ro",
  "tony.p.paredes@gmail.com",
  "melody1@me.com",
];

const rows = emails.map((email) => ({ email, source: "purchase_backfill" }));

const inserted = await sql`
  INSERT INTO newsletter_subscribers (email, source, created_at)
  VALUES ${sql(rows.map((r) => [r.email, r.source, new Date()]))}
  ON CONFLICT (email) DO NOTHING
  RETURNING email
`;

console.log(`Inserted ${inserted.length} of ${emails.length}:`);
for (const r of inserted) console.log(" -", r.email);

const skipped = emails.filter((e) => !inserted.some((r) => r.email === e));
if (skipped.length) {
  console.log(`\nSkipped (already existed):`);
  for (const e of skipped) console.log(" -", e);
}

await sql.end();
