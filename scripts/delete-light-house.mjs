import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { like } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const deleted = await db
  .delete(experiences)
  .where(like(experiences.title, "%Light House%"))
  .returning({ id: experiences.id, title: experiences.title });

if (deleted.length === 0) {
  console.log("No matching experience found.");
} else {
  deleted.forEach(r => console.log(`Deleted: ${r.title} (${r.id})`));
}

await client.end();
