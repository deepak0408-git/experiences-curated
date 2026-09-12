import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-sao-roque-wine-route-" + Date.now().toString(36);

const bodyContent = `São Roque sits roughly 43 miles west of São Paulo, and it's been Brazil's own wine country since the 17th century — Portuguese immigrants first planted vines here for the climate, and Italian immigrants later took over and expanded the region into what's now known simply as "the Land of Wine." It's a genuinely different pace from a São Paulo race weekend: rolling countryside, working vineyards, and small family-run operations rather than the city's density and noise.

A typical day tour runs about 7 hours, with hotel pickup and drop-off included for anyone staying within a few miles of central São Paulo (pickup from a fixed point on Avenida Paulista otherwise). Tours generally stop at four wineries — Vinícola Terra do Vinho, Vinícola Canguera, Frank's Winery, and Vinícola Goes, the last of these the largest and most established operation in the region, with a genuinely strong, large-sample reputation. Most itineraries include a lunch stop at a Portuguese-style property along the route, and wrap up with time at a chocolate factory's retail store — an odd-sounding pairing that works better than it sounds after a few wine tastings.

This isn't a serious wine-connoisseur trip in the Napa or Mendoza sense — it's a relaxed countryside day built around tasting, small-production wineries, and a genuine change of pace from the city, priced and paced for a broad range of visitors rather than dedicated wine tourism.`;

const whyItsSpecial = `Most people who come to Brazil for a race weekend don't know the country has a genuine, centuries-old wine tradition sitting less than an hour outside the same city hosting the Grand Prix — São Roque isn't a manufactured tourist add-on, it's real agricultural history that predates the circuit by three hundred years. [Vinícola Goes' own strong, well-attested rating](https://maps.google.com/?cid=882616080372119580&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) reflects a working winery that's earned its reputation over generations, not a tour-bus stop built for volume. A day out here is the clearest way to see that São Paulo's story isn't only skyscrapers and traffic — twenty minutes outside the city limits, it's still genuinely rural in places.`;

const insiderTips = [
  "Book the tour rather than trying to visit São Roque's wineries independently by rideshare — most of the individual vineyards are spread out enough that a single organized route with a driver covers more ground in less time than piecing it together yourself.",
  "Pace your tastings across all four wineries rather than drinking heavily at the first one or two — a full day of tastings adds up, and Vinícola Goes (the largest, generally the most substantial stop) works better experienced with a clear head partway through the day.",
];

const whatToAvoid = `Don't expect a premium, connoisseur-level wine experience on the scale of a major international wine region — São Roque's wineries are smaller-scale, family-run operations, genuinely charming but not aiming for that tier, so set expectations around a relaxed countryside day rather than a serious tasting menu. And don't skip the lunch stop assuming it's a throwaway inclusion — the Portuguese-style property lunch is typically one of the better-reviewed parts of the full-day itinerary, not a filler stop between wineries.`;

const practicalInfo = {
  hours: "Full-day tours run roughly 7 hours, typically departing São Paulo mid-morning",
  costRange: "Around US$120-130 per person, including hotel pickup/drop-off, 4 winery admissions with tastings, transport, and a guide",
  bookingMethod: "Book through a tour operator such as Civitatis or GetYourGuide — advance booking recommended given the fixed pickup schedule.",
  website: "https://www.civitatis.com/en/sao-paulo/sao-roque-day-trip/",
};

const gettingThere = "São Roque is roughly 43 miles (70km) west of São Paulo. Nearly all visitors reach it via an organized day tour with hotel or Avenida Paulista pickup, since public transit options are limited and the wineries themselves are spread across the countryside.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "São Roque Wine Route",
      subtitle: "Four wineries, a Portuguese lunch, and centuries of wine history 43 miles from Interlagos",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "São Roque (day trip from São Paulo)",
      address: "São Roque, São Paulo state, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tour structure (7-hour duration, hotel pickup zone, 4 named wineries, Portuguese-style lunch, chocolate factory stop, ~US$124 starting price) sourced directly from Civitatis' own official tour listing via WebFetch, 11 Sep 2026. Regional history (17th-century Portuguese origin, Italian immigrant expansion, 'Land of Wine' name) sourced from earlier destination-level research (multiple aggregator sources), cross-checked. Real Google Maps rating confirmed for the named largest winery via Places API, 11 Sep 2026: Vinícola Góes 4.6/5,990 reviews — cited as representative given it's described as the region's largest and most traditional operation; the other 3 named wineries were not individually rated in this pass given the multi-stop tour format.",
      sport: ["formula_one"],
      moodTags: ["relaxing", "scenic", "distinctive"],
      interestCategories: ["food", "nature"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #19 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
