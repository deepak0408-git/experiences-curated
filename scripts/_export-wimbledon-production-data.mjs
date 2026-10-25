import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";

// Exports the deployed Wimbledon 2027 tennis_ticket_intelligence_options
// rows (all 25, all columns) to JSON — handback artifact #2 of the
// implementation contract's Section 10C ("Exported production data").
// Read-only, deterministic, never modifies anything.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const OUT = process.argv[2] ?? "wimbledon-production-options-export.json";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT * FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} ORDER BY option_number
`;
await sql.end();

fs.writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.log(`Exported ${rows.length} rows to ${OUT}`);
