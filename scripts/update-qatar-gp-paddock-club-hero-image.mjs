// Qatar GP 2026 Paddock Club & Champions Club — swap hero image to match the
// Brazilian GP paddock experience's image (a generic hospitality-terrace
// photo, not a venue-specific shot, so reusing it across events is not
// misrepresenting Lusail as somewhere it isn't). Per curator request 14 Sep
// 2026 to match qatar-gp-paddock-champions-club to brazilian-gp-hospitality-
// paddock-club's hero.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const QATAR_PADDOCK_ID_SLUG = "qatar-gp-paddock-champions-club-mtymkynt";

const NEW_HERO = {
  heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/brazilian-grand-prix-paddock-club.jpg",
  heroImageAlt: "Modern glass balcony overlooking a spacious interior, evoking a Paddock Club hospitality terrace",
  heroImageCredit: "Jason Puddephatt, CC BY 4.0",
};

const [row] = await db.select({ id: experiences.id }).from(experiences).where(eq(experiences.slug, QATAR_PADDOCK_ID_SLUG));
if (!row) throw new Error("Experience not found: " + QATAR_PADDOCK_ID_SLUG);

await db.update(experiences).set(NEW_HERO).where(eq(experiences.id, row.id));

console.log("Updated hero image for", QATAR_PADDOCK_ID_SLUG, "->", NEW_HERO.heroImageUrl);
await client.end();
