import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const ids = [
  'd08d93fc-b017-42dc-8106-efca573f69c1', // GA Lusail Hill
  'c84fa5f9-4e60-4eb4-ab42-b8f03ceddae5', // Lusail Hill Lounge
  '0c54551a-a1e8-4f9a-aa13-df95ed86fbb7', // Main Grandstand
  '921d9090-6e37-475d-8f37-1417062d52fa', // North Grandstand
  'a825c4f5-87d4-4674-b683-f035fdc654fc', // Paddock Club & Champions Club
  'f46fe80e-b09c-4305-98da-93786203c811', // Ticket Guide
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
