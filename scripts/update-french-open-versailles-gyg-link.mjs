import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE slug = 'versailles-day-trip'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const gygUrl = "https://www.getyourguide.com/paris-l16/from-paris-versailles-palace-gardens-with-transportation-t415425/?partner_id=HCNITTS&utm_medium=online_publisher";

parsed.bookingMethod = "Book timed-entry tickets directly via en.chateauversailles.fr, or a transportation-included tour via GetYourGuide — essential during May-June, especially on weekends and Musical Fountains days.";

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([
      { platform: "GetYourGuide", label: "Versailles Palace & Gardens with Transportation", url: gygUrl },
    ])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ practical_info.bookingMethod updated — clean text, no raw URL");
console.log("✓ booking_links — 1 GetYourGuide entry (Versailles)");
await sql.end();
