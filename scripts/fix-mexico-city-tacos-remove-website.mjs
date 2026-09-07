import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "d9408f95-1182-44ee-88b8-b91640914ca7";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const { website, ...rest } = existing.practicalInfo;

const [result] = await db
  .update(experiences)
  .set({ practicalInfo: rest, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log(`✓ Updated: ${result.title}`);
console.log(JSON.stringify(result.practicalInfo, null, 2));
await client.end();
