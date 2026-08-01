import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

await sql`
  ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS budget_alternate_airport_iata VARCHAR(3)
`;
console.log("✓ destinations.budget_alternate_airport_iata column added");

await sql`
  ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS alternate_airport_note TEXT
`;
console.log("✓ destinations.alternate_airport_note column added");

await sql.end();
