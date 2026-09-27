import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f";
const rows = await db.select({ id: experiences.id, slug: experiences.slug, title: experiences.title }).from(experiences).where(eq(experiences.sportingEventId, EVENT_ID));
console.log(rows.length, "rows");
for (const r of rows) console.log(r.slug, "|", r.title);
await client.end();
