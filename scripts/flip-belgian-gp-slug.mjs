import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

// Evergreen-slug migration DB rename — migrate-from-classic-to-hub-spoke
// skill §1 step 5. Run only AFTER Deploy A (next.config.ts redirect) is
// confirmed live on production — confirmed 12 Oct 2026 via curl -sIL
// against both apex and www.experiences-curated.com, hub page and a spoke
// sub-path, both correctly 308-redirecting to /event-pack/belgian-grand-prix.
// Archive (scripts/archive-belgian-gp-2026.mjs) already run and confirmed
// before this script, per the archive-before-rename hard rule.
//
// This script ONLY renames the slug and stamps seasonYear — it deliberately
// does NOT touch editionYear/startDate/endDate/name (the 2026->2027 edition
// rollover is a separate, later step per the founder-approved phased plan).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const OLD_SLUG = "belgian-gp-2026";
const NEW_SLUG = "belgian-grand-prix";
const NEW_SEASON_YEAR = 2027;

const [before] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, BELGIAN_GP_ID));
if (!before) throw new Error("Belgian GP event row not found");
if (before.slug !== OLD_SLUG) {
  throw new Error(`Refusing to proceed — current slug is "${before.slug}", expected "${OLD_SLUG}". Already migrated?`);
}

console.log("Before:", { slug: before.slug, seasonYear: before.seasonYear });

const [after] = await db
  .update(sportingEvents)
  .set({ slug: NEW_SLUG, seasonYear: NEW_SEASON_YEAR, updatedAt: new Date() })
  .where(eq(sportingEvents.id, BELGIAN_GP_ID))
  .returning();

console.log("After:", { slug: after.slug, seasonYear: after.seasonYear });
console.log("✓ Slug renamed. editionYear/dates/name intentionally untouched — rollover is a separate step.");

await client.end();
