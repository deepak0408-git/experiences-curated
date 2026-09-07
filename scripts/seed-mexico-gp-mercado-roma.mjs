import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-mercado-roma-" + Date.now().toString(36);

const bodyContent = `Mercado Roma is the food hall version of Mexico City's food scene — one roof, more than 50 vendor stalls, and a genuine range of cuisines that goes well beyond a "Mexican food court" premise. It's a three-story building on Querétaro Street in Roma Norte, designed by Rojkind Arquitectos inside a converted industrial space, and it works as a solution to a real problem for visitors: when you want to sample widely without committing to one restaurant for an entire meal, or when your group can't agree on Mexican, Italian, Japanese, or Venezuelan food for the night, this is the answer to all of them at once.

The specific stalls worth seeking out include Churrería El Moro for churros (a genuine local institution with its own standalone locations elsewhere in the city, sold here as a stall), Gold Taco for a strong vegetarian and vegan taco option in a city where that's not always easy to find well-executed, and a Venezuelan stall doing empanadas that consistently gets singled out in local recommendations. Beyond those, expect craft beer, Breton-style galettes, and baked goods alongside more traditional options — the range really is the point.

The building's third-floor rooftop, branded La Logia, is a genuine draw on its own — a beer garden with a strong selection of Mexican craft beer that fills up around 9pm on a normal evening and offers a lighter, more open-air pace than the busier ground-floor atrium. On Thursdays specifically, the whole venue stays open until 1:30am, one of the few food halls in the city running that late, which makes it a real option for a post-dinner second stop rather than strictly an early-evening destination.`;

const whyItsSpecial = `A food hall can easily be a compromise — convenient, but nothing in it is actually the best version of what it's serving. Mercado Roma avoids that by curating vendors that would hold their own as standalone destinations rather than filling stalls with food-court-grade versions of city classics. That distinction matters specifically on a trip where you're trying to sample as much of Mexico City's range as possible in a limited number of days — this is one stop that genuinely compresses several different, real dining experiences into a single visit, rather than diluting all of them.`;

const insiderTips = [
  "Head to the third-floor rooftop, La Logia, in the late afternoon before the 9pm rush — it's a noticeably calmer, more open-air version of the venue than the ground-floor atrium, and the shift in atmosphere is worth timing deliberately.",
  "If you're visiting on a Thursday specifically, Mercado Roma stays open until 1:30am — one of the only food halls in the city running that late, which makes it a genuine option for a second stop after an earlier dinner elsewhere.",
];

const whatToAvoid = `Don't treat this as a substitute for a proper sit-down meal at one of the city's standalone destination restaurants — it's built for grazing across multiple stalls in one visit, and going in expecting a single, focused dining experience the way you'd get at Contramar or Pujol will read as underwhelming by comparison. And don't assume every vendor keeps the same hours as the building itself — individual stalls set their own schedules within the market's overall opening window, so a specific stall you're set on might close earlier than the venue as a whole.`;

const practicalInfo = {
  hours: "Open from early afternoon through late evening most days; open until 1:30am on Thursdays specifically — individual vendor hours vary within that window",
  costRange: "Budget to moderate — individual stalls run comparable to standalone casual dining, so a full grazing visit across several stalls costs roughly what one sit-down meal would",
  bookingMethod: "No reservation needed for the market itself — walk in and choose vendors as you go. Some individual stalls may have their own queue at peak times.",
  website: "https://mr.mercadoroma.com",
};

const gettingThere = "Located at Querétaro 225 in Roma Norte — walkable from most Roma Norte hotels, and a short taxi or rideshare from Condesa or the historic center.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Mercado Roma & the City's Modern Food Halls",
      subtitle: "Three floors, 50+ vendors, one building — Mexican, Japanese, Venezuelan, and a rooftop beer garden",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Roma Norte",
      address: "Querétaro 225, Roma Norte, Cuauhtémoc, 06700 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Vendor details, rooftop (La Logia), and Thursday late-hours fact sourced from Mindtrip.ai and TourMe.app's Mercado Roma guides, Sep 2026. Google rating via Places API lookup same session: 4.3/17,051 reviews.",
      sport: ["formula_one"],
      moodTags: ["food-hall", "casual", "group-friendly"],
      interestCategories: ["food"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
      googleMapsRating: "4.3",
      googleMapsReviewCount: 17051,
      googleMapsUrl: "https://maps.google.com/?cid=7716541807456660054&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #14 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
