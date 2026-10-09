import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ilike } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({
  id: experiences.id,
  slug: experiences.slug,
  title: experiences.title,
  address: experiences.address,
  status: experiences.status,
}).from(experiences).where(ilike(experiences.slug, "chepauk%"));

console.log(JSON.stringify(rows, null, 2));
process.exit(0);
