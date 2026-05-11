import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/black-lamb-wimbledon.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: readFileSync("Images/black-lamb-wimbledon.jpg"),
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded");

// ─── 2. Look up Wimbledon 2026 event ID ──────────────────────────────────────

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

if (!event) { console.error("Wimbledon 2026 not found"); process.exit(1); }

// ─── 3. Seed experience ───────────────────────────────────────────────────────

const slug = "dinner-at-the-black-lamb-" + Date.now().toString(36);

await db.insert(experiences).values({
  slug,
  destinationId: "75758888-28b9-4e09-82ba-f05681ecc904",
  sportingEventId: event.id,
  title: "Dinner at The Black Lamb",
  subtitle: "The Gladwin Brothers' Wimbledon Village restaurant — seasonal British, English wines from their own vineyard",
  heroImageUrl,
  heroImageCredit: "Sarda Bamberg / Pexels",
  experienceType: "dining",
  budgetTier: "splurge",
  availability: "event_adjacent",
  curationTier: "editorial",
  status: "in_review",
  neighborhood: "Wimbledon Village",
  moodTags: ["relaxed", "considered", "local", "celebratory"],
  interestCategories: ["dining", "British cuisine", "wine", "seasonal"],
  lastVerifiedDate: "2026-04-28",
  editorialNote: "Gladwin Brothers restaurant on the Village High Street. Verified open April 2026. Wimbledon Season Set Menu runs exact tournament dates. English wines from family's Nutbourne vineyard. Book 2 weeks ahead for evenings.",
  specScoreSpecificity: 5,
  specScoreProvenance: 4,
  specScoreExceptionalism: 4,
  specScoreCurrency: 5,

  bodyContent: `The Gladwin Brothers have been running restaurants since 2012, and The Black Lamb — on Wimbledon Village High Street — is the one with the most straightforward editorial story. The family grows wine on their own estate at Nutbourne in West Sussex. Oliver Gladwin runs the kitchen. The menu follows what's in season, leans on wild game and sustainably sourced seafood, and uses produce from growers the kitchen actually knows.

The cooking philosophy is "what grows together, goes together" — which sounds like a tagline but is, in practice, what the menu looks like: British ingredients put together in combinations that make sense seasonally rather than commercially. The set menu changes. The wine list is almost entirely English, led by Nutbourne bottles but extended by the "Little Black Book" — rare one-off vintages and bin-ends that come and go.

**Wimbledon Season Set Menu**

During the tournament fortnight (29 June to 12 July 2026), the restaurant runs a dedicated 4-course season set menu. It's priced at £48 per person. Add the wine pairing — English wines, from £38 — and a full evening runs to around £85-90 a head. Table times from 7pm are two hours; earlier sittings (before 6:45pm) are 90 minutes.

This is the right choice for the dinner that marks the week: substantial enough to be the occasion, built around the tournament dates, and not trying to be a tasting menu restaurant when a confident set menu does the job better.

**The wine**

Nutbourne Vineyard has been producing English wine in West Sussex since the 1980s. The winery has won awards across multiple vintages, and the selection at The Black Lamb skews toward their whites and sparkling — the Sussex climate suits both. The Little Black Book occasionally surfaces older vintages from the estate that aren't available anywhere else.

**Getting here**

67 High Street, SW19 5EE — on the Village High Street, a 15-minute walk from the All England Club through the Village, or a short taxi. The restaurant is closed Mondays. Tuesday evenings only until 10pm. Wednesday through Friday it opens for lunch and dinner. Saturday and Sunday from 11:30am.

**Booking**

During the tournament, book at least two weeks ahead for evening sittings. Groups of seven or more need to call (020 8947 8278) rather than booking online. Wednesday evenings have live jazz from 7pm — worth knowing when you're choosing a night.

**One detail worth noting:** well-behaved dogs are welcome in the front dining area, which tells you something about the atmosphere the restaurant is aiming for.`,

  whyItsSpecial: `The Gladwin Brothers have something most London restaurants don't: an actual agricultural backstory. The vineyard at Nutbourne isn't a branding decision — it's where the family grew up, and it supplies the wine list. That thread runs through the whole restaurant: the sourcing relationships are real, the seasonal menu reflects what's actually available rather than what tests well year-round, and the food has a specificity that comes from a kitchen with clear convictions about where its ingredients should come from.

During Wimbledon, the season set menu is the detail that sets this apart from other Village options. Most restaurants near a major sporting event adjust pricing upward and call it a day. The Black Lamb runs a dedicated tournament menu at a fixed price for exactly the fortnight. That's a different attitude toward the event: treating it as a reason to do something considered rather than an opportunity to charge more.

The combination — wild British produce, English wines from a family estate, a set menu timed to the tournament — makes for a dinner that's specific to this part of the world in a way that's hard to manufacture. It's the right occasion meal for the end of a good week at Wimbledon.`,
});

console.log("✓ Seeded: Dinner at The Black Lamb");
await client.end();
