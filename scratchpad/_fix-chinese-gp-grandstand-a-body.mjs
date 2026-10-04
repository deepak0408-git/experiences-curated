import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-grandstand-a-mud1hlfu";
const REMOVE_TEXT = "\n\n2027 session times are still marked TBC across F1's own sites as of this writing, though the weekend format itself (Friday practice, Saturday qualifying, Sunday race) is confirmed. Don't book a grandstand seat assuming specific session clock times — check back closer to the event, or see this pack's Ticket Guide and Arrival experiences for the latest confirmed schedule once it's published.";

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

console.log("Updated. New body ends with:");
console.log(newBody.slice(-200));

await client.end();
