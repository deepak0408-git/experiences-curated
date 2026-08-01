import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const titles = [
  'Getting to the Circuit — Shuttles, Driving & Parking',
  'Belgian Race Weekend Street Food',
  'Getting to the Circuit — Train, Walk & Parking',
  'Eating in Monza — Risotto, Luganega & the Brianza Table',
  'The 7 Train to Flushing',
  'Jackson Heights: The Food Mile',
];

for (const t of titles) {
  const [row] = await sql`SELECT title, body_content FROM experiences WHERE title = ${t}`;
  console.log(`\n### ${row.title}\n${row.body_content.slice(0, 500)}...`);
}
await sql.end();
