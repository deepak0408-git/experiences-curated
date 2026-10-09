import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "narendra-modi-stadium-mueclmpw";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));

const [result] = await db.update(experiences)
  .set({
    practicalInfo: {
      ...row.practicalInfo,
      website: "https://gujaratcricketassociation.com/narendra-modi-stadium/",
    },
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo, status: experiences.status });

console.log(result);
process.exit(0);
