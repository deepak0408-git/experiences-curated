import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-hoover-dam-" + Date.now().toString(36);

const bodyContent = `Hoover Dam is the classic Vegas day trip, and it earns that reputation on scale alone — a 726-foot concrete wall holding back the Colorado River, with Lake Mead stretching out on one side and the Black Canyon dropping away on the other. It's roughly 30 miles southeast of Las Vegas, about 45 minutes by car via US-93 South through Henderson and Boulder City, and there's no direct public transit — you're driving yourself or booking a guided tour with hotel pickup, typically from around $55 per adult.

The dam exterior, including the crest walk across the top and the view from Memorial Bridge, is open daily from 5am to 9pm and free to visit — a 60-90 minute stop covers this on its own. Adding the Visitor Center brings a visit to roughly 2.5-3 hours; the Power Plant Tour, which takes you down into the actual generating facility, extends it further to about 3-3.5 hours and runs $25-30 for adults. Most first-time visitors driving themselves find the Power Plant Tour the best value of the paid options, since it's the one that actually gets you inside the working infrastructure rather than just looking at it from above.

One honest caveat worth knowing before you go: the Visitor Center's exhibits have been undergoing a major renovation with no clear completion date as of this writing. Some recent visitors have found the free dam walk and overlooks sufficient on their own, without needing the museum portion, while others still find the Power Plant Tour worth the ticket regardless of exhibit status. Check current status before planning your visit around the museum specifically.

Parking runs around $10, and budgeting a half-day — roughly 5 to 5.5 hours total including the drive both ways — gives a comfortable, unrushed visit.`;

const whyItsSpecial = `Hoover Dam earns its status as the default Vegas day trip honestly — it's not hype, it's genuinely one of the most impressive pieces of engineering in the country, built during the Depression at a scale that still reads as audacious nearly a century later. What I like about recommending it specifically during Grand Prix week is the contrast: you spend the weekend watching engineering built purely for spectacle, then a short drive away is engineering built to hold back a river and power a region, with nothing decorative about it at all. Seeing both within the same trip says something real about what large-scale ambition looks like in two completely different registers.`;

const insiderTips = [
  "The free dam-and-bridge walk alone is genuinely worth the trip even with the Visitor Center's ongoing renovation — don't skip the visit entirely on the assumption the museum closure ruins the experience.",
  "Arrive early if you're driving yourself and want the Power Plant Tour — tour group sizes and timed entry windows mean a later arrival can mean a longer wait or a less convenient tour slot than showing up close to opening.",
];

const whatToAvoid = `Don't book the Power Plant Tour expecting a fully restored, renovation-complete Visitor Center experience to go with it — check current renovation status before your visit, since expectations set by older guides may not match what's actually open right now. Don't plan on public transit — there's no direct bus or train service from Las Vegas to Hoover Dam, and showing up without a car or a booked tour with pickup will leave you stuck without a way to get there.`;

const practicalInfo = {
  hours: "Dam exterior daily 5am-9pm (free); Visitor Center hours vary during ongoing renovation — confirm before visiting",
  costRange: "Free for the dam walk and overlooks; Power Plant Tour US$25-30 per adult; parking approximately US$10; guided tours with hotel pickup from approximately US$55 per adult",
  bookingMethod: "Power Plant Tour tickets available on-site or via usbr.gov. Guided tours with hotel pickup bookable via Viator, GetYourGuide, or directly through tour operators.",
  howToBook: "",
  website: "https://www.usbr.gov/lc/hooverdam/",
  reservationsRequired: false,
};

const gettingThere = "Roughly 45 minutes southeast of Las Vegas via US-93 South through Henderson and Boulder City. No direct public transit — drive yourself or book a guided tour with hotel pickup.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hoover Dam — the Classic Vegas Day Trip, Done Right",
      subtitle: "45 minutes from the Strip — Depression-era engineering on a scale that still lands",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Boulder City",
      address: "Hoover Dam Visitor Center, 81 Hoover Dam Access Rd, Boulder City, NV 89006",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from hooverdam-tours.co FAQ/hours pages, lasvegaswonders.com hours guide, and tripadvisor.com recent visitor reviews (Visitor Center renovation status, mixed exhibit reviews). Google rating via Places API (New) — required 2 retries to match the correct entity: first query matched Boulder City-Hoover Dam Museum (wrong entity), second matched Hoover Dam Lookout observation deck (also wrong), exact-address query on 'Hoover Dam Visitor Center & Tours' returned the correct match at 4.6/3,849 reviews, closely matching the 4.6/2,681 figure independently reported in search results. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["nature", "iconic"],
      interestCategories: ["outdoors", "history"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 3849,
      googleMapsUrl: "https://maps.google.com/?cid=12094932126724281694",
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
