import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Replaces practical_info.website (was the Trenord Milano Centrale-Monza
// timetable link) with the 3 hotels' own direct sites, matching the
// existing multi-URL comma-separated convention used elsewhere (e.g.
// mexico-city-gp-where-to-sit-mtpdhggj, singapore-gp-waterfront-walk-).
// Founder-supplied URLs, 19 Sep 2026. booking_links (Booking.com affiliate
// entries for the same 3 hotels) is untouched.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "staying-in-milan-city-base-strategy-mrbv33on";
const NEW_WEBSITE = [
  "https://www.hyatt.com/hyatt-centric/en-US/mxpct-hyatt-centric-milan-centrale",
  "https://www.hilton.com/en/hotels/milhitw-hilton-milan/",
  "https://bbhotels.it/smarthotel-re-milano-nord/?lang=en",
].join(", ");

try {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(practical_info, '{website}', to_jsonb(${NEW_WEBSITE}::text))`,
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, practicalInfo: experiences.practicalInfo });

  console.log("Updated:", result?.title, "|", result?.id, "|", result?.slug);
  console.log("New website field:", result?.practicalInfo?.website);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
