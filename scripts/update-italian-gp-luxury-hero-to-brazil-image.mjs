import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const EXPERIENCE_SLUG = "paddock-club-champions-club-hospitality-mrbsb3a1";
const HERO_IMAGE_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/brazilian-grand-prix-paddock-club.jpg";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(experiences)
  .set({ heroImageUrl: HERO_IMAGE_URL })
  .where(eq(experiences.slug, EXPERIENCE_SLUG));

console.log("✓ DB updated — heroImageUrl set to Brazilian GP paddock club image");
console.log(`→ Experience: http://localhost:3000/experience/${EXPERIENCE_SLUG}`);

await client.end();
