// Qatar GP 2026 — set hero_image_credit to "Representative Image" on
// Lusail Hill Lounge and Main Grandstand. Both are curator-approved
// AI-generated hero image exceptions (13 Sep 2026, see
// seed-qatar-gp-lusail-hill-lounge-ai-exception.mjs and
// seed-qatar-gp-main-grandstand-ai-exception.mjs) where heroImageCredit was
// deliberately left null and the AI-generated fact tracked only in the
// internal editorialNote. Per curator instruction 14 Sep 2026, the credit
// field now carries a public-facing "Representative Image" disclosure
// instead of staying blank.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUGS = [
  "qatar-gp-lusail-hill-lounge-mtymm3gw",
  "qatar-gp-main-grandstand-mtymn305",
];

for (const slug of SLUGS) {
  const [row] = await db.select({ id: experiences.id, heroImageCredit: experiences.heroImageCredit })
    .from(experiences).where(eq(experiences.slug, slug));
  if (!row) throw new Error("Experience not found: " + slug);
  if (row.heroImageCredit !== null) {
    throw new Error(slug + ": heroImageCredit was not null as expected (" + row.heroImageCredit + ") — aborting to avoid overwriting an existing real credit.");
  }
  await db.update(experiences).set({ heroImageCredit: "Representative Image" }).where(eq(experiences.id, row.id));
  console.log("Set hero_image_credit = 'Representative Image' for", slug);
}

await client.end();
