import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

for (const slug of ["where-to-stay-us-open-mq4wj388", "jackson-heights-food-mile-mq4wj388", "hudson-valley-day-trip-muv8oso9", "atlantic-city-day-trip-muv8opr2"]) {
  const [r] = await db.select().from(experiences).where(eq(experiences.slug, slug));
  const hasGoogleLink = /maps\.google\.com|google\.com\/maps/.test(r.bodyContent ?? "");
  const hasStaticRating = /\b[1-5]\.\d\s*(stars?|rating|\(|from)/i.test(r.bodyContent ?? "");
  console.log(`${slug}: hasGoogleMapsLink=${hasGoogleLink} hasStaticRatingPattern=${hasStaticRating}`);
}
process.exit(0);
