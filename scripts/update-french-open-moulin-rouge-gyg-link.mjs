import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE slug = 'moulin-rouge-show'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const gygUrl = "https://www.getyourguide.com/paris-l16/moulin-rouge-show-with-champagne-t189477/?partner_id=HCNITTS&utm_medium=online_publisher";

parsed.bookingMethod = "Book directly via moulinrouge.fr or via GetYourGuide (Show + Champagne) — prices rise as the date approaches.";

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([
      { platform: "GetYourGuide", label: "Moulin Rouge Show with Champagne", url: gygUrl },
    ])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ practical_info.bookingMethod updated — clean text, no raw URL");
console.log("✓ booking_links — 1 GetYourGuide entry (Moulin Rouge)");
await sql.end();
