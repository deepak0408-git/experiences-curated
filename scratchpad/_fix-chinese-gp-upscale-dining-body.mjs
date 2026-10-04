import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-upscale-dining-mud20jh1";
const REMOVE_TEXT = " [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10753692364766140349&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)";

const [row] = await db.select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(REMOVE_TEXT)) {
  console.error("Target text not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(REMOVE_TEXT, "");

await db.update(experiences)
  .set({ bodyContent: newBody })
  .where(eq(experiences.slug, SLUG));

console.log("Updated body. Removed inline Google Maps link (redundant with top-level googleMapsRating/Url).");

await client.end();
