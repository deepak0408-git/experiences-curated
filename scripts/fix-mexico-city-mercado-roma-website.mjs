import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "6c579572-358b-42d2-8478-c8e9d42f02ae";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("Before:", existing.practicalInfo.website);

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, website: "https://mr.mercadoroma.com" },
    lastVerifiedDate: "2026-09-07",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log("After: https://mr.mercadoroma.com");
console.log(`\n✓ Updated: ${result.title}`);
await client.end();
