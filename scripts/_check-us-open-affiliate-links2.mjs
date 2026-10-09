import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({
  slug: experiences.slug,
  bookingLinks: experiences.bookingLinks,
}).from(experiences).where(inArray(experiences.slug, [
  "where-to-stay-us-open-mq4wj388",
  "nyc-museums-day-trip-muverkw6",
  "atlantic-city-day-trip-muv8opr2",
  "hudson-valley-day-trip-muv8oso9",
]));

for (const r of rows) {
  console.log(`=== ${r.slug} ===`);
  console.log(JSON.stringify(r.bookingLinks, null, 2));
}
process.exit(0);
