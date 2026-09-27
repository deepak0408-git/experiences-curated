import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, inArray } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f";
const rows = await db.select().from(experiences).where(eq(experiences.sportingEventId, EVENT_ID));

for (const r of rows) {
  const hits = [];
  for (const [k, v] of Object.entries(r)) {
    const s = typeof v === "string" ? v : JSON.stringify(v);
    if (s && s.includes("AU$")) hits.push(k);
  }
  if (hits.length) console.log(r.slug, "->", hits.join(", "));
}
await client.end();
