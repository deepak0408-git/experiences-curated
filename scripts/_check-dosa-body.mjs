import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({
  bodyContent: experiences.bodyContent,
  whyItsSpecial: experiences.whyItsSpecial,
  status: experiences.status,
}).from(experiences).where(eq(experiences.slug, "chennai-filter-coffee-dosa-muecju1c"));

console.log("=== BODY ===");
console.log(row.bodyContent);
console.log("\n=== WHY ITS SPECIAL ===");
console.log(row.whyItsSpecial);
console.log("\n=== STATUS ===", row.status);
process.exit(0);
