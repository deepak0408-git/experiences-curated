import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT id, name, slug, sport, pack_status, is_hidden
  FROM sporting_events
  WHERE sport = 'formula_one'
  ORDER BY name
`;

console.log(`\n=== ${events.length} F1 events total ===\n`);

for (const ev of events) {
  const exps = await sql`
    SELECT e.id, e.title, e.slug, e.experience_type, e.status
    FROM experiences e
    JOIN sporting_event_experiences see ON see.experience_id = e.id
    WHERE see.sporting_event_id = ${ev.id}
    ORDER BY e.title
  `;
  console.log(`--- ${ev.name} (${ev.slug}) | packStatus=${ev.pack_status} isHidden=${ev.is_hidden} | ${exps.length} experiences ---`);
  for (const e of exps) {
    console.log(`  [${e.status}] "${e.title}" — type=${e.experience_type} — slug=${e.slug}`);
  }
  console.log("");
}

await sql.end();
