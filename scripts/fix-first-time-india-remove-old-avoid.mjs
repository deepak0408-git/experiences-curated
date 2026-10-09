import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "first-time-india-mued2mc4";

const OLD_PREFIX = `Don't assume card payments will work everywhere just because they're widely accepted in your hotel — plenty of everyday transactions across all three cities in this pack are cash-only, and getting caught without rupees at a street food stall or local auto-rickshaw is a common, avoidable first-timer mistake. Don't use your left hand to hand over money, food, or touch someone in greeting — it's a genuine cultural misstep, not a minor one, even though it's an easy habit to forget without thinking about it. `;

const [row] = await db.select({ whatToAvoid: experiences.whatToAvoid }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.whatToAvoid.startsWith(OLD_PREFIX)) {
  console.error("Expected prefix not found — aborting.");
  console.log("Actual start:", row.whatToAvoid.slice(0, 200));
  process.exit(1);
}

const newAvoid = row.whatToAvoid.slice(OLD_PREFIX.length);

const [result] = await db.update(experiences)
  .set({ whatToAvoid: newAvoid })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("\n--- New whatToAvoid ---\n", newAvoid);
process.exit(0);
