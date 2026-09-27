import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const ids = [
  'c4d479d3-87eb-4853-b6e9-737a32014ba3', // Abu Dhabi Hill
  'e03380d5-0bf5-49b2-8156-5885624e280d', // Main Grandstand
  '5b07dbc2-c364-4784-905f-411229f34b5f', // West Grandstand
  '0eae6b82-020a-4d14-862e-67baccc728ef', // F1 Paddock Club
];

for (const id of ids) {
  const rows = await sql`SELECT title, body_content, why_its_special FROM experiences WHERE id = ${id}`;
  console.log("=====", rows[0].title, "=====");
  console.log(rows[0].body_content);
  console.log("--- WHY ---");
  console.log(rows[0].why_its_special);
  console.log();
}

await sql.end();
