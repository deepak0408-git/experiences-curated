// Qatar GP 2026 — fix qatar-gp-khor-al-adaid-mtyn3hq9: googleMapsUrl was
// pointing to the wrong Google listing (a cid= link that didn't resolve to
// the correct place). Founder provided the correct link directly
// (https://maps.app.goo.gl/QRnu8WdCkkaTz61K9) 14 Sep 2026 — updating
// googleMapsUrl to that exact URL, per explicit instruction (not a fresh
// Places API lookup, since the founder identified the correct link
// themselves).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-khor-al-adaid-mtyn3hq9";

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    googleMapsUrl: "https://maps.app.goo.gl/QRnu8WdCkkaTz61K9",
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: googleMapsUrl was pointing to the wrong listing — replaced with the correct link provided directly by founder (https://maps.app.goo.gl/QRnu8WdCkkaTz61K9).",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
