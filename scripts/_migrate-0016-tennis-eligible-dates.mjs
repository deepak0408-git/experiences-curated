import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

await sql`ALTER TABLE "tennis_ticket_intelligence_options" ADD COLUMN IF NOT EXISTS "eligible_from" date`;
await sql`ALTER TABLE "tennis_ticket_intelligence_options" ADD COLUMN IF NOT EXISTS "eligible_to" date`;

const cols = await sql`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name IN ('eligible_from', 'eligible_to')
`;
console.log(cols);

await sql.end();
