import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "statue-of-unity-" + Date.now().toString(36);

const bodyContent = `At 182 metres, the Statue of Unity, a tribute to Sardar Vallabhbhai Patel, is the tallest statue in the world, roughly twice the height of the Statue of Liberty including its pedestal. It sits near Kevadia in the Narmada district, about 200km from Ahmedabad, a genuine day trip rather than a quick side excursion.

The drive itself runs 3.5-4.5 hours each way along the Ahmedabad-Vadodara expressway and onward, good roads throughout, and GSRTC operates Volvo and AC buses on the route if you'd rather not drive or hire a car for the full day. Most visitors leave Ahmedabad early morning and arrive by midday.

The Viewing Gallery is the reason most people make this trip: a high-speed elevator carries you up to 153 metres, inside the statue's chest, for 360-degree panoramic views over the Narmada reservoir and the surrounding valley. Access runs in timed two-hour slots (8-10am, 10am-noon, noon-2pm, 2-4pm, 4-6pm) with limited capacity per slot, so booking ahead is genuinely necessary rather than a suggestion. Beyond the viewing gallery, there's a museum and audio-visual exhibition covering Patel's role in India's independence and unification, plus an evening Laser, Light & Sound show.

One detail that catches visitors out: the site is closed on Mondays, except when a Monday falls on a national holiday. Given how far this trip is from Ahmedabad, checking your visit date against that closure before you commit to it is worth doing early, not as an afterthought.`;

const whyItsSpecial = `This isn't a stop that happens to be near Ahmedabad, it's a genuinely significant piece of modern Indian engineering and a real day's commitment, and it earns that commitment on scale alone. Standing inside a statue taller than almost any building most visitors will ever have been inside, looking out over the Narmada valley from 153 metres up, is a different category of experience than most day trips offer. For a series stop that also includes the Sabarmati Ashram and the old city's centuries of history, this adds the modern, monumental counterpoint, India's ambition expressed at a genuinely unprecedented physical scale.`;

const insiderTips = [
  "Book your Viewing Gallery slot online in advance, not on arrival — capacity per two-hour window is limited, and turning up without a booking risks missing the one thing most people come for.",
  "Double-check that your visit date isn't a Monday before you commit to the 3.5-4.5 hour drive — the site closes that day except on national holidays, and there's no way to salvage a wasted trip once you're there.",
];

const whatToAvoid = `Don't underestimate this as a single-day round trip if you're also managing a Test match schedule — with 7-9 hours of driving alone plus time at the site, it's a genuinely full day best kept separate from a matchday. Don't skip the museum and exhibition halls in favour of just the Viewing Gallery — the site's context on Sardar Patel's role in unifying India's princely states after independence is a real, substantive story that the statue's scale alone doesn't convey.`;

const gettingThere = `About 200km/3.5-4.5 hours by car from Ahmedabad via the Ahmedabad-Vadodara expressway; GSRTC also runs Volvo/AC buses on the route for a more budget-friendly option.`;

const practicalInfo = {
  hours: "Open daily except Mondays (open on Mondays that fall on a national holiday); Viewing Gallery access runs in timed slots between 8am-6pm",
  costRange: "Viewing Gallery ticket (including entry): ₹380 adults, ₹230 children; general entry + exhibition hall only: ₹150 adults, ₹90 children (ages 3-15); under-3s free",
  bookingMethod: "Book Viewing Gallery slots online in advance — capacity per two-hour window is limited and fills up, especially during winter's peak visiting season.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Statue of Unity — World's Tallest Statue Day Trip",
      subtitle: "182 metres, a 153-metre viewing gallery, and a genuine full day out from Ahmedabad.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Kevadia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: TheUnityTourism/StatueOfUnity.in ticket and booking guides, TripNCare/OneDay.travel day-trip logistics. Google Places API lookup confirmed rating/review count same date (4.6/98,946).",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 98946,
      googleMapsUrl: "https://maps.google.com/?cid=13322276625425296152",
      sport: ["cricket"],
      moodTags: ["day-trip", "monument", "engineering"],
      interestCategories: ["culture", "history"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["feb", "mar"],
      advanceBookingRequired: true,
      availability: "perennial",
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
