import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const JAPAN_URL = "postgresql://postgres.hqplnxyhszhkdkgkjbmk:Kritika2468%21@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres";
const IRELAND_URL = process.env.DATABASE_URL;

const japan = postgres(JAPAN_URL, { ssl: "require" });
const ireland = postgres(IRELAND_URL, { ssl: "require" });

const TITLES = [
  "A morning in Moseley Village before the match",
  "Edgbaston — 1st ODI",
  "Getting to Edgbaston and Lord's on match day",
  "Joining the Bharat Army",
  "London in a day — the walk that covers it all",
  "Lord's — 3rd ODI",
  "Lunch at Soutine before the Lord's ODI",
  "Morning at the Practice Facility",
  "Shababs — The Balti Triangle's Standard-Bearer",
  "Stay on Campus, Walk to the Ground — Edgbaston Park Hotel",
  "The Landmark London for the Lord's ODI",
  "The Lord's Tavern — Drinking Inside Cricket's Cathedral",
  "The Twelfth Man — Pre-Match at Edgbaston's Front Door",
];

const rows = await japan`SELECT * FROM experiences WHERE title = ANY(${TITLES})`;
console.log(`Fetched ${rows.length} rows from Japan.`);

let inserted = 0;
let skipped = 0;

for (const row of rows) {
  try {
    await ireland`INSERT INTO experiences ${ireland(row)} ON CONFLICT DO NOTHING`;
    console.log(`✓ ${row.title}`);
    inserted++;
  } catch (err) {
    console.error(`✗ ${row.title}: ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone. ${inserted} inserted, ${skipped} failed.`);
await japan.end();
await ireland.end();
