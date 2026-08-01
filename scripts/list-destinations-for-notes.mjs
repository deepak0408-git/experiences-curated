import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const rows = await sql`SELECT id, name FROM destinations WHERE id IN (
  '101b815a-ba64-4484-aad6-63721a44ed85',
  '0b0d8f9a-911d-4cc7-8049-50e4685958ca',
  'd4d2ed49-0217-441d-8d1f-38c9b03db2ca',
  'fb782de2-bbe6-410f-b466-2a4e628cda10'
)`;
console.log(rows);
await sql.end();
