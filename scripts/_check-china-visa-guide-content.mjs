import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [exp] = await sql`SELECT body_content, subtitle FROM experiences WHERE slug = 'china-visa-apps-payments-guide-mskq7nml'`;
console.log("SUBTITLE:", exp.subtitle);
console.log("\nBODY:\n", exp.body_content);

await sql.end();
