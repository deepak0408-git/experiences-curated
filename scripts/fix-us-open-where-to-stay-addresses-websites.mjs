import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-us-open-mq4wj388";

const ADDRESS = "Four Points by Sheraton Flushing: 33-68 Farrington Street, Flushing, NY 11354; Boro Hotel: 38-28 27th Street, Long Island City, NY 11101; Hilton Garden Inn Long Island City: 29-21 41st Avenue, Long Island City, NY 11101; Hyatt Grand Central New York: 109 East 42nd Street, New York, NY 10017";

const WEBSITE = "Four Points by Sheraton Flushing: marriott.com/nycfl; Boro Hotel: borohotel.com; Hilton Garden Inn Long Island City: hilton.com/ispicgi; Hyatt Grand Central New York: newyork.grand.hyatt.com";

const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));
const updatedPracticalInfo = { ...existing.practicalInfo, website: WEBSITE };

const result = await db
  .update(experiences)
  .set({ address: ADDRESS, practicalInfo: updatedPracticalInfo })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, address: experiences.address, practicalInfo: experiences.practicalInfo });

console.log(JSON.stringify(result, null, 2));
process.exit(0);
