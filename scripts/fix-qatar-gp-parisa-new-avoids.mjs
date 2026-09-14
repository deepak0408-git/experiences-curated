// Qatar GP 2026 — fix qatar-gp-parisa-atmosphere-dining-mtyn04fd whatToAvoid.
// Both original avoids restated facts already in bodyContent word-for-word:
// Avoid 1 (no walk-in on weekends) restated the body's closing reservation
// line; Avoid 2 (no fusion, traditional only) restated the body's "not
// fusion or a modernized reinterpretation" sentence almost verbatim. Fails
// the hard bar (experience-researcher skill: avoid must not restate
// anything said elsewhere in the experience). Founder flagged 14 Sep 2026.
//
// Replacement — two genuinely new, sourced, nowhere-else-mentioned avoids:
// 1) Pricing runs noticeably higher than typical Souq Waqif spots (per
//    Tripadvisor reviews) — costRange states a number but never flags that
//    it's a premium relative to the souq's usual prices, a real planning
//    fact for anyone budgeting a group dinner.
// 2) Even reservation holders enter through an archway and wait to be
//    seated once a table frees up — distinct from "book ahead" (which
//    addresses getting a reservation at all, not the on-arrival wait once
//    you have one).
// Sources: tripadvisor.com reviews (pricing), eatapp.co / wareontheglobe.com
// (entry/seating process).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-parisa-atmosphere-dining-mtyn04fd";

const whatToAvoid = `Don't expect Souq Waqif's typical prices here — reviewers consistently note Parisa runs noticeably higher than most of the souq's other restaurants, which is worth factoring in before committing to it as the group dinner spot for a full race-weekend party. Don't assume a reservation guarantees an immediate table — guests are seated through an archway entrance as tables actually become free, so even with a booking, build in a short buffer rather than timing your evening to the exact reservation slot.`;

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    whatToAvoid,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced both whatToAvoid sentences — original two restated facts already in bodyContent (weekend booking, traditional-not-fusion) almost verbatim. New avoids: pricing runs higher than typical Souq Waqif spots (tripadvisor.com reviews), and reservation holders still wait at the archway entrance for a table to free up (eatapp.co, wareontheglobe.com) — both genuinely new, nowhere else in the experience.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
