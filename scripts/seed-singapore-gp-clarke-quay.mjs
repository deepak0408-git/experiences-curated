import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-clarke-quay-stay-" + Date.now().toString(36);

const bodyContent = `Clarke Quay is a five-block stretch of restored colonial-era warehouses along a bend in the Singapore River, painted in pastel colours and lit up after dark, and it's Singapore's busiest riverside entertainment district. Shophouses turned bars, clubs, and restaurants line both riverbanks, and on any given night the crowds and live music make it feel closer to a festival street than a hotel neighbourhood, which is exactly why it works so well for race weekend.

The area sits within walking distance of Marina Bay Street Circuit, and Clarke Quay MRT Station (North East Line) connects you back into the wider city fast if you'd rather not walk after a late Padang Stage set. Holiday Inn Express Singapore Clarke Quay, rated 8.5 out of 10 on Booking.com from nearly 3,900 reviews and holding Booking's Guests' Choice award, is the standout mid-range pick here, close to the river, close to the nightlife, and considerably cheaper than the trackside luxury hotels without sacrificing a real, well-reviewed stay.

What Clarke Quay actually trades for the circuit-view rooms at Marina Bay's big three is proximity to a genuinely different kind of night: riverside bars and restaurants that operate on their own schedule, independent of the race, so a rain delay or an early night doesn't mean sitting in a hotel room. If the race weekend is as much about the city around it as the racing itself, this is the neighbourhood that delivers that.`;

const whyItsSpecial = `Marina Bay's trackside hotels sell you a view of the circuit; Clarke Quay sells you a version of Singapore that exists independently of the race entirely, and that's genuinely valuable on a three-day trip with long gaps between sessions. Walking distance to the circuit means you're not sacrificing access, you're choosing a different kind of evening, one built around a two-century-old river district that's been Singapore's nightlife centre for decades, not a hotel lobby facing a floodlit straight. For a fan who wants the race and a real night out that isn't just an extension of the circuit, this is the better trade.`;

const insiderTips = [
  "Holiday Inn Express Clarke Quay's 8.5/10 Booking.com rating and Guests' Choice award make it the clear mid-range anchor here — book it specifically rather than the area generically if a reliable, well-reviewed stay matters.",
  "Clarke Quay MRT (North East Line) is the fastest way back into the wider city after a late Padang Stage set, useful if walking back to the circuit area isn't appealing post-midnight.",
];

const whatToAvoid = `Don't book blind in this neighbourhood assuming every riverside hotel is equally well-reviewed — ratings genuinely vary here, so check the specific property's score before booking rather than trusting the area's reputation alone. Also factor in noise: Clarke Quay is genuinely loud into the night given the nightlife density, a real consideration if an early Saturday practice session means you need real sleep.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out; nightlife district is busiest from evening through late night",
  costRange: "Mid-range, from roughly S$80/night at the budget end up to boutique/4-star pricing — genuinely more accessible than Marina Bay's trackside luxury tier",
  bookingMethod: "Book via Booking.com or each hotel's own site — check the specific property's rating before booking, since quality varies meaningfully within this one neighbourhood.",
  howToBook: "",
  website: "https://www.booking.com/hotel/sg/holiday-inn-express-singapore-clarke-quay.html, https://www.booking.com/district/sg/singapore/clarke-quay.html",
  reservationsRequired: true,
};

const gettingThere = "Clarke Quay MRT Station (North East Line, NE5) sits at the heart of the district. Marina Bay Street Circuit is within walking distance.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Clarke Quay — riverside nightlife, walkable to the circuit",
      subtitle: "Colonial warehouses turned bars and clubs, an 8.5-rated mid-range anchor, and a real night out beyond race weekend",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Clarke Quay",
      address: "Clarke Quay, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Holiday Inn Express Clarke Quay rating (8.5/10, 3869 reviews, Guests' Choice) confirmed via Booking.com. Area character sourced from hotels.com Go Guides, singaporeexplore.com, landtransportguru.net. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["nightlife", "riverside"],
      interestCategories: ["accommodation", "nightlife"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
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
