// Qatar GP 2026 — fix qatar-gp-parisa-atmosphere-dining-mtyn04fd
// practicalInfo.hours and .website. Hours was a placeholder ("Lunch and
// dinner daily — confirm current hours via direct booking...") and website
// was empty. Founder flagged 14 Sep 2026, provided the real website URL.
// Hours: 1:00pm-10:30pm daily, cross-checked across independent search
// results (Tripadvisor, wareontheglobe.com, QTTAR, restaurants-us.com) —
// official parisarestaurants.com/souq-waqif/ page itself doesn't list hours
// directly (checked via WebFetch).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-parisa-atmosphere-dining-mtyn04fd";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  hours: "Daily 1:00pm-10:30pm.",
  website: "https://parisarestaurants.com/souq-waqif/",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced placeholder practicalInfo.hours with real, cross-checked hours (1pm-10:30pm daily) and added website (parisarestaurants.com/souq-waqif) per founder instruction.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
