import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
await sql`UPDATE sporting_events SET pack_status = 'built_hidden' WHERE id = 'e6f2b585-196e-4842-8648-753a40979f4f'`;
console.log("✓ pack_status set to built_hidden");
await sql.end();
