import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const EVENT_SLUG = "singapore-grand-prix";

const lines = [
  "Hot and sticky all three days — highs around 31-32°C, and it won't drop below 27°C even at night. Afternoon thunderstorms are likely too. Skip the big umbrella; a poncho travels better once the grandstands are packed in tight.",
  "Roads around Marina Centre and the Padang close from 12:01am on 7 October to 5:30am on 13 October. Driving or grabbing a cab near the circuit won't work on race days — take the MRT. City Hall and Esplanade stations are both a short walk from the track, and trains run later than usual all three nights: last train from City Hall is around 12:30am Friday and Saturday, 12:45am Sunday. Worth checking lta.gov.sg a day or two out in case the advisory shifts.",
  "This is Singapore's first-ever Sprint weekend. Sprint Qualifying is Friday night, the Sprint Race runs Saturday at 5pm, Grand Prix Qualifying follows that same evening, and the main race stays Sunday at 8pm. If you're only there for one day, Friday's worth catching now — it's a real qualifying session, not just practice.",
];

const arrayLiteral = "{" + lines.map(l => `"${l.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",") + "}";

const [row] = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_lines = ${arrayLiteral}::text[],
      pre_trip_brief_live_at = NOW(),
      pre_trip_brief_updated_at = NOW()
  WHERE slug = ${EVENT_SLUG}
  RETURNING slug, pre_trip_brief_lines, pre_trip_brief_live_at
`;

if (!row) {
  console.error("✗ No row updated — check event slug:", EVENT_SLUG);
} else {
  console.log("✓ Pre-trip brief set for:", row.slug);
  console.log("  Lines saved:", row.pre_trip_brief_lines.length);
  console.log("  Live at:", row.pre_trip_brief_live_at);
  console.log("\n→ Check pack view at: http://localhost:3000/event-pack/singapore-grand-prix");
}

await sql.end();
