import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({ id: experiences.id, title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl })
  .from(experiences).where(like(experiences.slug, "italian-gp-first-timer%"));
console.log(rows);

const rows2 = await db.select({ id: experiences.id, title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl })
  .from(experiences).where(eq(experiences.slug, "italian-gp-first-timer-guide-mu7ckouk"));
console.log(rows2);
await client.end();
