import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ whyItsSpecial: experiences.whyItsSpecial })
  .from(experiences)
  .where(eq(experiences.slug, "paris-icons-eiffel-tower-seine-arc-de-triomphe"));

const oldLine =
  " [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15687558599447307325)";

if (!row.whyItsSpecial.includes(oldLine)) {
  throw new Error("Expected rating-link fragment not found in why_its_special — aborting to avoid a silent no-op.");
}

const whyItsSpecial = row.whyItsSpecial.replace(oldLine, "");

await db.update(experiences)
  .set({ whyItsSpecial })
  .where(eq(experiences.slug, "paris-icons-eiffel-tower-seine-arc-de-triomphe"));

console.log("✓ paris-icons-eiffel-tower-seine-arc-de-triomphe — rating link removed from why_its_special");

await client.end();
