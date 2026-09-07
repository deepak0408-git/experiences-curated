import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const newTitle = "Montmartre — Paris's Hilltop Artists' Village";
console.log(`New title length: ${newTitle.length} (max 60)`);

await db.update(experiences)
  .set({ title: newTitle })
  .where(eq(experiences.slug, "montmartre-neighborhood"));

console.log("✓ montmartre-neighborhood — title now includes a descriptive phrase");

await client.end();
