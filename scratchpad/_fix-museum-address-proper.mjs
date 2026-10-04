import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-neighborhood-mue5lzhx";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const { address: invalidKey, ...cleanPracticalInfo } = row.practicalInfo;

await db.update(experiences)
  .set({
    practicalInfo: cleanPracticalInfo,
    address: "Shanghai Auto Museum: No. 7565 Boyuan Road, Anting, Jiading District, Shanghai. Anting German Town: centered around the square near Shanghai Automobile City metro station, Anting, Jiading District.",
  })
  .where(eq(experiences.slug, SLUG));

console.log("Moved address to top-level address column (practicalInfo.address isn't a valid schema field). practicalInfo now:", JSON.stringify(cleanPracticalInfo, null, 2));

await client.end();
