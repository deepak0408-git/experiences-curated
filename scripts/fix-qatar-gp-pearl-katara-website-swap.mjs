// Qatar GP 2026 — fix qatar-gp-pearl-katara-mtyn4luu: replace the first
// website entry (visitqatar.com tourism page) with the official Pearl-Qatar
// site, https://thepearlqatar.com — per founder instruction 14 Sep 2026.
// Confirmed via WebFetch as the genuine official site for The Pearl island
// development. Katara's website (katara.net) stays as the second,
// comma-separated entry, unchanged.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-pearl-katara-mtyn4luu";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  website: "https://thepearlqatar.com, https://www.katara.net/en/",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced first website entry (visitqatar.com tourism page) with the official Pearl-Qatar site, thepearlqatar.com, per founder instruction. Confirmed genuine via WebFetch. Katara's website unchanged.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
