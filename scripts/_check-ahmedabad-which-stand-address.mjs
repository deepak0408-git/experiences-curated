import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({
  slug: experiences.slug,
  address: experiences.address,
  status: experiences.status,
}).from(experiences).where(eq(experiences.slug, "ahmedabad-which-stand-muecmt5o"));

console.log(row);
process.exit(0);
