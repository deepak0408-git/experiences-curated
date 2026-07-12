import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const rows = await db
  .select({ id: experiences.id, title: experiences.title, slug: experiences.slug, status: experiences.status, experienceType: experiences.experienceType })
  .from(experiences)
  .where(eq(experiences.sportingEventId, EVENT_ID));

console.log(`\nTotal experiences linked to Hungarian GP: ${rows.length}\n`);
rows.forEach((r, i) => {
  console.log(`${i + 1}. [${r.status}] (${r.experienceType}) ${r.title}`);
  console.log(`   ${r.id}`);
});

await client.end();
