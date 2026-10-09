import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "bgt-rivalry-history-mueczn6b";

const [row] = await db.select({ subtitle: experiences.subtitle }).from(experiences).where(eq(experiences.slug, SLUG));
console.log("Current subtitle:", row.subtitle);

const NEW_SUBTITLE = "10 series wins in 17 for India, and two of the greatest Test matches this century.";

const [result] = await db.update(experiences)
  .set({ subtitle: NEW_SUBTITLE })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, subtitle: experiences.subtitle, status: experiences.status });

console.log(result);
process.exit(0);
