// Qatar GP 2026 — fix qatar-gp-lusail-hill-general-admission-mtzc059v:
// remove the trailing sentence from practicalInfo.costRange per founder
// instruction 14 Sep 2026 — "The official site no longer lists a standard
// GA product, only a separately named, much more expensive 'Lusail Hill'
// hospitality club product — do not confuse the two."

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-lusail-hill-general-admission-mtzc059v";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  costRange:
    "General Admission (Lusail Hill) sold out on the official F1 ticket store by late Aug 2026 — last listed around QAR 600 for the 3-day pass on secondary sources, unconfirmed against the official site directly.",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: removed trailing sentence from practicalInfo.costRange ('The official site no longer lists a standard GA product...') per founder instruction.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
