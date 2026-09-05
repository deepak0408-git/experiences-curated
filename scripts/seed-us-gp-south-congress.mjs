import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-south-congress-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `South Congress Avenue — SoCo to everyone who actually lives here — wasn't always the postcard version of Austin it's become. Through the 1970s and 80s this stretch was rougher, home to pawn shops and cheap motels more than boutiques. The turn started in the late 1990s when artists priced out of downtown moved south, and three decades on it's arguably Austin's most photographed street, walkable enough that you genuinely don't need a car once you're on it.

Two stops here function as the strip's unofficial landmarks. Allens Boots, open since 1977, is instantly recognizable by the oversized red boot mounted above its entrance and a gold neon marquee — a genuine Austin institution for actual cowboy boots, not a tourist prop, though it photographs like one. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10758570619703789610&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). A few doors down, Jo's Coffee carries the "I love you so much" mural on its outer wall, one of the most photographed single spots in the entire city and the reason a lot of visitors' Instagram feed from Austin looks the way it does. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=462561016830669691&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

Beyond the two headline stops, SoCo runs a genuine mix of vintage shops, art galleries, and quirky boutiques — Monkey See Monkey Do for offbeat gifts, Uncommon Objects for eclectic antiques, and more murals tucked into side alleys than most visitors have time to find in one visit. It's a street built for wandering rather than a checklist, which is unusual for a strip this well-known.

Worth knowing precisely: SoCo runs a "First Thursday" event each month, where shops stay open until 10pm (later in some cases), the street fills with pop-up vendors and food trucks, and live music plays at every corner — a real, genuine block-party atmosphere. October 2026's First Thursday falls on 1 October, three weeks before the 23-25 October race weekend, so don't plan your F1 trip around catching it — it won't overlap. SoCo is a great daytime or evening stop regardless, just without that specific monthly event layered in.`;

const whyItsSpecial = `Most of what draws visitors to a Grand Prix weekend is built around the racing itself — grandstands, hospitality, the circuit. South Congress is the clearest single place to actually feel Austin's own identity outside of that, a street with a real transformation story and two landmarks (the boot, the mural) that exist independent of any tourist infrastructure built around them. It's the difference between visiting a city that happens to host a race and actually spending time in a place with its own history and character. For a first-time Austin visitor, SoCo is close to the most efficient single stop for understanding what the city is actually like when it's not hosting 400,000 F1 fans.`;

const insiderTips = [
  "Jo's Coffee's mural wall gets genuinely busy for photos — early morning or later evening avoids the worst of the midday queue if you want a clean shot without other tourists in frame.",
  "SoCo runs roughly 15-20 blocks — if your time is limited, the highest-density stretch of shops, murals, and food sits between Elizabeth St and Academy Dr, not the full length of the avenue.",
];

const whatToAvoid = `Don't plan your race-weekend trip around catching SoCo's First Thursday event — October 2026's falls on the 1st, three weeks before the 23-25 October race weekend, so it won't overlap no matter how you schedule your days. Don't treat SoCo as a quick 20-minute photo stop just for Allens Boots and Jo's Coffee — the real value is in the side streets and alleys most visitors skip entirely, and rushing through misses most of what actually makes the strip distinctive.`;

const gettingThere = `A short rideshare or drive from downtown Austin, across the South First St / South Congress bridge over Lady Bird Lake; genuinely walkable once you're on the strip itself.`;

const practicalInfo = {
  hours: "Most shops run standard daytime-into-evening hours; First Thursday (monthly, next occurring 1 October 2026 — before race weekend) runs shops until 10pm with extra vendors and live music",
  costRange: "Free to walk; individual shop/restaurant prices vary",
  bookingMethod: "No booking needed — SoCo is a public street, free to walk and browse. Individual shops and restaurants keep their own hours.",
  website: "https://www.southcongressavenue.com",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "South Congress — Boots, Murals, and Austin's Own Style",
      subtitle: "The strip that turned from pawn shops to Austin's most photographed street in one generation",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "South Congress (SoCo)",
      address: "South Congress Avenue, Austin, TX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: thelinehotel.com Austin Insider's Guide to Shopping in South Congress, enchantingtexas.com Ultimate Guide to South Congress (1970s-80s decline, late-1990s artist-led revitalization, Allens Boots 1977 opening), nowplayingaustin.com First Thursday Congress Avenue (monthly event format, extended hours, vendors, live music). October 2026 First Thursday date (1 Oct) calculated directly and confirmed NOT to overlap the 23-25 Oct race weekend — an honest, useful clarification rather than implying false overlap. MULTI-VENUE (2 named venues: Allens Boots, Jo's Coffee) — requires MULTI_VENUE_RATINGS['us-gp-south-congress'] entry with venueCount: 2, added in this same session. Both ratings real, individual Google Places lookups (Allens Boots 4.6/2,186, Jo's Coffee 4.4/1,987). No Concierge trigger, no affiliate opportunity. Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["culture", "shopping", "photo-op"],
      interestCategories: ["culture"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
