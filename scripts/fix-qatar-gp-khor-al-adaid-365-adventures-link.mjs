// Qatar GP 2026 — fix qatar-gp-khor-al-adaid-mtyn3hq9: hyperlink "365
// Adventures" in bodyContent to https://365adventures.me/, per founder
// instruction 14 Sep 2026. Uses the same markdown link syntax the
// experience page's renderInline already supports (used elsewhere for the
// "[See live rating...]" Google Maps links).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-khor-al-adaid-mtyn3hq9";

const bodyContent = `Khor Al Adaid, the Inland Sea, sits roughly 80km southeast of Doha, at the point where the Arabian Gulf pushes directly into the desert — one of very few places on the planet where open sea and sand dunes meet with no coastline between them. It's a UNESCO-recognized natural reserve with a genuine ecosystem of its own, not just a scenic sand-and-water photo stop.

Getting there is most of the experience. Guided tours run 4-8 hours door-to-door with hotel pickup from Doha, covering dune bashing in a 4x4 across the rolling desert terrain before reaching the Inland Sea itself, where operators typically add camel rides, sandboarding, or ATV/quad biking, then a stop at a desert camp for tea, coffee, or a full meal depending on the tour length. Shared group tours run roughly $40-80 per person; private tours land higher, generally $150-300.

[365 Adventures](https://365adventures.me/) is one of the better-reviewed operators running these trips. November through March is the best window to visit, both for milder temperatures during the drive and dune activities, and for late-afternoon light at the Inland Sea itself, which regularly produces the best photography of the trip — timing that lines up well with a late-November race weekend.`;

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    bodyContent,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: hyperlinked '365 Adventures' in bodyContent to https://365adventures.me/ per founder instruction.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
