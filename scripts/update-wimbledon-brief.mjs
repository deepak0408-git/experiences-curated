import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

const lines = [
  "Weather: Late June in SW London runs around 21°C at peak, cooler in the mornings and evenings. Bring a light rain jacket — there's roughly a 1-in-4 chance of a shower on any given day, and the queue gets cold if you're there overnight. Layers over sunscreen, not the other way round.",
  "Transport: District line is clear — signalling upgrades finished 13 June, no disruptions planned during the tournament. Take it direct to Wimbledon, or South Western Railway from Waterloo (~20 min). Check SWR JourneyCheck the morning you travel; Wandsworth Town has had reduced service this season and it's worth a quick look before you leave.",
  "New this year — video review: Wimbledon is introducing challenge technology for the first time in its 139-year history. Players can now appeal umpire calls on double bounces, racket touches, and hindrance — unlimited challenges, six courts equipped including Centre Court and No. 1. Line calls remain electronic. It changes how you watch a disputed point.",
];

// Build the array literal manually to avoid postgres.js typing issues with special chars
const arrayLiteral = "{" + lines.map(l => `"${l.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",") + "}";

const [row] = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_lines = ${arrayLiteral}::text[],
      pre_trip_brief_updated_at = NOW()
  WHERE slug = 'wimbledon-2026'
  RETURNING slug, pre_trip_brief_lines, pre_trip_brief_updated_at
`;

console.log("✓ Updated pre_trip_brief_lines for wimbledon-2026");
console.log("Lines saved:", row.pre_trip_brief_lines.length);

await sql.end();
