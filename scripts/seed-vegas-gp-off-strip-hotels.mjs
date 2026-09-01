import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-off-strip-hotels-" + Date.now().toString(36);

const bodyContent = `Track-view rooms at Bellagio, Aria, and Paris Las Vegas book out months ahead and carry a genuine premium once they do. Two off-Strip options give you real value without sacrificing an easy ride into race weekend.

Virgin Hotels Las Vegas sits off the Strip proper, but it's not a compromise pick — it's F1's own official rideshare pickup and drop-off point closest to the start/finish straight and the East Harmon Zone. That's a genuinely useful, circuit-specific reason to stay here beyond general proximity: race organizers have built their own transit plan around this hotel's location. It's a mid-range, boutique-style property with a real identity of its own, distinct from the mega-resort feel of the Strip's biggest names. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11938988787657779660)

Circa Resort & Casino sits downtown on the Fremont Street Experience, roughly a 10-minute drive or an hour's walk from the Strip. It's an adults-only property with genuine standout amenities: a six-tiered pool deck, a three-story sportsbook, and Stadium Swim, a screen-and-speaker setup built specifically for watching sports poolside — including, on race weekend, the Grand Prix itself, without needing a track ticket at all. Downtown pricing runs meaningfully below Strip rates even during race weekend, and the Monorail running 24/7 during race week means the trip in isn't the ordeal distance alone might suggest. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=6006901985708148596)

Both trade a few minutes of travel time for real savings and, in Circa's case, an entirely different way to experience race weekend that doesn't require a circuit ticket at all.`;

const whyItsSpecial = `Staying off the Strip during a Las Vegas Grand Prix sounds like settling, until you look at what these two properties actually offer instead of proximity. Virgin Hotels is where F1 itself tells its rideshare users to go — that's not a compromise, that's the organizers pointing at the smart move. Circa flips the entire premise of race weekend on its head: instead of paying a premium to be near the track, you're paying downtown rates to watch the race from a pool deck built for exactly that. I'd recommend either one without hesitation to a traveler who wants real value and doesn't need to say they slept fifty feet from Turn 14.`;

const insiderTips = [
  "Virgin Hotels Las Vegas is one of only two official F1 rideshare pickup/drop-off points on the entire circuit — booking here removes a genuine logistics headache other off-Strip hotels don't solve, not just a marginal location perk.",
  "Circa's Stadium Swim shows the race live on its poolside screens during race weekend — a real, ticket-free way to watch the Grand Prix that most visitors never think to ask about when comparing off-Strip hotels purely on price.",
];

const whatToAvoid = `Don't assume "off-Strip" automatically means a longer or harder trip to the circuit — Virgin Hotels is functionally closer to race-day logistics than plenty of Strip hotels that sit far from the East Harmon or Koval zone entrances, because it's built into F1's own transit plan. Don't book Circa expecting a family-friendly stay — it's an adults-only property, and travelers assuming otherwise based on downtown's reputation for value have been caught out by that detail before.`;

const practicalInfo = {
  hours: "Standard hotel check-in 3-4pm, check-out 11am-12pm at both properties — confirm exact times with your specific booking",
  costRange: "Circa downtown rooms typically run well below Strip rates even during race weekend (roughly US$200-300/night versus Strip premiums 2-3x higher); Virgin Hotels sits at mid-range Strip-adjacent pricing",
  bookingMethod: "Book directly via circalasvegas.com or virginhotelslv.com, or through Booking.com/Expedia for either property. Circa's downtown rooms and Virgin Hotels' rooms both move fast once race-weekend dates are confirmed — book earlier than you would for a non-race-weekend Vegas trip.",
  howToBook: "",
  website: "https://www.circalasvegas.com, https://virginhotelslv.com",
  reservationsRequired: true,
};

const gettingThere = "Virgin Hotels: off the Strip near Hughes Center, official F1 rideshare pickup point for East Harmon Zone. Circa: downtown on Fremont Street, roughly 10 minutes by car or an hour on foot to the Strip circuit — the 24/7 Monorail during race week is the practical way in.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Staying Off-Strip — Value Bases With an Easy Ride In",
      subtitle: "Virgin Hotels Las Vegas and Circa Resort — real savings without sacrificing race-weekend logistics",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Off-Strip / Downtown",
      address: "4455 Paradise Rd (Virgin Hotels), 8 Fremont St (Circa), Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from gpdestinations.com 'where to stay' guide, reviewjournal.com 2026 hotel rate coverage, and circalasvegas.com official Stadium Swim/amenities page. Google ratings via Places API (New) direct lookup 29 Aug 2026: Virgin Hotels Las Vegas 4.2/9,797 reviews, Circa Resort & Casino 4.5/13,406 reviews — both well-attested. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 2).",
      sport: ["formula_one"],
      moodTags: ["value"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
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
