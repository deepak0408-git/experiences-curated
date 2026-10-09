import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [ev] = await db.select().from(sportingEvents).where(like(sportingEvents.slug, "%french-open%"));
console.log("EVENT:", JSON.stringify({ id: ev?.id, slug: ev?.slug, name: ev?.name }, null, 2));

if (ev) {
  const rows = await db.select({
    slug: experiences.slug, title: experiences.title,
    googleMapsRating: experiences.googleMapsRating,
    googleMapsReviewCount: experiences.googleMapsReviewCount,
    googleMapsUrl: experiences.googleMapsUrl,
    address: experiences.address,
  }).from(experiences).where(eq(experiences.sportingEventId, ev.id));
  for (const r of rows) console.log(JSON.stringify(r));
}
process.exit(0);
