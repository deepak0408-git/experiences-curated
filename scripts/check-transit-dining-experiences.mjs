import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const dests = [
  { name: "Belgian Ardennes", id: "101b815a-ba64-4484-aad6-63721a44ed85" },
  { name: "Milan", id: "0b0d8f9a-911d-4cc7-8049-50e4685958ca" },
  { name: "Abu Dhabi", id: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca" },
  { name: "New York", id: "fb782de2-bbe6-410f-b466-2a4e628cda10" },
];

for (const d of dests) {
  const rows = await sql`
    SELECT title, experience_type, subtitle
    FROM experiences
    WHERE destination_id = ${d.id}
    AND experience_type IN ('transit', 'dining')
    AND status = 'published'
  `;
  console.log(`\n=== ${d.name} ===`);
  console.log(rows);
}
await sql.end();
