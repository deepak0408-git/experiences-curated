import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({ bodyContent: experiences.bodyContent, whatToAvoid: experiences.whatToAvoid })
  .from(experiences)
  .where(eq(experiences.slug, "chinese-gp-fan-zone-mud1r9kw"));

console.log("BODY:\n", row.bodyContent);
console.log("\nAVOID:\n", row.whatToAvoid);
await client.end();
