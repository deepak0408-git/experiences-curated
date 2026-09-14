// Qatar GP 2026 — fix qatar-gp-souq-waqif-mtyn629z whatToAvoid.
// Avoid 1 ("Don't assume the buildings are original historic structures...")
// restated bodyContent's own first-paragraph line almost verbatim ("It's a
// modern building with heritage as its actual design brief, not a preserved
// original — worth knowing before assuming everything here is centuries
// old"). Fails the hard bar (avoid must not restate anything said elsewhere
// in the experience). Founder flagged 14 Sep 2026, asked for a replacement.
// Avoid 2 (Falcon Souq etiquette) is genuinely distinct and untouched.
//
// Replacement: many small stalls in the souq's alleys are cash-only — a
// real, practical, nowhere-else-mentioned fact distinct from anything in
// bodyContent, insiderTips, or whyItsSpecial (none of which mention payment
// methods or shopping/bargaining logistics at all).
// Source: travelnoire.com (Tips For Shopping At Souq Waqif).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-souq-waqif-mtyn629z";

const whatToAvoid = `Don't assume every stall takes cards — many of the smaller shops and market vendors in the souq's alleys are cash-only, so carry Qatari riyals if you're planning to actually buy spices, textiles, or souvenirs rather than just browse. Don't treat the Falcon Souq as a casual photo-op without checking etiquette first — live birds and working falconers are present, and this is a genuine trade district, not a staged display built for tourists.`;

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
      " 14 Sep 2026: replaced whatToAvoid #1 (restated bodyContent's rebuilt-not-original fact almost verbatim) with a genuinely new practical fact — many souq stalls are cash-only, per travelnoire.com. Avoid #2 (Falcon Souq etiquette) kept unchanged, already distinct.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
