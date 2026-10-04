import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-paddock-club-mud1oacj";

await db.update(experiences)
  .set({ heroImageCredit: null })
  .where(eq(experiences.slug, SLUG));

console.log("heroImageCredit cleared for", SLUG);

await client.end();
