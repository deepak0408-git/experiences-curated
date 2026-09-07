import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Swaps the generic mexicogp.mx/informacion link for a page that actually
// covers Fan Zones specifically — flagged by the founder 6 Sep 2026 as
// having no fan-zone-specific content. mexico.gp/en/fan-zones-37 is a real,
// live page breaking down the 6 color-coded zones (Green/Orange/Blue/
// Yellow/Gray/Brown) with gate numbers, nearby grandstands, and metro
// access per zone — verified 6 Sep 2026, directly relevant to this
// experience's content.

const EXPERIENCE_ID = "26f329b5-7724-44b2-9ecd-7e2ec9fc27c2";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("Before:", existing.practicalInfo.website);

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, website: "https://www.mexico.gp/en/fan-zones-37" },
    lastVerifiedDate: "2026-09-06",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`\n✓ Updated: ${result.title}`);

await client.end();
