import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const EVENT_SLUG = "open-championship-2026";

const lines = [
  "Weather: July at Royal Birkdale averages 17–22°C but the north-west coast does what it wants. Wind is the constant — it reshapes the course daily and is part of what makes links golf different from anything else. Pack a light waterproof and a base layer regardless of the forecast; the dunes offer no shelter and conditions shift fast. Check AccuWeather for Southport the morning you go rather than the day before.",
  "Transport: Hillside Station is a 4-minute walk from the main spectator entrance — the Merseyrail Southport line runs direct from Liverpool Central every 15 minutes (~40 min journey). Trains fill up fast before first tee time; aim to arrive at your departure station 20 minutes earlier than you think you need to. Park & ride operates from Victoria Park (Southport), Woodvale Airfield, and Meols Cop Road — book via theopen.com as spaces sell out well in advance. No general parking near the course.",
  "New this year: Royal Birkdale has added a new par-3 15th hole (designed by Mackenzie & Ebert) and remodelled the 5th, 7th, and 14th — the course plays differently from 2008 and 2017. The R&A has also introduced a Last-Chance Qualifier on Monday 13 July (12 players, one spot in the field) and the Heroes Classic on Tuesday 14 July with past champions — both open to spectators with a ground pass. Check the full week schedule at theopen.com/royal-birkdale-154th-open before you travel.",
];

// Escape for postgres array literal
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
  console.log("\n→ Check pack view at: http://localhost:3000/event-pack/open-championship-2026");
}

await sql.end();
