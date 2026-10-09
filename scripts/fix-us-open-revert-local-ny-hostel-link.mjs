import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-us-open-mq4wj388";

const [existing] = await db.select({ bookingLinks: experiences.bookingLinks }).from(experiences).where(eq(experiences.slug, SLUG));

const revertedLinks = existing.bookingLinks.filter((l) => l.label !== "The Local NY Hostel");

const result = await db
  .update(experiences)
  .set({ bookingLinks: revertedLinks })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, bookingLinks: experiences.bookingLinks });

console.log("Reverted. Remaining links:", result[0].bookingLinks.length);
process.exit(0);
