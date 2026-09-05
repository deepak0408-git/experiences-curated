import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "boulogne-billancourt-short-let-budget-stay";

const bodyContent = `Below Roland-Garros's small handful of hotels sits a genuinely useful option most first-time visitors don't think to check: short-let apartments and Airbnbs across Boulogne-Billancourt, the district directly across the Seine from the stadium's western edge. It's a legitimate Paris suburb rather than a compromise location — bakeries, butchers, produce stalls, restaurants and cafés line the streets, and locals describe it as safe enough to walk around alone without a second thought.

The practical case is straightforward: Billancourt Métro station on Line 9 sits close to much of the district's accommodation, and from there it's a short, direct ride toward Porte d'Auteuil, the stop nearest the stadium. Real listings in the area run roughly $114-193 a night on Airbnb, well under hotel rates for anything within genuine walking distance of Roland-Garros, and several are explicitly marketed toward tournament visitors, some naming Roland-Garros directly in the listing title.

The tradeoff, and it's worth being honest about it, is distance from central Paris. Getting from Boulogne-Billancourt to the Louvre or the Eiffel Tower runs about 30 minutes by Métro each way. For a trip built primarily around the tennis, with sightseeing folded in around match days rather than the other way round, that's a reasonable trade for meaningfully lower nightly rates. For a trip weighted more heavily toward general Paris tourism, it's worth factoring the extra travel time into each day's plan.

There's no dedicated hostel cluster in Boulogne-Billancourt the way there is in central Paris neighborhoods like Montmartre — this area's budget option is specifically the short-let apartment market, not a hostel scene, so search Airbnb and similar platforms directly rather than hostel-specific booking sites.`;

const whyItsSpecial = `Every Grand Slam city has a version of this trade: pay more to sleep closer to the venue, or pay less and accept a longer commute. Boulogne-Billancourt is Roland-Garros's version of that trade done well — genuinely cheaper, genuinely safe, and genuinely close enough (Line 9, one direct connection) that the commute isn't the ordeal it sounds like on paper.

What makes it worth recommending specifically, rather than just "somewhere cheap on the Métro line," is that it's a real, functioning Parisian neighborhood rather than an anonymous commuter district. The bakeries and markets aren't there for tourists; they're there because people actually live and shop in Boulogne-Billancourt, which means a budget stay here still comes with a genuine slice of how Parisians actually live day to day — a different, more grounded texture than a hostel bunk bed in the most touristed part of the city.`;

const insiderTips = [
  "Search directly for listings naming 'Roland Garros' in the title — several hosts in Boulogne-Billancourt explicitly market to tournament visitors and list walk times to the stadium, making comparison shopping for proximity straightforward.",
  "Confirm which Métro station a listing is actually nearest to before booking — Boulogne-Billancourt is a genuinely large district, and 'near the Métro' can mean anywhere from a 3-minute to a 20-minute walk depending on exactly where the apartment sits.",
];

const whatToAvoid = `Don't book a short-let here expecting the same walkability to central Paris landmarks as a stay in the 16th arrondissement proper — the roughly 30-minute Métro ride each way to the Louvre or Eiffel Tower adds up across a multi-day trip, and it's a real cost worth weighing against the money saved on the room itself. And don't assume every listing in the district is genuinely close to the stadium just because "Boulogne-Billancourt" appears in the address — the district is large enough that some listings sit considerably further from Roland-Garros than others; check the specific walk or transit time to the stadium for each listing individually rather than trusting the neighborhood name alone.`;

const practicalInfo = {
  address: "Boulogne-Billancourt, France",
  website: "https://www.airbnb.com/boulogne-billancourt-france/stays",
  hours: "N/A — short-let apartment, standard check-in/out per individual listing",
  costRange: "Approx. $114-193/night for listings within realistic walking or short-Métro distance of the stadium",
  bookingMethod: "Search directly on Airbnb or similar short-let platforms for Boulogne-Billancourt listings — several explicitly reference Roland-Garros proximity.",
  reservationsRequired: true,
};

const gettingThere = `Billancourt Métro station (Line 9) sits within Boulogne-Billancourt and connects directly toward Porte d'Auteuil, the closest stop to Stade Roland-Garros — a short, single-line ride for most listings in the district.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Boulogne-Billancourt — Short-Let & Budget Stay",
      subtitle: "A real Paris neighborhood, one Métro line from the stadium, well under hotel rates",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Boulogne-Billancourt",
      address: "Boulogne-Billancourt, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "District safety/character and Métro proximity from Tripadvisor 'Boulogne-Billancourt good area for tourist stay?' forum thread and general Boulogne-Billancourt overview searches. Pricing ($114-193/night) from real Airbnb listing search results specifically naming Roland-Garros proximity. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["authentic", "practical", "budget-friendly"],
      interestCategories: ["accommodation"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      budgetMinCost: "114",
      budgetMaxCost: "193",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
