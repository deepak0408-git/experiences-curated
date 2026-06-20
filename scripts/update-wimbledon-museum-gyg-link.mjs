import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE title ILIKE '%Wimbledon Museum%'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const fullGygUrl = "https://www.getyourguide.com/s?partner_id=HCNITTS&cmp=wimbledon-museum-tour-short-url&et=627603&lc=57";

// Clean text — no raw URL embedded in the Access row
parsed.bookingMethod = "Standard tours: bookings.wimbledon.com or GetYourGuide. Private tours: museum@aeltc.com";

// Update howToBook Pro field to use full URL
if (parsed.howToBook) {
  parsed.howToBook = parsed.howToBook.replace(/https:\/\/gyg\.me\/\S+/, fullGygUrl);
}

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([{ platform: "GetYourGuide", url: fullGygUrl }])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ bookingMethod — clean text, no raw URL");
console.log("✓ booking_links — GetYourGuide with full URL");
console.log("✓ howToBook Pro — full URL");
await sql.end();
