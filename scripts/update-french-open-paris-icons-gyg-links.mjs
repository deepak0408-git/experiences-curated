import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const sql = postgres(DATABASE_URL, { max: 1 });

const [row] = await sql`
  SELECT id, slug, practical_info FROM experiences
  WHERE slug = 'paris-icons-eiffel-tower-seine-arc-de-triomphe'
  LIMIT 1
`;

if (!row) { console.error("Experience not found"); process.exit(1); }

const parsed = typeof row.practical_info === "string"
  ? JSON.parse(row.practical_info)
  : row.practical_info;

const eiffelUrl = "https://www.getyourguide.com/paris-l16/paris-eiffel-tower-summit-or-second-floor-access-t62484/?partner_id=HCNITTS&utm_medium=online_publisher";
const seineUrl = "https://www.getyourguide.com/paris-l16/paris-bateaux-mouches-evening-cruise-souvenir-postcard-t1282311/?partner_id=HCNITTS&utm_medium=online_publisher";
const arcUrl = "https://www.getyourguide.com/paris-l16/paris-arc-de-triomphe-rooftop-tickets-t66157/?partner_id=HCNITTS&utm_medium=online_publisher";

parsed.bookingMethod = "All three bookable via GetYourGuide — Eiffel Tower, Seine cruise, and Arc de Triomphe rooftop.";

await sql`
  UPDATE experiences
  SET
    practical_info = ${JSON.stringify(parsed)}::jsonb,
    booking_links = ${JSON.stringify([
      { platform: "GetYourGuide", label: "Eiffel Tower Summit/Second Floor Access", url: eiffelUrl },
      { platform: "GetYourGuide", label: "Seine Evening Cruise (Bateaux Mouches)", url: seineUrl },
      { platform: "GetYourGuide", label: "Arc de Triomphe Rooftop Tickets", url: arcUrl },
    ])}::jsonb
  WHERE id = ${row.id}
`;

console.log("✓ practical_info.bookingMethod updated — clean text, no raw URL");
console.log("✓ booking_links — 3 GetYourGuide entries (Eiffel Tower, Seine cruise, Arc de Triomphe)");
await sql.end();
