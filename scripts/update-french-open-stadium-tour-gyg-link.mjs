import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE slug = 'roland-garros-stadium-tour-tenniseum'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const gygUrl = "https://www.getyourguide.com/paris-l16/paris-roland-garros-stadium-guided-backstage-tour-t418620/?partner_id=HCNITTS&utm_medium=online_publisher";

// Fixes a prior inconsistency: bookingMethod said "official site only" while howToBook already
// named GetYourGuide as a reseller. Now that a real GYG link exists, align both fields.
parsed.bookingMethod = "Book online in advance via GetYourGuide or the official Roland-Garros site — no on-site or walk-up sales.";

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([
      { platform: "GetYourGuide", label: "Roland Garros Stadium Guided Backstage Tour", url: gygUrl },
    ])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ practical_info.bookingMethod updated — clean text, no raw URL, aligned with howToBook");
console.log("✓ booking_links — 1 GetYourGuide entry (Stadium Backstage Tour)");
await sql.end();
