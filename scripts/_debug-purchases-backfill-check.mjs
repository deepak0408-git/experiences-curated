import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const rows = await sql`
  SELECT p.id, p.email, p.user_id, p.created_at, p.sporting_event_id, se.name as event_name
  FROM purchases p
  LEFT JOIN sporting_events se ON se.id = p.sporting_event_id
  WHERE p.created_at >= '2026-08-22'::date
    AND p.created_at < '2026-09-04'::date
  ORDER BY p.created_at
`;

console.log("Total purchases in range:", rows.length);
console.log("");
for (const r of rows) {
  console.log(`${r.created_at.toISOString().slice(0,16)} | ${r.email} | userId=${r.user_id || "NULL"} | ${r.event_name || r.sporting_event_id}`);
}

// Check which of these emails already exist in newsletter_subscribers
const emails = rows.map(r => r.email);
if (emails.length) {
  const existing = await sql`
    SELECT email FROM newsletter_subscribers WHERE email = ANY(${emails})
  `;
  console.log("\nAlready in newsletter_subscribers:", existing.map(e => e.email));
}

await sql.end();
