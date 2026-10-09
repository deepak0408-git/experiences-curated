import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [ev] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, "91f298a3-ca22-49c3-9c8e-5a200f0026c9"));
const rows = await db.select({
  slug: experiences.slug,
  title: experiences.title,
  practicalInfo: experiences.practicalInfo,
}).from(experiences).where(eq(experiences.sportingEventId, ev.id));

for (const r of rows) {
  const howToBook = r.practicalInfo?.howToBook;
  if (howToBook) {
    console.log(`=== ${r.slug} ===`);
    console.log("howToBook:", howToBook);
    console.log("bookingMethod:", r.practicalInfo?.bookingMethod);
    console.log();
  }
}
process.exit(0);
