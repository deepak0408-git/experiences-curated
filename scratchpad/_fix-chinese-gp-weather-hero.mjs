import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-weather-mud24hlf";
const heroImageUrl = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/bahrain-grand-prix-packing.jpg";

await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Packed suitcase and travel essentials for a race weekend trip",
    heroImageCredit: "Shared packing-themed image, used site-wide across event packs for Weather & What to Pack content",
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated heroImageUrl for", SLUG, "to match the weather spoke's imageOverride.");

await client.end();
