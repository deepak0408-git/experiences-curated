import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE slug = 'paris-landmarks-louvre-notre-dame'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const louvreUrl = "https://www.getyourguide.com/paris-l16/paris-louvre-museum-tour-mona-lisa-iconic-masterpieces-t457745/?partner_id=HCNITTS&utm_medium=online_publisher";
const notreDameUrl = "https://www.getyourguide.com/paris-l16/paris-notre-dame-the-restored-masterpiece-guided-tour-t1156458/?partner_id=HCNITTS&utm_medium=online_publisher";

parsed.bookingMethod = "Louvre and Notre-Dame both bookable as guided tours via GetYourGuide; Notre-Dame also free walk-in entry, bell tower tickets via the Centre des Monuments Nationaux site only.";

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([
      { platform: "GetYourGuide", label: "Louvre Museum Tour — Mona Lisa & Iconic Masterpieces", url: louvreUrl },
      { platform: "GetYourGuide", label: "Notre-Dame — The Restored Masterpiece Guided Tour", url: notreDameUrl },
    ])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ practical_info.bookingMethod updated — clean text, no raw URL");
console.log("✓ booking_links — 2 GetYourGuide entries (Louvre, Notre-Dame)");
await sql.end();
