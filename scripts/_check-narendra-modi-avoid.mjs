import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({
  whatToAvoid: experiences.whatToAvoid,
}).from(experiences).where(eq(experiences.slug, "narendra-modi-stadium-mueclmpw"));

console.log(row.whatToAvoid);
process.exit(0);
