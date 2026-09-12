import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e21441e5-0f88-46c3-99a5-0d73ba603024"; // Getting to Interlagos

const [row] = await db
  .update(experiences)
  .set({
    practicalInfo: sql`jsonb_set(${experiences.practicalInfo}, '{website}', '"https://metrosaopaulo.info/en/route-planner"')`,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", row.practicalInfo.website);
await client.end();
