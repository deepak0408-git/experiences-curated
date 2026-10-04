import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent, status: experiences.status })
  .from(experiences)
  .where(eq(experiences.slug, "chinese-gp-ticket-guide-mud1pntb"));

console.log(row.status);
console.log("----");
console.log(row.bodyContent);
await client.end();
