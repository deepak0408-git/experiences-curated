import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-gardens-by-the-bay-" + Date.now().toString(36);

const bodyContent = `Gardens by the Bay is a genuine daytime companion to a race weekend built around night sessions, close enough to Marina Bay Street Circuit to fill the hours before a floodlit evening without needing to plan a separate day.

The outdoor gardens, Supertree Grove, Serene Garden, Heritage Gardens, and the Dragonfly and Kingfisher Lakes, are free and open 5am to 2am daily, effectively no real restriction on when you visit. The two paid conservatories, Cloud Forest and Flower Dome, run 9am to 9pm with last admission around 8-8:30pm, and both are genuinely worth the ticket rather than a photo-op detour: Cloud Forest builds a misted mountain environment inside a covered dome, Flower Dome cycles through changing floral displays from different climate zones. The OCBC Skyway, a 22-metre-high walkway through the Supertree canopies, runs the same hours and is worth doing before dark for the view across the gardens and bay.

The free Garden Rhapsody light and sound show runs nightly at 7:45pm and 8:45pm at Supertree Grove, a 15-minute synchronised display that's genuinely spectacular after dark and needs no ticket, arrive a little early for a clear sightline since it draws real crowds by showtime. Given Singapore's race sessions typically run into the evening, the earlier 7:45pm show is the realistic one to catch before heading to the circuit, the 8:45pm slot will likely clash with getting to your grandstand.

It's a short walk or one MRT stop from Marina Bay Street Circuit via Bayfront station, genuinely easy to fold into a race day rather than requiring its own dedicated outing.`;

const whyItsSpecial = `Most Grand Prix cities don't hand you a free, genuinely world-class light show a short walk from the circuit gates, timed conveniently for the hours before a night race. Garden Rhapsody isn't a tourist-trap add-on, it's a serious piece of design and engineering, and pairing it with the Supertrees at dusk before heading to a floodlit street circuit is a sequence that's specific to Singapore's own rhythm as a night race. I think this is one of the clearest cases on this whole trip where the city itself, not just the racing, earns its place in the day.`;

const insiderTips = [
  "Catch the 7:45pm Garden Rhapsody show specifically if you have a race session that evening, the 8:45pm slot will likely conflict with getting to your grandstand or viewing platform in time.",
  "Do the OCBC Skyway before dusk, both for daylight views across the gardens and bay, and because last admission (around 8-8:30pm) means an evening-only visit risks missing it entirely.",
];

const whatToAvoid = `Don't assume the whole of Gardens by the Bay is free, only the outdoor gardens and Supertree Grove are, Cloud Forest, Flower Dome, and the OCBC Skyway all require separate paid tickets. Budget for this before arriving rather than being surprised at the entrance.`;

const practicalInfo = {
  hours: "Outdoor gardens: daily 5am-2am (free). Cloud Forest, Flower Dome, OCBC Skyway: daily 9am-9pm, last admission 8-8:30pm. Garden Rhapsody: nightly 7:45pm and 8:45pm, free.",
  costRange: "Outdoor gardens and Supertree Grove: free. Cloud Forest/Flower Dome: from approximately S$20 adult (check current pricing). OCBC Skyway: separate paid ticket.",
  bookingMethod: "Book Cloud Forest/Flower Dome/Skyway tickets online in advance via gardensbythebay.com.sg to skip queues, especially around race weekend.",
  howToBook: "",
  website: "https://www.gardensbythebay.com.sg/en/plan-your-visit/opening-hours.html, https://www.gardensbythebay.com.sg/en/things-to-do/calendar-of-events/garden-rhapsody.html",
  reservationsRequired: false,
};

const gettingThere = "Bayfront MRT station (CE1/DT16), walk via Dragonfly or Meadow Bridge. Roughly 10-15 minutes' walk to Marina Bay Street Circuit.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gardens by the Bay — the free light show before race night",
      subtitle: "Supertrees, Cloud Forest, and a free nightly show timed almost perfectly for a night-race evening",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "18 Marina Gardens Drive, Singapore 018953",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Hours confirmed via gardensbythebay.com.sg official page. Garden Rhapsody show times (7:45pm/8:45pm) confirmed via bykido.com and singapore-spirit.com. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["scenic", "free"],
      interestCategories: ["nature", "sightseeing"],
      pace: "slow",
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
