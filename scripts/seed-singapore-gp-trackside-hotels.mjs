import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-trackside-hotels-" + Date.now().toString(36);

const bodyContent = `Three hotels put you close enough to Marina Bay Street Circuit that the race weekend genuinely reaches into your room, not just your itinerary.

The Ritz-Carlton, Millenia Singapore rates highest of the three on Booking.com, 9.2 out of 5,900-plus verified reviews, and the reason shows up in the room design: oversized windows built specifically to frame both the skyline and portions of the F1 track, so several room categories double as a private grandstand. Guests consistently flag the Club Lounge, the daily breakfast, and staff who go out of their way, not just a nice view.

Pan Pacific Singapore sits close behind at 9.1 from over 4,700 reviews, and offers the same trackside idea, many rooms face the circuit and the bay, at what reviewers and rate-comparison sites describe as a genuinely more accessible price than the other two. It connects directly to Marina Square, useful for a fast retreat from the heat or a rain delay without crossing open ground, and its EDGE breakfast buffet gets specific, repeated praise.

Swissotel The Stamford rates 8.8 from over 4,400 reviews, the lowest of the three but still comfortably excellent, and it wins on pure logistics: it sits directly above City Hall MRT station, one of Southeast Asia's tallest hotels, with upper-floor rooms overlooking the circuit and the city. Higher-floor guests get access to the 65th-floor lounge with food and wine included in the rate, a genuine value add at this price tier.

All three put you within a short walk of the circuit itself, so the real choice between them comes down to view design (Ritz-Carlton), value within the luxury tier (Pan Pacific), or transit convenience (Swissotel), not meaningfully different quality.`;

const whyItsSpecial = `A hotel room that faces the actual circuit isn't a gimmick at Singapore specifically, because this is F1's only night race and the floodlit track is genuinely visible, and photographable, from the right room. All three of these hotels are excellent by any normal measure, but they're not identical: Ritz-Carlton built its rooms around the view, Pan Pacific undercuts both on price without giving up much, and Swissotel trades a slightly lower rating for a transit connection that matters when race-night crowds make every other route home slower than usual. I'd pick based on which of those three things matters most to you, not on chasing the highest number.`;

const insiderTips = [
  "Ask specifically for a track-facing or bay-facing room category when booking any of the three — the panoramic circuit view is tied to specific room categories, not guaranteed hotel-wide.",
  "Swissotel's direct MRT connection at City Hall is a genuine advantage on race nights specifically, when street-level crowds around Marina Bay slow every other route back to a hotel.",
];

const whatToAvoid = `Don't book any of these three assuming a circuit view is automatic — it's tied to specific floors and room categories at all three hotels, and race-week rates climb fast, so confirm the exact room type before paying a premium for a view you might not get.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out; race-week rates and minimum-night stays typically apply Oct 2026",
  costRange: "Luxury tier, race-week rates significantly above standard — Pan Pacific positioned as the relative value option of the three",
  bookingMethod: "Book directly via each hotel's own site or Booking.com well ahead of October — race-week inventory at all three sells out and prices rise sharply closer to the date.",
  howToBook: "",
  website: "https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.html, https://www.booking.com/hotel/sg/panpacificsingapore.html, https://www.booking.com/hotel/sg/swissotelsingapore.html",
  reservationsRequired: true,
};

const gettingThere = "All three sit within a 5-15 minute walk of the Marina Bay Street Circuit. Swissotel The Stamford sits directly above City Hall MRT station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to stay trackside — Marina Bay's big three",
      subtitle: "Ritz-Carlton, Pan Pacific, or Swissotel — real Booking.com ratings and what each actually trades off",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Marina Bay, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Ratings sourced directly from Booking.com (Ritz-Carlton Millenia 9.2/1959 reviews, Pan Pacific 9.1/4767 reviews, Swissotel The Stamford 8.8/4445 reviews), single consistent scale. Cross-referenced against enyatravel.com for circuit-view room details. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["luxury", "trackside"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "perennial",
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
