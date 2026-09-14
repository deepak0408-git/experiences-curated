// Qatar GP 2026 — fix qatar-gp-national-museum-qatar-mtyn2dn1: add address.
// Was null. Founder asked to add it 14 Sep 2026.
// Source: nmoq.org.qa/en/visit/ (official site, already cited as
// practicalInfo.website) — "Museum Park Street, Doha" is the only specific
// address listed there, confirmed via direct fetch.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-national-museum-qatar-mtyn2dn1";

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    address: "Museum Park Street, Doha, Qatar",
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: added address (Museum Park Street, Doha) per founder instruction, confirmed directly on nmoq.org.qa/en/visit/.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
