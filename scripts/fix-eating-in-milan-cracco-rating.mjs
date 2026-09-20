import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql as dsql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Corrects Cracco in Galleria's Google Maps link in "Eating in Milan — Where
// Serious Italians Go" — the earlier link/rating (4.7, 115811 reviews) was
// wrong; founder supplied the real listing directly, 19 Sep 2026 (3.7,
// 4595 reviews).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "eating-in-milan-serious-italians-mrbxw8xs";
const OLD_LINK = "https://maps.app.goo.gl/qAboA6dxxTsHGP6Z8";
const NEW_LINK = "https://maps.app.goo.gl/f9FSvjD6mnVkJf567";

const editorialNote = `Sources per original seed. Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Trattoria Masuelli San Marco 4.3/1417 reviews, Cracco in Galleria 3.7/4595 reviews (corrected 19 Sep 2026 — an earlier, wrong link/rating of 4.7/115811 reviews had been added for this venue) — all maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 2, venueNoun: "restaurants") added to app/experience/[slug]/page.tsx in the same pass.`;

try {
  const [row] = await db
    .update(experiences)
    .set({
      bodyContent: dsql`replace(body_content, ${OLD_LINK}, ${NEW_LINK})`,
      editorialNote,
      lastVerifiedDate: "2026-09-19",
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ title: experiences.title, slug: experiences.slug, bodyContent: experiences.bodyContent });

  const replaced = row?.bodyContent?.includes(NEW_LINK);
  console.log(row ? `✓ ${row.title} (${row.slug}) — link replaced: ${replaced}` : "✗ not found");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
