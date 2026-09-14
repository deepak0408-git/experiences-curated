// Qatar GP 2026 — fix qatar-gp-souq-waqif-mtyn629z practicalInfo.hours,
// .website, and top-level address. Hours was vague ("Generally open daily,
// most shops and cafés active late afternoon into late evening"), website
// was empty, address was null. Founder asked for real hours, the website
// (souqwaqif.qa), and an address.
// Hours: shops 10am-12pm and 4pm-10pm (siesta split, standard Doha souq
// pattern), Fridays closed for prayers in the afternoon; restaurants and
// cafés run longer, roughly 8am-midnight — cross-checked across Marhaba
// Qatar, Lonely Planet, Qatar Living, globalgritandglam.com.
// Address: Souq Waqif sits in the Al Jasrah district of central Doha,
// between Al Asmakh and Al Ahmed streets (per Wikipedia, matches the
// Falcon Souq location already stated in bodyContent) — no single street
// number exists since it's a district-scale market, not one building.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-souq-waqif-mtyn629z";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  hours:
    "Shops: 10am-12pm and 4pm-10pm daily (closed Friday afternoons for prayers). Restaurants and cafés generally run longer, roughly 8am-midnight.",
  website: "https://souqwaqif.qa/",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    address: "Al Jasrah, Doha, Qatar (between Al Asmakh and Al Ahmed streets)",
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced vague practicalInfo.hours with real, cross-checked shop/restaurant hours; added website (souqwaqif.qa) and address (Al Jasrah district, between Al Asmakh and Al Ahmed streets) per founder instruction. Sources: marhaba.qa, lonelyplanet.com, qatarliving.com, globalgritandglam.com, en.wikipedia.org.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
