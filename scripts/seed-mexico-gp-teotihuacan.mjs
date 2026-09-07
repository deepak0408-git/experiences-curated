import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-teotihuacan-day-trip-" + Date.now().toString(36);

const bodyContent = `Teotihuacán sits roughly 40km northeast of Mexico City, about an hour's drive, and it's genuinely one of the most complete pre-Columbian sites accessible as a same-day trip from any major city in the world. The Pyramid of the Sun and Pyramid of the Moon anchor the site, connected by the Avenue of the Dead, a processional route stretching more than two kilometers through what was once one of the largest cities in the ancient Americas — at its peak, likely home to more people than contemporary Rome. Nobody knows for certain who built it; it predates the Aztecs, who found the city already ancient and abandoned when they arrived, and gave it the name it carries today, meaning roughly "the place where the gods were created."

Getting there independently is straightforward and cheap. Buses run from Mexico City's Terminal de Autobuses del Norte roughly every 15-30 minutes between 6am and 6pm, operated by Autobuses Teotihuacán specifically — look for their counter inside the terminal. A one-way ticket runs 50-60 pesos, the trip itself takes 1-1.5 hours, and the bus drops you directly at the site entrance. A taxi or rideshare covers the same distance faster, in around an hour, for roughly 500-600 pesos each way.

Plan for the full day even though the drive itself is short: budget 3-4 hours at the site to see the pyramids, the smaller structures, and the on-site museum properly, which means a full round trip — travel plus time on-site — runs close to 6 hours total. Guided tours typically depart early, 6-8am, picking up from a hotel or central meeting point, which has the advantage of getting you to the pyramids before the heat and crowds build. If you'd rather go independently, a skip-the-line ticket bought in advance lets you explore at your own pace for as long as you like within opening hours.

Climbing the Pyramid of the Sun is still permitted and remains the single most memorable part of most visitors' day — the view from the top takes in the entire site and the surrounding valley. Bring water, sun protection, and comfortable shoes regardless of how you get there; there's minimal shade across most of the site, and the walk between the two main pyramids alone covers real distance.`;

const whyItsSpecial = `Most "day trip from the capital" recommendations in big cities involve some compromise — a smaller, secondary site, or something genuinely worth seeing but clearly not the headline attraction. Teotihuacán isn't that. This is one of the largest and most significant ancient cities anywhere in the world, built by a civilization whose name we still don't actually know, later found already ancient and mysterious by the Aztecs themselves. Getting to stand on top of the Pyramid of the Sun, looking down an avenue built for a city that once rivaled ancient Rome in population, is a genuinely different order of experience than a typical big-city day trip — and the fact that it's an hour from your hotel, reachable by a $2 bus ticket, makes it one of the most accessible world-class sites anywhere.`;

const insiderTips = [
  "Take an early guided tour (6-8am departure) or arrive independently right at opening if you want to climb the Pyramid of the Sun before the midday heat and the busiest crowds — both build noticeably by late morning.",
  "The site is genuinely huge and mostly unshaded — bring more water than feels necessary and wear real walking shoes, since covering the Avenue of the Dead plus both major pyramids adds up to significant walking distance in direct sun.",
];

const whatToAvoid = `Don't underestimate the total time commitment — even though the drive is only about an hour each way, treating this as a quick half-day add-on to another plan usually means either rushing the site or arriving too late to comfortably see everything before closing. And don't skip sun protection assuming you'll duck into shade as needed — most of the site, including the long walk along the Avenue of the Dead, has minimal cover, and the altitude here means the sun is stronger than the temperature alone suggests.`;

const practicalInfo = {
  hours: "Site typically open daily, roughly 9am-5pm — check current hours before you go, as they can shift seasonally",
  costRange: "Bus: 50-60 MXN one-way. Taxi/rideshare: roughly 500-600 MXN one-way. Site entry: modest fee, a few hundred pesos.",
  bookingMethod: "Independent visitors can buy site entry at the gate or a skip-the-line ticket in advance online. Guided tours with hotel pickup are widely available and typically depart 6-8am.",
  website: "https://www.teotihuacantours.com",
};

const gettingThere = "Bus from Terminal de Autobuses del Norte (Autobuses Teotihuacán counter, departures every 15-30 min, 6am-6pm) or a taxi/rideshare, roughly 1-1.5 hours either way.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Teotihuacán — The Pyramids Day Trip",
      subtitle: "An hour from your hotel, built by a civilization whose name we still don't know",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Teotihuacán, State of Mexico",
      address: "Zona Arqueológica de Teotihuacán, San Juan Teotihuacán, State of Mexico",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Distance, bus/taxi logistics, and timing sourced from TravelingWithAga.com and RoadAffair.com's Teotihuacan day-trip guides, Sep 2026. Google rating via Places API lookup same session: 4.8/108,050 reviews (using the primary 'Teotihuacán' site listing, which covers the whole archaeological zone rather than itemizing individual structures).",
      sport: ["formula_one"],
      moodTags: ["day-trip", "must-see", "active"],
      interestCategories: ["culture", "history"],
      pace: "active",
      physicalIntensity: 4,
      budgetTier: "budget",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
      googleMapsRating: "4.8",
      googleMapsReviewCount: 108050,
      googleMapsUrl: "https://maps.google.com/?cid=7068512036969725366&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #18 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
