import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-us-open-mq4wj388";

const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));

const WEBSITE = "https://www.marriott.com/en-us/hotels/nycfl-four-points-flushing/overview/, https://www.borohotel.com, https://www.hilton.com/en/hotels/ispicgi-hilton-garden-inn-long-island-city-new-york/, https://newyork.grand.hyatt.com";

const result = await db
  .update(experiences)
  .set({ practicalInfo: { ...existing.practicalInfo, website: WEBSITE } })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo });

console.log(JSON.stringify(result, null, 2));
process.exit(0);
