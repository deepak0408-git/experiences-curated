// Weather & What to Pack — Chinese GP 2027. Sources: multiple independent
// climate-data sources corroborated (weatherspark.com, climate-data.org,
// travelchinaguide.com, climatestotravel.com — consistent figures across
// all), AccuWeather 10-day forecast (confirmed real URL via search results,
// per skill standing rule — never guessed).
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-weather-" + Date.now().toString(36);

const bodyContent = `Mid-April in Shanghai runs mild and genuinely spring-like — averages around 16-17°C, climbing toward the low-20s by month's end, with daytime highs regularly hitting 20°C or warmer. Rain is the detail that actually matters for planning: roughly 90mm falls across the month over 10-12 rainy days, usually light and short rather than a dramatic downpour, but frequent enough that a wet session is a real possibility across a three-day weekend. Humidity sits around 75%, enough to make a mild temperature feel heavier than the number suggests, and skies are overcast or cloudy more often than not.

Pack for that mix rather than a single average. A packable rain shell beats a full umbrella — easier to manage in a grandstand crowd, and April's rain is rarely heavy enough to need more. Bring layers: a light jacket or fleece for cooler mornings and evenings, with something breathable underneath for warmer, humid afternoons. Closed, comfortable walking shoes matter more than anything else — you're on your feet across a full session day, possibly on wet concrete. Pack a few pairs of socks in different thicknesses too, so you can adjust for a cooler, damp morning versus a warmer, humid afternoon without changing shoes. Sunglasses and a light hat are still worth packing even with the cloud cover, since Shanghai's spring sun does break through, and a reusable water bottle helps with the humidity. If your seat is in an uncovered grandstand or general admission, treat the rain layer as essential rather than optional.

Grandstand A, H, and K are covered structures; Grandstand B and general admission areas offer no reliable shelter. Pack based on where you're actually sitting, not just the citywide forecast.`;

const whyItsSpecial = `A lot of race-weekend weather advice is generic — "pack layers," "bring an umbrella" — the kind of thing that applies equally to any city on any continent. Shanghai's April climate has real, specific shape to it: a genuine spring warm-up, a rain pattern frequent enough to plan around but rarely severe, and a humidity level that changes how a mild temperature actually feels on your skin. Knowing that shape, paired with a packing list built for it rather than a generic one, is what lets you pack once, correctly, rather than over-pack for every possibility or under-pack and regret it on a damp Saturday qualifying session.`;

const practicalInfo = {
  bookingMethod: "Check the live 10-day forecast on AccuWeather closer to your trip for confirmed conditions rather than relying on seasonal averages alone.",
  website: "https://www.accuweather.com/en/cn/shanghai/106577/10-day-weather-forecast/106577",
};

const gettingThere = null;

const insiderTips = [
  "Pack a light, packable rain layer rather than a full umbrella if you're sitting in an uncovered grandstand (B) or general admission — rain here tends to be light and short rather than a dramatic downpour, and a compact layer is easier to manage in a crowd than an umbrella.",
  "Check the live AccuWeather 10-day forecast in the week before your trip, not just this seasonal guide — April's mix of dry and rainy days genuinely varies year to year, and a real forecast beats a historical average once you're close enough to the date for one to exist.",
];

const whatToAvoid = "Don't assume a mild average temperature means you won't need real weather protection — the combination of 10-12 rainy days and over 50% cloud cover across the month means a genuinely wet or grey session day is a real possibility, not a remote edge case. Don't pack only for the covered grandstands if your seat is in Grandstand B or general admission — those areas offer little to no shelter, and the citywide forecast doesn't tell you which grandstand you're actually sitting in.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather & What to Pack — Shanghai in April",
      subtitle: "Mild spring, frequent light rain — what to actually pack for Shanghai in April, not just averages.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/bahrain-grand-prix-packing.jpg",
      heroImageAlt: "Packed suitcase and travel essentials for a race weekend trip",
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Climate figures corroborated across multiple independent sources (weatherspark.com, climate-data.org, travelchinaguide.com, climatestotravel.com — consistent temperature/rainfall/humidity figures across all). AccuWeather 10-day forecast URL confirmed via direct search result (accuweather.com/en/cn/shanghai/106577/...), not guessed, per standing skill rule.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
