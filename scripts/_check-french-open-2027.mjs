import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = await sql`
  SELECT id, name, slug, sport, start_date, end_date, is_hidden, pack_status
  FROM sporting_events
  WHERE name ILIKE '%french open%' OR name ILIKE '%roland%'
`;
console.log("EVENTS:", events);

if (events.length) {
  for (const ev of events) {
    const exps = await sql`
      SELECT e.id, e.title, e.status, e.experience_type
      FROM experiences e
      WHERE e.sporting_event_id = ${ev.id}
    `;
    console.log(`\nExperiences for ${ev.name} (${ev.id}):`, exps.length);
    console.log(exps);

    const joined = await sql`
      SELECT see.experience_id, e.title, see.pack_rank
      FROM sporting_event_experiences see
      JOIN experiences e ON e.id = see.experience_id
      WHERE see.sporting_event_id = ${ev.id}
    `;
    console.log(`Joined via sporting_event_experiences:`, joined.length);
    console.log(joined);
  }
}

await sql.end();
