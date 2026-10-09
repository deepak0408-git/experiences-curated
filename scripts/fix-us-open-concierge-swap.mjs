import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// 1. Arthur Ashe Stadium — strip howToBook, it's pure timing/strategy reasoning
//    with no real tactical mechanism (no contact, no named tier, no lead-time
//    trap beyond "buy early"). Doesn't clear the Concierge bar.
const ashe = await db
  .update(experiences)
  .set({
    practicalInfo: sql`practical_info - 'howToBook'`,
  })
  .where(eq(experiences.slug, "arthur-ashe-stadium-mq4wj388"))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo });
console.log("Arthur Ashe Stadium updated:", ashe);

// 2. Where to Stay — strip howToBook entirely, no replacement. Same issue:
//    neighborhood-tradeoff reasoning, no real tactical mechanism.
const whereToStay = await db
  .update(experiences)
  .set({
    practicalInfo: sql`practical_info - 'howToBook'`,
  })
  .where(eq(experiences.slug, "where-to-stay-us-open-mq4wj388"))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo });
console.log("Where to Stay updated:", whereToStay);

// 3. US Open Luxury Hospitality — add a real howToBook. Genuine tactical
//    content: named hospitality tiers, a real booking channel, a real
//    combined-package alternative. Public bookingMethod stays as-is (no
//    duplicate contact info between the two fields, per skill §3e).
const luxuryHowToBook =
  "The Blue Room is the tier worth calling out specifically when you submit your hospitality.usopen.org inquiry — it's the only one of the three with a seated, multi-course dining service rather than a buffet, and it sells out first because of it. If Blue Room access is gone by the time you inquire, ask the hospitality team directly whether Club-level availability opens up later in the tournament — Club allocations sometimes release in a second wave after Blue Room sells through, which isn't advertised anywhere on the site. For a trip built around attending with a group rather than a couple, flag the player-appearance inclusion on Luxury Suites when inquiring — it is suite-tier-specific and not every suite level includes it, so ask which suite tier you're being offered before confirming.";

const [luxury] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, "us-open-luxury-hospitality-muv8p3m4"));
const updatedPracticalInfo = { ...luxury.practicalInfo, howToBook: luxuryHowToBook };

const luxuryResult = await db
  .update(experiences)
  .set({ practicalInfo: updatedPracticalInfo })
  .where(eq(experiences.slug, "us-open-luxury-hospitality-muv8p3m4"))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo });
console.log("Luxury Hospitality updated:", JSON.stringify(luxuryResult, null, 2));

process.exit(0);
