import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-chinatown-stay-" + Date.now().toString(36);

const bodyContent = `Chinatown is the value base for Marina Bay Street Circuit, two MRT stops away on either the North East or Downtown line, with hotel rates that undercut both Marina Bay and Clarke Quay while still putting you inside a genuinely distinctive neighbourhood rather than a generic budget strip.

The area's defining feature is its restored heritage shophouses, narrow, multi-storey 19th and early 20th-century buildings with colourful facades and ornamental tilework, several of which now operate as boutique hotels. The Scarlet is the standout example: a boutique hotel built into a preserved pre-war shophouse on Erskine Road, rated 8.5 out of 10 on Booking.com across more than 2,100 reviews, with guests consistently praising the location and staff. It's honest to flag the trade-offs too, standard rooms run small and some without windows, and nearby construction noise has been a recurring complaint, worth checking current status before booking.

Beyond the hotels, Chinatown gives you real neighbourhood texture: hawker centres, heritage architecture, and cultural sites that exist independently of the race, so a day with a late session start still has somewhere to spend the morning. Multiple MRT lines through Chinatown station mean getting to the circuit, or anywhere else in the city, is fast regardless of which hotel you pick within the district.

If Marina Bay's trackside hotels are about proximity and Clarke Quay is about nightlife, Chinatown is the pick for travellers who want a genuine, lower-cost base with real character, at the cost of being a short MRT ride rather than a walk from the circuit gates.`;

const whyItsSpecial = `Chinatown does something Marina Bay and Clarke Quay don't: it gives you Singapore as it exists on any ordinary week, heritage shophouses, hawker stalls, temples, alongside a race weekend rather than swallowed by one. The Scarlet is proof this doesn't mean sacrificing quality, a genuinely well-reviewed boutique stay in a building with real pre-war history, at a fraction of Marina Bay's rates. I'd recommend this to a traveller who wants the race to be one part of the trip, not the entire frame around it, and who's comfortable trading a five-minute walk to the circuit for a two-stop MRT ride and a much lower nightly rate.`;

const insiderTips = [
  "The Scarlet's 8.5/10 Booking.com rating makes it the clear anchor recommendation in Chinatown, but check current guest reviews for construction noise before booking, it's been a recurring, unresolved complaint.",
  "Chinatown MRT station sits on both the North East and Downtown lines, giving you two fast routes to Marina Bay rather than one, useful if race-night crowding makes a single line unreliable.",
];

const whatToAvoid = `Don't book a Chinatown heritage shophouse hotel expecting a large standard room — several, including The Scarlet, run genuinely small, and some rooms lack windows entirely. If room size matters, check the specific room category before booking rather than assuming boutique means spacious.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out",
  costRange: "Budget hostels from S$25-40/night (dorm) or S$60-90 (private room); boutique shophouse hotels S$100-180/night, upscale options S$200+",
  bookingMethod: "Book via Booking.com or each hotel's own site — check current reviews for noise complaints given ongoing construction reported near some properties.",
  howToBook: "",
  website: "https://www.booking.com/hotel/sg/the-scarlet.html, https://www.booking.com/district/sg/singapore/china-town.html",
  reservationsRequired: true,
};

const gettingThere = "Chinatown MRT Station (North East Line and Downtown Line) sits at the centre of the district, roughly two stops from Marina Bay.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chinatown — the value base with real character",
      subtitle: "Heritage shophouses, an 8.5-rated boutique anchor, and two MRT lines to the circuit at half Marina Bay's rates",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chinatown",
      address: "Chinatown, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "The Scarlet rating (8.5/10, 2181 reviews) confirmed via Booking.com. Area pricing/character sourced from hericoll.com, tripadvisor.com, traveloka.com. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["heritage", "value"],
      interestCategories: ["accommodation", "culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
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
