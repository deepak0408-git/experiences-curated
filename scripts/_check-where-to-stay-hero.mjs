import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({ slug: experiences.slug, title: experiences.title, heroImageUrl: experiences.heroImageUrl }).from(experiences).where(like(experiences.slug, "where-to-stay-us-open%"));
for (const r of rows) console.log(JSON.stringify(r, null, 2));
process.exit(0);
