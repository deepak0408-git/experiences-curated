import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "0cf09a6e-8b5a-4c6b-9bec-39440b179814"; // Weather & What to Pack (Brazilian GP)

const [row] = await db
  .update(experiences)
  .set({ practicalInfo: null })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "— practicalInfo:", row.practicalInfo);
await client.end();
