import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import postgres from "postgres";

// Verifies EVERY frozen scoring field on EVERY Wimbledon option against
// the approved source CSV directly, field by field, not just one
// representative option (per the validation requirement after the Q4
// neutrality + c1/c5 precision fixes). Read-only.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const CSV_PATH = process.argv[2];

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  const lines = content.split(/\r?\n/);
  const header = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

const csvRows = parseCsv(CSV_PATH);
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const dbRows = await sql`
  SELECT * FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} ORDER BY option_number
`;
await sql.end();

const FIELD_MAP = [
  ["cost_index", "cost_index", "numeric"],
  ["c1_lots_of_tennis", "c1_lots_of_tennis", "numeric"],
  ["c1_big_stadium", "c1_big_stadium", "numeric"],
  ["c1_close_up_courts", "c1_close_up_courts", "numeric"],
  ["c1_balance", "c1_balanced_experience", "numeric"],
  ["c5_close_to_action", "c5_close_to_action", "numeric"],
  ["c5_clear_balanced_view", "c5_balanced_view", "numeric"],
  ["c5_no_preference", "c5_no_preference", "numeric"],
  ["c5_flexible", "c5_flexible_explore", "numeric"],
  ["eligible_from", "eligible_from", "date"],
  ["eligible_to", "eligible_to", "date"],
];

let failures = 0;
let fieldsChecked = 0;

for (const csvRow of csvRows) {
  const optionNumber = parseInt(csvRow.option_number, 10);
  const dbRow = dbRows.find((r) => r.option_number === optionNumber);
  if (!dbRow) {
    console.log(`[FAIL] option ${optionNumber}: no matching DB row`);
    failures++;
    continue;
  }
  for (const [csvField, dbField, type] of FIELD_MAP) {
    fieldsChecked++;
    const csvVal = csvRow[csvField];
    const dbVal = dbRow[dbField];
    if (type === "numeric") {
      const csvNum = parseFloat(csvVal);
      const dbNum = dbVal === null ? null : Number(dbVal);
      if (dbNum === null || Math.abs(csvNum - dbNum) > 1e-9) {
        console.log(`[FAIL] option ${optionNumber} field ${dbField}: csv=${csvVal} db=${dbVal}`);
        failures++;
      }
    } else if (type === "date") {
      const dbDateStr = dbVal instanceof Date ? dbVal.toISOString().slice(0, 10) : dbVal;
      if (dbDateStr !== csvVal) {
        console.log(`[FAIL] option ${optionNumber} field ${dbField}: csv=${csvVal} db=${dbDateStr}`);
        failures++;
      }
    }
  }
}

console.log(`\nChecked ${fieldsChecked} fields across ${csvRows.length} options.`);
console.log(failures === 0 ? "ALL FIELDS MATCH THE APPROVED CSV EXACTLY" : `${failures} FIELD MISMATCH(ES)`);
process.exit(failures === 0 ? 0 : 1);
