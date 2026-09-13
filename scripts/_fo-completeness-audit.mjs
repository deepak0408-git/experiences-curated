import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT e.slug, e.title, e.experience_type, e.google_maps_rating, e.address,
         e.practical_info->>'howToBook' as how_to_book, e.booking_links
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'
  ORDER BY e.title
`;
rows.forEach(r => {
  const rating = r.google_maps_rating ? "✓rating" : "✗no-rating";
  const addr = r.address ? "✓addr" : "✗no-addr";
  const howToBook = r.how_to_book ? "CONCIERGE" : "-";
  const bookingLinks = r.booking_links ? "✓links" : "-";
  console.log(`${r.slug} | ${r.experience_type} | ${rating} | ${addr} | ${howToBook} | ${bookingLinks}`);
});
await sql.end();
