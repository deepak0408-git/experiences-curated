import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`SELECT id, body_content, insider_tips, what_to_avoid FROM experiences WHERE title = 'Getting to the Autódromo Hermanos Rodríguez'`;
console.log("BODY:\n", rows[0].body_content);
console.log("\nINSIDER TIPS:\n", JSON.stringify(rows[0].insider_tips, null, 2));
console.log("\nWHAT TO AVOID:\n", rows[0].what_to_avoid);
await sql.end();
