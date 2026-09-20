import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "brabham-grandstand-turns-1-2-mu9c1dch";

const [result] = await db
  .update(experiences)
  .set({ heroImageCredit: "Yu Chu Chin, CC BY 4.0" })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, title: experiences.title, heroImageCredit: experiences.heroImageCredit });

console.log(`✓ ${result.slug}`);
console.log(`  hero_image_credit: ${result.heroImageCredit}`);

await client.end();
