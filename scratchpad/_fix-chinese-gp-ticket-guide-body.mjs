import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-ticket-guide-mud1pntb";
const REMOVE_TEXT = "The 2027 Chinese Grand Prix is confirmed for April 16-18 at Shanghai International Circuit, and as of this writing, tickets are not yet on sale — every tier, from general admission through the F1 Paddock Club, is on a waitlist through Formula 1's own official ticketing site, run on a platform called Fever. That's the single most important fact for planning this trip right now: nobody has a confirmed price for anything yet, and the earliest move you can make is signing up for pre-sale access, not buying.\n\n";

const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row) {
  console.error("Row not found");
  process.exit(1);
}

if (!row.bodyContent.includes(REMOVE_TEXT)) {
  console.error("Target text not found in current bodyContent — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(REMOVE_TEXT, "");

await db.update(experiences)
  .set({ bodyContent: newBody })
  .where(eq(experiences.slug, SLUG));

console.log("Updated. New body starts with:");
console.log(newBody.slice(0, 200));

await client.end();
