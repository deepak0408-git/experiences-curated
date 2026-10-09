import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "hudson-valley-day-trip-muv8oso9";

const bookingLinks = [
  {
    url: "https://www.getyourguide.com/new-york-city-l59/nyc-hudson-valley-private-day-tour-t1089410/?partner_id=HCNITTS&utm_medium=online_publisher",
    label: "NYC — Hudson Valley Private Day Tour",
    platform: "getyourguide",
  },
];

const result = await db
  .update(experiences)
  .set({ bookingLinks })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, bookingLinks: experiences.bookingLinks });

console.log(JSON.stringify(result, null, 2));
process.exit(0);
