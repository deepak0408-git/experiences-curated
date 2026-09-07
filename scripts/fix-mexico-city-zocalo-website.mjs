import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38723247-3610-4906-baa6-35d5839429fb";

const website = "https://mexicocity.cdmx.gob.mx/venues/metropolitan-cathedral/, https://lugares.inah.gob.mx/en/node/4236";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("Before:", existing.practicalInfo.website);

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, website },
    lastVerifiedDate: "2026-09-07",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log("After:", website);
console.log(`\n✓ Updated: ${result.title}`);
await client.end();
