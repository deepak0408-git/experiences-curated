import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "getting-to-albert-park-tram-train-mu9c7ocr";
const NEW_WEBSITE = "https://transport.vic.gov.au/news-and-resources/projects-hub/greater-melbourne/metro-tunnel/more-ways-to-move";

try {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(${experiences.practicalInfo}, '{website}', ${JSON.stringify(NEW_WEBSITE)}::jsonb)`,
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status, practicalInfo: experiences.practicalInfo });

  if (!result) {
    console.error("No experience found with slug:", SLUG);
  } else {
    console.log("\n✓ Updated:", result.slug, "|", result.id, "| status:", result.status);
    console.log("practicalInfo:", result.practicalInfo);
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
