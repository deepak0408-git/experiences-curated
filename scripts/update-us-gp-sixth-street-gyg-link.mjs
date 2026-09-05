import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Real GetYourGuide affiliate URL, supplied directly by the founder 5 Sep
// 2026 — never self-constructed, per standing rule.
const [row] = await db
  .select({ id: experiences.id })
  .from(experiences)
  .where(eq(experiences.slug, "us-gp-sixth-rainey-street-mtnryp67"));

if (!row) {
  console.error("Experience not found");
  process.exit(1);
}

await db.update(experiences).set({
  bookingLinks: [
    {
      platform: "GetYourGuide",
      label: "The Story of Austin: A Downtown History Walking Tour",
      url: "https://www.getyourguide.com/austin-l32477/the-story-of-austin-a-downtown-history-walking-tour-t443655/?partner_id=HCNITTS&utm_medium=online_publisher",
    },
  ],
}).where(eq(experiences.id, row.id));

console.log("✓ Updated bookingLinks for us-gp-sixth-rainey-street-mtnryp67 — The Story of Austin: A Downtown History Walking Tour");
console.log("\n✓ Done — re-publish this row in /curator/review to clear the 1-hour cache.");
await client.end();
