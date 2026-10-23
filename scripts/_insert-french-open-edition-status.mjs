import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Creates the French Open edition-status row, deliberately left inactive:
// activated_at NULL, catalogue_ratified false. Per spec §5.5/§13 — French
// Open must remain unavailable until independent validation and founder
// authorization. This is the fail-closed gate getTennisOptionsData.ts
// checks on every request.
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const EDITION_YEAR = 2027;

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const result = await sql`
  INSERT INTO tennis_ticket_intelligence_edition_status (
    sporting_event_id, reviewed_edition_year, activated_at, activated_by, catalogue_ratified
  ) VALUES (
    ${FRENCH_OPEN_EVENT_ID}, ${EDITION_YEAR}, NULL, NULL, false
  )
  ON CONFLICT (sporting_event_id) DO NOTHING
  RETURNING *
`;
console.log("Insert result:", result);

const [row] = await sql`
  SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = ${FRENCH_OPEN_EVENT_ID}
`;
console.log("French Open edition status row:", row);

const [aoRow] = await sql`
  SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6'
`;
console.log("Australian Open edition status row (should be unchanged):", aoRow);

await sql.end();
