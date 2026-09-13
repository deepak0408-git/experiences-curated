import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`
  SELECT e.id, e.title, e.slug, e.experience_type, e.booking_links, e.practical_info, e.address
  FROM sporting_event_experiences see
  JOIN experiences e ON e.id = see.experience_id
  WHERE see.sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f'
  ORDER BY e.title
`;
for (const r of rows) {
  console.log(`\n--- ${r.title} [${r.experience_type}] ---`);
  console.log("slug:", r.slug);
  console.log("address:", r.address);
  console.log("practicalInfo.website:", r.practical_info?.website);
  console.log("bookingLinks:", JSON.stringify(r.booking_links));
}
await sql.end();
