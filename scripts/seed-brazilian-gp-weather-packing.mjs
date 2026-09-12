import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-weather-packing-" + Date.now().toString(36);

const bodyContent = `November in São Paulo sits inside the city's wet season, and the numbers back that up clearly: average highs around 27°C (81°F), lows around 16°C (62°C), and roughly 165mm of rainfall spread across an average of 14 rainy days in the month — a 48% chance of rain on any given day. This isn't a light-shower climate either; São Paulo's wet season brings genuine, intense afternoon thunderstorms, the kind that can turn a clear morning into a real downpour by mid-afternoon with little warning.

That pattern matters directly for race weekend. More than one Brazilian GP has been decided in the rain — the 2003 and 2012 races are still argued about today — and Interlagos' grandstands split cleanly into covered and uncovered options; Grandstands A and G are the two uncovered stands at the circuit, so anyone in either one needs a real rain plan, not just an umbrella (which, worth noting, is on the circuit's own prohibited items list — see the Arrival & Queue Guide elsewhere in this pack).

Pack for both extremes in the same day: a lightweight, breathable layer for the heat and humidity, a genuine packable rain jacket (not an umbrella) for the near-certain chance of a downpour at some point across the weekend, and sun protection — the UV index in São Paulo runs to an extreme 12 in November, high enough that sunscreen and a hat matter even on an overcast-looking day. Comfortable, closed-toe shoes matter too, since a wet grandstand or a rain-soaked walk from the metro is a different experience in sandals than in real shoes.`;

const whyItsSpecial = `A lot of race-weekend packing advice reads like it was written for a European summer circuit and copy-pasted onto every other race on the calendar. São Paulo's weather doesn't work that way — real heat, real humidity, and a genuine, statistically frequent chance of an intense afternoon storm, all inside the same few days. Getting this specifically right (rain jacket over umbrella, sun protection despite gray skies, a real plan for an uncovered grandstand) is the difference between a weekend where the weather is a minor inconvenience and one where it derails your day.`;

const insiderTips = [
  "Bring a packable rain jacket, not an umbrella — umbrellas are explicitly banned from the circuit grounds, so if you're in an uncovered grandstand and rain hits, a jacket is your only in-venue option.",
  "Check the actual short-range forecast the day before each session rather than packing purely off the seasonal average — São Paulo's afternoon storms are hit-or-miss on any given day even within a wet month, so a live forecast check the night before genuinely changes what you'd want in your bag that day.",
];

const whatToAvoid = `Don't assume a hot, sunny morning means you're safe from rain that afternoon — São Paulo's wet-season thunderstorms build quickly and can turn a clear day wet within an hour or two, so treat rain gear as a daily essential regardless of how the morning looks. And don't bring an umbrella to the circuit expecting to use it as backup rain protection — it's on the official prohibited items list and will be confiscated at the gate, so a rain jacket is genuinely your only compliant option inside the venue.`;

const practicalInfo = {
  hours: "N/A — weather/packing guide",
  costRange: "N/A",
  bookingMethod: "N/A — check the live 10-day forecast before finalizing your packing list.",
  website: "https://www.accuweather.com/en/br/sao-paulo/01000/10-day-weather-forecast/497767_pc",
};

const gettingThere = "N/A — this experience covers weather and packing, not a location.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather & What to Pack",
      subtitle: "27°C highs, a 48% daily chance of rain, and an umbrella ban at the circuit gate",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "São Paulo (city-wide)",
      address: "São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "November climate data (avg highs 27°C/81°F, lows 16°C/62°F, ~165mm rainfall, ~14 rainy days, 48% daily rain chance, UV index 12) sourced from Wanderlog's São Paulo November weather page and Weather-and-Climate.com's November averages, cross-checked, 11 Sep 2026. Umbrella ban and uncovered-grandstand (A, G) cross-reference sourced from this pack's own Arrival & Queue Guide and Grandstand A experiences, already researched and verified earlier in this build. AccuWeather 10-day forecast link identified via search of accuweather.com's own indexed pages (not guessed/constructed) — the URL with live current-conditions data attached was used as the higher-confidence match per the standing rule against guessing opaque location-code URLs; a second, differently-coded São Paulo AccuWeather URL also surfaced in search and could represent a duplicate/alternate listing, noted for awareness.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #24 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
