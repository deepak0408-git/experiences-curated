import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "55f26c1e-adb3-46ba-aaf7-997585ed25a5"; // Sydney
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "where-to-stay-sydney-fourth-test-" + Date.now().toString(36);

const bodyContent = `The Fourth Test at the SCG splits Sydney's accommodation into the same choice you get in Perth and Melbourne: walk to the ground, or base yourself somewhere with more to do and take the light rail. Sydney's version of that choice is sharper than the others, because the SCG sits in Moore Park, genuinely outside the CBD, with Paddington right beside it.

Mrs Banks Hotel is the walk-to-the-ground pick. It occupies a converted 1914 bank building on Oxford Street in Paddington, five minutes on foot from the SCG, and it's a proper boutique stay rather than a budget crash pad — heritage details, a small but well-reviewed room count, and Paddington's own café and gallery strip on the doorstep. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10734942912477825681&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

QT Sydney is the CBD pick. It sits on the corner of George and Market Streets, in the middle of everything — Pitt Street Mall, Hyde Park, a ten-minute walk to Circular Quay — and Town Hall light rail stop is four minutes from the door. From there, the L2 and L3 lines run straight through Central and Surry Hills to Moore Park, the same route whether you're staying five minutes or twenty-five from the ground. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=7068420665417371203&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

That light rail line is really the whole story. The SCG has no train station of its own — Moore Park light rail stop is the direct way in, on foot from the platform in a few minutes, and it runs from Circular Quay through the CBD and Surry Hills before splitting off toward Randwick and Kingsford. Staying at QT Sydney costs you roughly fifteen extra minutes each way compared to Mrs Banks, in exchange for being inside the actual city rather than a residential-feeling pocket of Paddington. Early January in Sydney also means the Fourth Test overlaps with peak summer tourist season and school holidays, so book whichever side of this you land on well ahead — both fill up for the Test week specifically, not just generally.`;

const whyItsSpecial = `Every other Test venue on this tour puts the stadium roughly in or right next to its city. Sydney doesn't. The SCG sits in Moore Park, a genuinely separate precinct from the CBD, with Paddington's residential streets backing directly onto it — so the "stay close or stay central" choice here is real geography, not marketing. Mrs Banks earns its place because it's not just near the ground, it's a good hotel in its own right, a converted heritage bank with a 4.8 Google rating that would hold up anywhere in the city. QT Sydney earns its place because the light rail genuinely closes the distance — you're not choosing between convenience and everything else Sydney offers, you're choosing how many minutes of light rail you're willing to spend for it. January in Sydney is also just a different city than the other three legs of this tour: harbour, beaches, humidity, storms that roll in fast. Where you stay changes how much of that you actually get to use.`;

const insiderTips = [
  "The SCG has no train station of its own — Moore Park light rail stop (L2/L3) is the direct route in from both the CBD and Surry Hills, and it's a short walk from the platform to the gates, not a shuttle or transfer.",
  "January in Sydney runs into peak summer tourism and school holidays, which push both Paddington and CBD hotel rates up well before the Test itself is the driving factor — book earlier than you would for a shoulder-season trip.",
];

const whatToAvoid = "Don't book a Paddington stay assuming every street in the area is a five-minute walk from the SCG — the precinct is larger than the ground itself, and some Paddington addresses on Oxford Street's western end are closer to a 20-25 minute walk, not five. Don't rely on rideshare as your main plan for getting to or from the ground on match days — Moore Park's roads get heavily congested around session breaks and the close of play, and the light rail is genuinely faster than a car for most of the CBD and Surry Hills.";

const practicalInfo = {
  hours: "Check-in/check-out varies by hotel — both properties offer late checkout on request, subject to availability",
  costRange: "Mrs Banks Hotel from roughly AU$180-270/night; QT Sydney from roughly AU$240-320/night — both rise during the Fourth Test window and over the January school holiday period",
  bookingMethod: "Book directly via mrsbankshotel.com.au for Mrs Banks Hotel, or qthotels.com/sydney-cbd for QT Sydney — both also list on major booking platforms.",
  howToBook: "",
  website: "https://mrsbankshotel.com.au, https://www.qthotels.com/sydney-cbd/",
  reservationsRequired: true,
};

const gettingThere = "Moore Park light rail stop (L2 Randwick line / L3 Kingsford line) is the direct route to the SCG from both hotels — a short walk from Mrs Banks in Paddington, or roughly a 15-20 minute ride from Town Hall stop near QT Sydney, four minutes' walk from the hotel.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Sydney for the Fourth Test",
      subtitle: "Walk to the SCG from Paddington, or take the light rail from the CBD — Sydney's real tradeoff",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Paddington / Sydney CBD",
      address: null,
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: mrsbankshotel.com.au (address, 5-min SCG walk claim), tripadvisor.com and booking.com (Mrs Banks guest sentiment), qthotels.com/sydney-cbd and mrandmrssmith.com (QT Sydney location, TripAdvisor #10/196 4.0/5, Booking.com 8.9 'Very Good' from 2,770 reviews), transportnsw.info and nswtrains.fandom.com (Moore Park light rail L2/L3 confirmed as the direct SCG route, Town Hall stop 4 min walk from QT Sydney). Google Places API lookups: Mrs Banks Hotel (4.8/174 reviews) and QT Sydney (4.6/2,117 reviews), captured 16 Aug 2026 — both real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-hotel rating links written inline in bodyContent per skill §2c. Prices indicative from general search, not vendor-confirmed live rates.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["comfort", "convenience", "boutique"],
      interestCategories: ["sport", "accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 14 })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
