// Qatar GP 2026 — fix qatar-gp-khor-al-adaid-mtyn3hq9: googleMapsRating/
// googleMapsReviewCount were wrong — they belonged to a different listing
// (365 Adventures, the tour operator mentioned in bodyContent) rather than
// the actual place this experience is about: Khor Al Udaid (the Inland
// Sea) itself. Founder shared a screenshot 14 Sep 2026 confirming the
// correct Google Maps listing for "Khor Al Udaid" (Tourist attraction):
// 4.7 rating, 265 reviews, at the googleMapsUrl already corrected in the
// prior fix (fix-qatar-gp-khor-al-adaid-maps-url.mjs,
// https://maps.app.goo.gl/QRnu8WdCkkaTz61K9).
// Old (wrong): 4.9 / 475 reviews — was 365 Adventures' own rating, not the
// destination's.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-khor-al-adaid-mtyn3hq9";

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    googleMapsRating: "4.7",
    googleMapsReviewCount: 265,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: corrected googleMapsRating/googleMapsReviewCount from 4.9/475 (which belonged to 365 Adventures, the tour operator, not the destination) to 4.7/265 — the real rating for the Khor Al Udaid place listing itself, confirmed via founder screenshot of the correct Google Maps entry.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
