import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(experiences).where(like(experiences.title, "%Brabham%"));
for (const r of rows) {
  console.log("TITLE:", r.title);
  console.log("SLUG:", r.slug);
  console.log("BODY:\n", r.bodyContent);
  console.log("\nPRACTICAL INFO:\n", JSON.stringify(r.practicalInfo, null, 2));
  console.log("\nINSIDER TIPS:\n", r.insiderTips);
}
await client.end();
