import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

await sql`
  UPDATE experiences
  SET body_content = replace(
    body_content,
    'The 2026 temporary exhibition, running through November, covers Japanese woodblock printing and manga.',
    'The Apollinaire museum runs a temporary exhibition most years — check abbayedestavelot.be for what''s showing when you visit.'
  )
  WHERE id = '88f15c8f-52d6-42e0-a4f2-c3c63a88a28e'
`;

const check = await sql`
  SELECT body_content FROM experiences WHERE id = '88f15c8f-52d6-42e0-a4f2-c3c63a88a28e'
`;
console.log(check[0].body_content.includes("2026") ? "STILL HAS 2026" : "clean");
await sql.end();
