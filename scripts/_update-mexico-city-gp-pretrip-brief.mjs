import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const lines = [
  "Expect mild, dry days: highs around 22°C (72°F), lows near 9°C (48°F) after sundown. The altitude (2,200m) makes race-day evenings colder than the daytime sun suggests, so bring a jacket for the grandstands after dark. Rain is unlikely this late in the dry season, but pack a light layer just in case.",
  "Take the Metro, not a car. There's no public parking at the circuit. Line 9 (Tacubaya-Pantitlan) is the direct route, with Ciudad Deportiva the closest stop to the track. Expect it packed on race day, so budget extra time and check Metro CDMX's live service alerts (@MetroCDMX on X) the morning of, since Line 9 has a recent history of station works.",
  "This is the first Mexico City race under F1's biggest rule change in a generation. No more DRS. Watch the rear wing instead of listening for the DRS 'whoosh' on the straight into Turn 1: it now flattens automatically for overtaking, so the passing move will look different and the engine note on the straights will sound flatter than you remember from past years here.",
];

await sql`
  update sporting_events
  set pre_trip_brief_lines = ${sql.array(lines, 1009)},
      pre_trip_brief_updated_at = now()
  where id = '538fdb6f-0e39-49a6-ba77-32dec65d640a'
`;

const rows = await sql`
  select id, name, pre_trip_brief_lines, pre_trip_brief_live_at, pre_trip_brief_updated_at
  from sporting_events
  where id = '538fdb6f-0e39-49a6-ba77-32dec65d640a'
`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
