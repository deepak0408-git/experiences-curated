import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { blogArticles, sportingEvents } from "./schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [usgp] = await db.select({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug }).from(sportingEvents).where(eq(sportingEvents.slug, "united-states-grand-prix"));
console.log("USGP event:", usgp);

if (usgp) {
  const rows = await db.select({ id: blogArticles.id, title: blogArticles.title, slug: blogArticles.slug, status: blogArticles.status, sportingEventId: blogArticles.sportingEventId })
    .from(blogArticles)
    .where(eq(blogArticles.sportingEventId, usgp.id));
  console.log(JSON.stringify(rows, null, 2));
}
await client.end();
