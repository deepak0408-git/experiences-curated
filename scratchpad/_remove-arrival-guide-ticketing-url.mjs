import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-arrival-guide-mud2316w";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const newWebsite = "https://english.shanghai.gov.cn/en-SportsEvents/20260311/933bcc13c7c44363a04a036b4888a7de.html, https://www.formula1shanghai.com/en/entering-the-circuit-31";

const newPracticalInfo = { ...row.practicalInfo, website: newWebsite };

await db.update(experiences)
  .set({ practicalInfo: newPracticalInfo })
  .where(eq(experiences.slug, SLUG));

console.log("Updated website field:", newWebsite);

await client.end();
