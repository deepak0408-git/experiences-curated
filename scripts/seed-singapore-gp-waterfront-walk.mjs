import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-waterfront-walk-" + Date.now().toString(36);

const bodyContent = `Three of Singapore's most recognisable landmarks sit close enough together that they work as one connected walk rather than three separate stops, and the route runs directly through the same waterfront the circuit wraps around.

Start at Merlion Park, free and open 24 hours, home to the half-lion, half-fish statue created in 1964 as a Singapore Tourism Board logo before it became a genuine national symbol, representing the city's origins as the fishing village Temasek and its transformation into the modern "Lion City." From there, the Marina Bay Waterfront Promenade leads past the Helix Bridge toward Marina Bay Sands, roughly 15-20 minutes on foot along the water.

At Marina Bay Sands, the SkyPark Observation Deck, 200 metres up with 360-degree views, runs 11am-9pm, with non-peak pricing (11am-4:30pm, S$32) genuinely cheaper than peak hours (5pm-9pm, S$36), worth timing deliberately if budget matters. From Promenade MRT station, it's a five-minute walk to the Singapore Flyer, the giant observation wheel, open 8:30am-10:30pm with last flight at 10pm, adult tickets at S$33.

The full route, Merlion Park through to the Flyer, covers roughly 3.5km and takes 3-4 hours done properly, though each stop works fine as a standalone visit if a full afternoon isn't available. Given the circuit itself wraps around this exact waterfront, this walk doubles as genuine orientation for where you'll actually be standing during the race.`;

const whyItsSpecial = `This walk is Singapore's postcard image assembled in real life, and it happens to trace almost exactly where the circuit itself runs. Doing it before race weekend isn't just sightseeing, it's a genuine way to learn the geography you'll be navigating on foot for three days, Merlion Park to the Helix Bridge to Marina Bay Sands to the Flyer covers a meaningful stretch of the same ground the grandstands sit around. I'd recommend doing at least part of this route on arrival, not as an afterthought, purely because it makes the rest of the weekend easier to navigate.`;

const insiderTips = [
  "Book SkyPark tickets for non-peak hours (11am-4:30pm, S$32) rather than peak (5pm-9pm, S$36) if the view matters more than the sunset timing, it's a genuine price difference for a similar experience.",
  "Walk this route on your first day in Singapore, before race sessions start, it doubles as real orientation for the same waterfront the circuit wraps around.",
];

const whatToAvoid = `Don't try to do the full 3.5km route and both paid attractions (SkyPark and the Flyer) in one go during race weekend itself, between crowds and session timing it's a tighter squeeze than the 3-4 hour estimate suggests. Split it across two visits if your schedule is tight rather than rushing all three landmarks in one session.`;

const practicalInfo = {
  hours: "Merlion Park: 24 hours, free. SkyPark: 11am-9pm (non-peak 11am-4:30pm, peak 5pm-9pm). Singapore Flyer: 8:30am-10:30pm, last flight 10pm.",
  costRange: "Merlion Park: free. SkyPark: S$32 non-peak / S$36 peak adult. Singapore Flyer: S$33 adult, S$21 child, S$24 senior.",
  bookingMethod: "Merlion Park needs no ticket. Book SkyPark and Singapore Flyer tickets online in advance for race weekend to skip queues.",
  howToBook: "",
  website: "https://www.marinabaysands.com/attractions/skypark-observation-deck.html, https://www.singaporeflyerticket.com/plan-your-visit",
  reservationsRequired: false,
};

const gettingThere = "Raffles Place MRT for Merlion Park. Bayfront MRT for Marina Bay Sands. Promenade MRT for the Singapore Flyer, a 5-minute walk from the station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Marina Bay Waterfront Walk — Merlion to the Flyer",
      subtitle: "Merlion Park, the SkyPark, and the Singapore Flyer, connected by the same water the circuit wraps around",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "1 Fullerton Road, Singapore 049213 (Merlion Park)",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Merlion Park history sourced from trawell.in, tripoto.com. SkyPark and Singapore Flyer pricing/hours confirmed via marinabaysands.com and singaporeflyerticket.com official pages. Route distance via enyatravel.com and travelosio.com. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["scenic", "iconic"],
      interestCategories: ["sightseeing"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
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
