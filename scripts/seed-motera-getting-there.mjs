import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "motera-getting-there-" + Date.now().toString(36);

const bodyContent = `Ahmedabad has the most direct public transport option of any ground in this pack: Motera Stadium metro station, on the Ahmedabad Metro's Red Line, sits at the actual end of the North-South Corridor, built specifically to serve the stadium. Fares from most points in the city run roughly ₹15-35.

If you're flying in, the airport is 10-15km away, and the fastest combined route is a short cab ride to Thaltej metro station (about 12-15 minutes) followed by the metro itself, roughly 20 minutes total to Motera Stadium station. It's a genuinely workable, affordable route rather than something you'd only attempt out of necessity.

BRTS (Bus Rapid Transit) Line 11 also serves the area, connecting RTO Circle with Kalupur Railway Station, and the Motera Cross Road BRTS stop is about 1km, a 15-minute walk, from the stadium gates. AMTS city buses (routes including 135, 137-SH, 33, 58, 69-SH, and 138S) run through the area too, at ₹10-25 fares, for anyone comfortable navigating the local bus network.

One genuine caveat worth knowing before matchday: on a big fixture, private vehicles and even some rideshares get stopped some distance from the stadium itself, at the main road roughly where the BRTS corridor runs, leaving a 1-1.5km walk to the actual gates. The metro sidesteps this almost entirely, since Motera Stadium station drops you much closer to the entrances, which is the single strongest reason to default to the metro over a cab on matchday specifically, even if a cab feels more direct.`;

const whyItsSpecial = `Every other ground in this pack requires some kind of transport compromise, Jamtha's distance from central Nagpur, Chepauk's older, denser street grid. Motera is the one stadium in this pack actually built with its own dedicated metro station, engineered from the start to move a genuinely enormous crowd (132,000 seats) in and out efficiently. That's not a small thing at a ground this size, and it's worth taking advantage of rather than defaulting to a cab out of habit.`;

const insiderTips = [
  "Take the metro to Motera Stadium station rather than a cab on matchday specifically — vehicles are often stopped 1-1.5km short of the gates for crowd control, a walk the metro largely avoids by dropping you closer to the entrances.",
  "If you're arriving from the airport, the cab-to-Thaltej-then-metro route (about 20 minutes total) is faster and cheaper than a direct cab all the way to the stadium once matchday traffic is factored in.",
];

const whatToAvoid = `Don't book a direct door-to-door cab on the assumption it'll be faster than the metro on a big matchday — vehicle restrictions near the stadium can add a substantial walk that negates the convenience. Don't leave figuring out your route until matchday morning given the stadium's scale — decide in advance whether you're taking the metro, BRTS, or bus, since switching plans once you're already in transit costs real time at a venue this size.`;

const gettingThere = `By metro: Motera Stadium station (Red Line), the line's northern terminus, built to serve the stadium directly. From the airport: cab to Thaltej metro station (~12-15 min) then metro (~20 min total). By BRTS: Line 11, Motera Cross Road stop, ~15 min walk to gates. By bus: AMTS routes 135, 137-SH, 33, 58, 69-SH, 138S.`;

const practicalInfo = {
  bookingMethod: "No booking needed — metro, BRTS, buses, and taxis all run on demand.",
  costRange: "Metro fares roughly ₹15-35; BRTS/AMTS bus fares ₹10-25; airport cab-plus-metro combo typically under ₹300 total",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Motera — SG Highway & Stadium Access",
      subtitle: "The one ground in this pack with its own metro station — use it, especially on matchday.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Motera",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Ashaval.com/TravelJanah/HeritageOfAhmedabad stadium-access guides, Moovit transit data, Wikipedia (Ahmedabad Metro Red Line). Transit/logistics piece — no single rateable venue.",
      sport: ["cricket"],
      moodTags: ["logistics", "transit", "metro"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
