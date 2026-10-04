import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-getting-there-mud21xas";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const { website, ...rest } = row.practicalInfo;

await db.update(experiences)
  .set({ practicalInfo: rest })
  .where(eq(experiences.slug, SLUG));

console.log("Removed website field. New practicalInfo:", JSON.stringify(rest, null, 2));

await client.end();
