import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const cols = [
  "c1_lots_of_tennis",
  "c1_big_stadium",
  "c1_close_up_courts",
  "c1_balanced_experience",
  "c5_close_to_action",
  "c5_balanced_view",
  "c5_no_preference",
  "c5_flexible_explore",
];
for (const c of cols) {
  await sql.unsafe(`ALTER TABLE "tennis_ticket_intelligence_options" ADD COLUMN IF NOT EXISTS "${c}" numeric(4,2)`);
}

const result = await sql`
  SELECT column_name, data_type, numeric_precision, numeric_scale, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'tennis_ticket_intelligence_options' AND column_name LIKE 'c1_%' OR column_name LIKE 'c5_%'
  ORDER BY column_name
`;
console.log(result);

await sql.end();
