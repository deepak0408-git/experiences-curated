// Qatar GP 2026 — fix qatar-gp-pearl-katara-mtyn4luu: add Katara's website
// and set address for both venues. This is a genuinely multi-venue
// experience (The Pearl-Qatar/Porto Arabia + Katara Cultural Village), so
// website is comma-separated (never slash-joined — the experience page
// splits on "," and renders each as its own link) per the field rule.
// Addresses: 27 Porto Arabia Drive, Doha (The Pearl), 21 High Street, Doha
// (Katara) — both confirmed via WebSearch (Waze listings for each).
// Founder asked to add https://www.katara.net/en/ as a second website and
// update the address for both places, 14 Sep 2026.

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
  website: "https://visitqatar.com/intl-en/things-to-do/romantic-getaway/places/the-pearl, https://www.katara.net/en/",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    address: "The Pearl-Qatar/Porto Arabia: 27 Porto Arabia Drive, Doha, Qatar. Katara Cultural Village: 21 High Street, Doha, Qatar.",
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: added Katara's official website (katara.net) as a second, comma-separated website entry alongside the existing visitqatar.com Pearl page — never slash-joined, per the multi-venue website field rule. Added address for both venues (27 Porto Arabia Drive for The Pearl, 21 High Street for Katara), previously null. Sources: WebSearch (Waze listings for both addresses).",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
