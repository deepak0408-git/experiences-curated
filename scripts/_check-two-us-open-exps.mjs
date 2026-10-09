import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

for (const slug of ["queens-a-day-beyond-the-courts-mq4wj388", "when-play-stops-us-open-mq4wj388"]) {
  const [r] = await db.select().from(experiences).where(eq(experiences.slug, slug));
  console.log(`=== ${slug} ===`);
  console.log(r.bodyContent?.slice(0, 500));
  console.log();
}
process.exit(0);
