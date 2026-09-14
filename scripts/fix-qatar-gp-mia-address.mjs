// Qatar GP 2026 — fix qatar-gp-museum-islamic-art-mtyn1cdh: add address.
// Was null. Founder asked to add it 14 Sep 2026 (same as national-museum-qatar).
// Source: mia.org.qa (official site, already cited as practicalInfo.website)
// — "Off Al Corniche St, Doha, Qatar" is the address listed there, confirmed
// via direct fetch.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-museum-islamic-art-mtyn1cdh";

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    address: "Off Al Corniche St, Doha, Qatar",
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: added address (Off Al Corniche St, Doha) per founder instruction, confirmed directly on mia.org.qa.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
