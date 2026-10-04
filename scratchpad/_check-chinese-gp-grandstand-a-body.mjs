import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({ id: experiences.id, slug: experiences.slug, bodyContent: experiences.bodyContent, status: experiences.status })
  .from(experiences)
  .where(eq(experiences.slug, "chinese-gp-grandstand-a-mud1hlfu"));

console.log(JSON.stringify(rows, null, 2));
await client.end();
