import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({ title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl })
  .from(experiences)
  .where(like(experiences.slug, "%bmw-pga%"));

rows.forEach(r => console.log(r.slug, "->", r.heroImageUrl));
await client.end();
