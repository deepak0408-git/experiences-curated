import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-general-admission-mud1mn7y";
const REMOVE_TEXT = ", currently on the same 2027 waitlist as everything else";

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

console.log("Updated. Relevant sentence now reads:");
console.log(newBody.split("\n\n")[0]);

await client.end();
