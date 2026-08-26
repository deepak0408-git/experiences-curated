import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "55f26c1e-adb3-46ba-aaf7-997585ed25a5"; // Sydney
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "blue-mountains-day-trip-from-sydney-" + Date.now().toString(36);

const bodyContent = `The Blue Mountains are the easiest genuinely spectacular day trip on this whole tour, because getting there needs nothing but a train ticket. Trains leave Central Station roughly hourly from before dawn, and the express service reaches Katoomba in about 90 minutes; all-stops services take closer to two hours. An Opal card or a contactless card works the same way it does on any Sydney train, no separate booking required.

From Katoomba station, bus 686 (also on the Opal network) runs to Echo Point, where the Three Sisters rock formation is the reason most people come. It's a genuinely striking sight rather than an overhyped one — three sandstone pillars standing apart from the escarpment, with the Jamison Valley dropping away in front of them and, on a clear day, blue haze rolling out toward the horizon that gives the range its name. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3989654425906347872&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

From Echo Point, the Giant Stairway drops nearly 1,000 steps, built in 1909, down toward the valley floor, connecting to Scenic World via the Federal Pass walking track. It's graded a serious walk, steep and hard on the knees, not a casual stroll, and it's worth knowing that going in rather than discovering it halfway down. Scenic World itself runs the steepest railway in the world, the steepest cable car in the southern hemisphere, and a 720-metre skyway with 360-degree views over Katoomba Falls, the Three Sisters, and the Jamison Valley — its Unlimited Discovery Pass covers all three rides plus the valley-floor boardwalks. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3715262289742429012&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

If the Giant Stairway's steps aren't for you, the Scenic Railway itself makes the same descent, and the last train down runs mid-afternoon — so it works both as a ride in its own right and as the easy way back up for anyone who walked down but doesn't want to climb the Furber Steps back to the top. One realistic day: train to Katoomba, bus to Echo Point, walk (or don't) down the Giant Stairway, ride the Skyway and Railway at Scenic World, then train back to Sydney in the evening.`;

const whyItsSpecial = `Sydney's Test match sits inside the city, so the temptation is to spend every non-match day exploring Sydney itself, harbour, beaches, the CBD. The Blue Mountains earns a place on the list precisely because it's the one day where you leave that entirely: no light rail, no stadium in view, just a 90-minute train ride into a genuinely different landscape. What makes it worth the trip specifically, rather than any other bushland day out, is that the Three Sisters and the walk down through Scenic World give you both a passive lookout experience and an active one in the same afternoon — you can stand at Echo Point and take the photo everyone takes, or you can actually descend into the valley on foot and feel the scale of it. Most single-day Sydney itineraries pick one or the other. This is close enough to do both.`;

const insiderTips = [
  "The last Scenic Railway train down from Scenic World runs mid-afternoon (check the current timetable before you go) — if you're planning to walk down the Giant Stairway and ride back up, work backward from that cutoff, not forward from when you arrive.",
  "Bus 686 from Katoomba station to Echo Point runs on the Opal network, same tap-on/tap-off system as Sydney's own buses — no separate ticket or cash fare needed, and it saves a genuinely long uphill walk from the station.",
];

const whatToAvoid = "Don't attempt the Giant Stairway's nearly 1,000 steps without knowing it's graded a serious, steep walk in advance — it's listed as suitable for people with some bushwalking experience, not a casual add-on to a day already built around a train trip and a lookout stop. Don't take the all-stops train assuming it's only marginally slower than the express — the difference is close to 30 minutes each way, which matters on a day trip with a fixed return window before dinner or an evening flight.";

const practicalInfo = {
  hours: "Scenic World: check current daily hours before visiting, generally opens mid-morning; last Scenic Railway descent runs mid-afternoon. Echo Point Lookout: always open, no entry fee.",
  costRange: "Scenic World Unlimited Discovery Pass roughly A$35-61/adult depending on season and package; Echo Point Lookout free; train fare from Sydney roughly A$5-9 each way off-peak with an Opal card",
  bookingMethod: "No booking needed for the train, Echo Point, or Scenic World's day passes — buy Scenic World tickets online in advance or at the gate. Bus 686 taps on/off with Opal or a contactless card.",
  howToBook: "",
  website: "https://www.scenicworld.com.au, https://www.visitnsw.com/destinations/blue-mountains",
  reservationsRequired: false,
};

const gettingThere = "Trains run from Central Station to Katoomba roughly hourly — express services take about 90 minutes, all-stops services closer to two hours. From Katoomba station, bus 686 (Opal network) runs to Echo Point; Scenic World is a short walk or drive from Echo Point via the Giant Stairway or Cliff Drive.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Blue Mountains — A Day Trip from Sydney",
      subtitle: "The Three Sisters, a 1,000-step descent, and the world's steepest railway, 90 minutes by train",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Katoomba, Blue Mountains",
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
      editorialNote: "Sources: visitnsw.com/destinations/blue-mountains (train times, Opal/contactless ticketing), sydneyexpert.com and escapeartistkatie.com (express vs all-stops train timing), imfree.tours (bus 686 confirmation), scenicworld.com.au and lovetravellingblog.com (Scenic World ticket price range, ride descriptions), wildwalks.com/nationalparks.nsw.gov.au (Giant Stairway 998 steps, 1909 construction, Grade Four difficulty, Scenic Railway as descent alternative). Google Places API lookups: Scenic World (4.5/23,510), Echo Point Lookout (Three Sisters) (4.7/11,966), both captured 16 Aug 2026 — real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["scenic", "active", "nature"],
      interestCategories: ["nature", "adventure", "sightseeing"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["jan"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 18 })
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
