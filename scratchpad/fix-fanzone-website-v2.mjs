import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "26f329b5-7724-44b2-9ecd-7e2ec9fc27c2";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("Before:", existing.practicalInfo.website);

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, website: "https://www.mexicogp.mx/mapa-del-circuito" },
    lastVerifiedDate: "2026-09-06",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log("After: https://www.mexicogp.mx/mapa-del-circuito");
console.log(`\n✓ Updated: ${result.title}`);
await client.end();
