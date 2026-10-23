import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const before = await sql`
  SELECT numeric_precision, numeric_scale FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name = 'cost_index'
`;
console.log("Before:", before);

await sql`ALTER TABLE "tennis_ticket_intelligence_options" ALTER COLUMN "cost_index" TYPE numeric(20,15)`;

const after = await sql`
  SELECT numeric_precision, numeric_scale FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name = 'cost_index'
`;
console.log("After:", after);

// Confirm no values changed by this ALTER alone (widening scale should
// never alter existing stored values, only allow more precision going
// forward).
const aoSample = await sql`
  SELECT option_number, cost_index FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6' ORDER BY option_number LIMIT 5
`;
console.log("AO sample after widening (should be unchanged '61.38' etc):", aoSample);

const foSample = await sql`
  SELECT option_number, cost_index FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f' ORDER BY option_number LIMIT 5
`;
console.log("FO sample after widening (still truncated until the seed script re-runs):", foSample);

await sql.end();
