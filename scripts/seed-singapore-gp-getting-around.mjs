import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-getting-around-" + Date.now().toString(36);

const bodyContent = `Singapore's MRT is the backbone of race weekend, and the system genuinely adapts for it: train service is extended to 1am on Grand Prix weekend, well past normal closing, so getting back from a Sunday night session or a Lana Del Rey set doesn't mean racing the last train.

For payment, three real options. The Singapore Tourist Pass gives unlimited travel on basic buses, MRT, and LRT: $17 for 1 day, $24 for 2, $29 for 3, up to $45 for 5 days, worth it if you're making frequent trips across the weekend. A Charm version (a round Mr. Merlion card) costs slightly more, $22 for 1 day or $34 for 3. Alternatively, a standard EZ-Link or NETS FlashPay card costs S$10 total (S$5 non-refundable card fee, S$5 starting credit) and works like a regular tap card, better value if you're not maximising trip count. Contactless bank cards also tap directly onto readers if you'd rather skip a physical transit card entirely.

Multiple stations serve the circuit depending on your grandstand or zone: Promenade, City Hall, Raffles Place, and Esplanade all put you within a reasonable walk of different sections. If MRT stations are overcrowded at peak race-weekend times, which does happen, buses 106, 107, 133, 57, and 574 all serve the Marina Bay area as real alternatives, not just a theoretical backup.

The F1 Singapore app is also worth downloading before you arrive, useful beyond just tickets for checking which viewing platforms have big screens in sightline and for real-time event information across the weekend.`;

const whyItsSpecial = `A lot of race weekends leave you guessing how transit actually holds up under crowd pressure. Singapore is explicit about it: MRT hours are extended specifically for the event, and named bus routes exist as a real fallback, not an afterthought. That kind of transparency is rare, and it means the honest answer to "how do I get around" doesn't require guesswork or local knowledge, it's published and reliable. I'd rather hand over the real, specific routes and numbers than a vague "the MRT is good" and leave you finding this out at 1am on a crowded platform.`;

const insiderTips = [
  "Buy a Singapore Tourist Pass only if you're making 10+ trips across your stay, at $29 for 3 days it pays for itself past that point; below it, a standard EZ-Link card (S$10 total) is the better value.",
  "Know your backup bus routes (106, 107, 133, 57, 574) before race night, not after, MRT crowding at Promenade and City Hall stations is a real, predictable pattern post-session.",
];

const whatToAvoid = `Don't assume normal MRT closing times apply on race weekend, they're extended to 1am specifically for this event, but don't assume that means unlimited flexibility either, plan your last connection rather than relying on the extension as a safety net if you're staying somewhere the MRT doesn't directly serve.`;

const practicalInfo = {
  hours: "MRT extended to 1am on Grand Prix weekend (normal hours otherwise apply outside race days)",
  costRange: "Singapore Tourist Pass: $17 (1-day) to $45 (5-day); EZ-Link/NETS FlashPay: S$10 total (S$5 card + S$5 credit)",
  bookingMethod: "Buy tourist passes at Changi Airport or major MRT stations; EZ-Link/NETS cards available at any MRT station or convenience store.",
  howToBook: "",
  website: "https://thesingaporetouristpass.com.sg/type-of-passes/, https://ezlink.simplygo.com.sg/card-charm/for-tourists/",
  reservationsRequired: false,
};

const gettingThere = "Circuit-adjacent stations: Promenade, City Hall, Raffles Place, Esplanade. Backup bus routes: 106, 107, 133, 57, 574.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting around race weekend — MRT, passes, buses",
      subtitle: "Extended 1am trains, real pass pricing, and named backup bus routes for when the platforms fill up",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "MRT extended hours and bus routes sourced from blog.sgtrains.com and travelthru.com. Tourist Pass pricing confirmed via official thesingaporetouristpass.com.sg. EZ-Link pricing via ezlink.simplygo.com.sg. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "logistics"],
      interestCategories: ["transit"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
