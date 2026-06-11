import { readFileSync } from "fs";
import postgres from "postgres";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}

const sql = postgres(process.env.DIRECT_URL);

console.log("Adding pre_trip_brief_lines and pre_trip_brief_updated_at to sporting_events...");
await sql`
  ALTER TABLE sporting_events
  ADD COLUMN IF NOT EXISTS pre_trip_brief_lines TEXT[],
  ADD COLUMN IF NOT EXISTS pre_trip_brief_updated_at TIMESTAMPTZ
`;
console.log("✓ columns added");

// Seed placeholder lines for existing events
const events = [
  {
    slug: "wimbledon-2026",
    lines: [
      "This brief will be updated in the week before the tournament opens — check back from 22 June for transport news, weather, and any last-minute tips.",
    ],
  },
  {
    slug: "us-open-2026",
    lines: [
      "This brief will be updated in the week before the tournament opens — check back from 23 August for transport news, weather, and any last-minute tips.",
    ],
  },
  {
    slug: "india-in-england-cricket-2026",
    lines: [
      "This brief will be updated in the week before the first match — check back from 19 June for transport news, weather, and any last-minute tips.",
    ],
  },
];

for (const event of events) {
  await sql`
    UPDATE sporting_events
    SET pre_trip_brief_lines = ${sql.array(event.lines)},
        pre_trip_brief_updated_at = NOW()
    WHERE slug = ${event.slug}
  `;
  console.log(`✓ seeded lines for ${event.slug}`);
}

await sql.end();
