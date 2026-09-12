import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b"; // BMW PGA Championship 2026

const lines = [
  "Expect a dry, mild week — highs around 20-21°C, lows 11-13°C overnight. Thursday starts under more cloud, then it clears into a sunny weekend. Bring a layer for the mornings and evenings.",
  "Take the train to Virginia Water station, the closest stop to Wentworth (about a 10-15 minute walk, or use the event shuttle). No engineering works are scheduled on that Waterloo-Virginia Water route during the tournament — still worth a quick check on journeycheck.com the morning you travel.",
  "New this year: an expanded BMW Village built around the new BMW i3 and iX5, plus a stronger Festival of Golf lineup — Ella Eyre and DJ Tony Perry play through the week, with The Kooks headlining Saturday night.",
];

const pgArrayLiteral =
  "{" + lines.map((l) => `"${l.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",") + "}";

await sql`
  UPDATE sporting_events
  SET pre_trip_brief_lines = ${pgArrayLiteral}::text[],
      pre_trip_brief_updated_at = now(),
      updated_at = now()
  WHERE id = ${EVENT_ID}
`;

const [row] = await sql`
  SELECT name, slug, pre_trip_brief_lines, pre_trip_brief_live_at
  FROM sporting_events WHERE id = ${EVENT_ID}
`;
console.log("Updated:", row);

await sql.end();
