import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

await sql`
  UPDATE experiences
  SET why_its_special = replace(
    why_its_special,
    'The data shows Les Combes among the highest-frequency overtaking zones on the 2026 calendar precisely because the preceding straight is so long and the braking zone so demanding.',
    'The data consistently shows Les Combes among the highest-frequency overtaking zones on the F1 calendar, precisely because the preceding straight is so long and the braking zone so demanding.'
  )
  WHERE id = '415ad447-2dcf-434a-8706-947d1e9ba096'
`;

const check = await sql`SELECT why_its_special FROM experiences WHERE id = '415ad447-2dcf-434a-8706-947d1e9ba096'`;
console.log(check[0].why_its_special.includes("2026") ? "STILL HAS 2026" : "clean");
await sql.end();
