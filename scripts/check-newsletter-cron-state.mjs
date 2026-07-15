import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({
  name: sportingEvents.name,
  slug: sportingEvents.slug,
  isHidden: sportingEvents.isHidden,
  activatedAt: sportingEvents.activatedAt,
  newsletterAnnouncedAt: sportingEvents.newsletterAnnouncedAt,
}).from(sportingEvents)
  .where(inArray(sportingEvents.slug, ["us-open-2026", "hungarian-gp-2026", "italian-gp-2026"]));

for (const r of rows) console.log(JSON.stringify(r, null, 2));
await client.end();
