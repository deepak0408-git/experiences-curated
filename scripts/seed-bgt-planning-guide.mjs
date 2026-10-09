import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "bgt-planning-guide-" + Date.now().toString(36);

const bodyContent = `This series runs five Tests across six weeks and five cities, but this pack covers three: Nagpur (21-25 Jan), Chennai (29 Jan-2 Feb), and Ahmedabad (27 Feb-3 Mar). The gap between Nagpur and Chennai is only four days, which is tight but workable. The gap between Chennai and Ahmedabad is nearly four weeks, which is the real planning question this trip forces on you.

Start with the flights. Nagpur to Ahmedabad is a direct route, under two hours, with roughly a hundred flights a day between IndiGo and Air India, so that leg is easy whenever you end up flying it. Nagpur to Chennai is the harder one: there's no direct flight, so you're connecting through Hyderabad, Mumbai, or Delhi, and building in a genuine travel day rather than assuming you can land in Nagpur, see the last session, and be in Chennai for the next morning's toss.

The four-week gap after Chennai is where this trip stops being a straight hop between three grounds and starts being an actual holiday. Flying home and back isn't unreasonable if that's what your schedule allows, but most fans covering all three Tests use the gap for one of two things: a multi-day trip inside the country (Gir National Park's lion safaris and the Statue of Unity are both realistic from Ahmedabad if you arrive early, see the Gujarat-side experiences in this pack) or simply spacing out arrival in Ahmedabad so you're not doing three cities in six weeks at a dead sprint.

If you're not from a country with visa-free or visa-on-arrival access, apply for India's e-Tourist visa well before booking flights, not after. It's a genuinely fast process, most applications clear in about 72 hours, and it currently covers travellers from 166 countries at US$10-40 depending on duration. The catch is that it only lets you enter through 31 designated international airports, so check that your first landing point in India, likely Nagpur, Chennai, or a connecting hub, is actually on that list before you commit to routing.

One more thing worth deciding early: which Test days you actually want tickets for. Test cricket runs five days per match but most tours don't need five days per city. Day three at Nagpur specifically has been where the last two India-Australia Tests here got decided (see the VCA Stadium experience in this pack), so if you're rationing days across three cities, that's a reasonable one to prioritize over an opening day that's historically played flatter.`;

const whyItsSpecial = `Most cricket tour packages sell you the drama of the series and leave the actual logistics as an afterthought. This one is the opposite problem, deliberately: the drama is easy, everyone already knows this is the biggest rivalry left in Test cricket, but nobody publishes the honest version of what it takes to actually string Nagpur, Chennai, and Ahmedabad together into one trip without either burning a fortune on backtracking flights or arriving exhausted for the match you cared most about. The four-week gap between Chennai and Ahmedabad isn't a flaw in this itinerary, it's the single biggest decision in it, and treating it as one up front, rather than discovering it after you've already booked Nagpur and Chennai, is what separates a trip that works from one that quietly falls apart in week three.`;

const insiderTips = [
  "There's no direct flight between Nagpur and Chennai — budget a genuine connecting-flight travel day between the two, not a same-day dash from stadium to airport to stadium.",
  "Apply for the e-Tourist visa before you book any flights, not after — it typically clears in about 72 hours, but entry is restricted to 31 designated airports, so it can affect which city you should fly into first.",
];

const whatToAvoid = `Don't assume you can catch the final session in Nagpur and still make Chennai's opening day — with no direct flight and only a four-day gap between the two Tests, that plan has almost no margin for a delayed connection. Don't leave the four-week Chennai-to-Ahmedabad gap unplanned until you're already in India — decide before you fly whether you're using it for a side trip, a rest stretch, or a return flight home, because winging it once you're there tends to mean an expensive last-minute domestic fare.`;

const gettingThere = `Nagpur, Chennai, and Ahmedabad each have their own international-capable or major domestic airport; routing between them is covered experience-by-experience in this pack's own Getting To sections for each city.`;

const practicalInfo = {
  bookingMethod: "This is a planning overview, not a bookable venue — use it to sequence the rest of this pack's Nagpur, Chennai, and Ahmedabad experiences.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Your Border-Gavaskar Trophy Tour Planning Guide",
      subtitle: "Three cities, six weeks, one rivalry — the real logistics of stringing it together.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Ixigo/EaseMyTrip route-distance data, Cleartrip flight schedules, Wego/Wiztrek e-Tourist visa guides. Overview/planning piece — no single venue to source a Google Maps rating for.",
      sport: ["cricket"],
      moodTags: ["trip-planning", "multi-city", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

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
