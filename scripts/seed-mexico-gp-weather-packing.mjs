import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-weather-packing-" + Date.now().toString(36);

const bodyContent = `Mexico City sits at roughly 2,240 meters above sea level — higher than Denver, the "Mile-High City" in the US, by a real margin. Race weekend falls at the boundary between October and November, and the temperature swing across a single day is the thing most first-time visitors underestimate: daytime highs typically run 18-22°C (64-72°F), genuinely pleasant, but nights and early mornings drop to 8-12°C (47-54°F), cool enough that a T-shirt alone leaves you cold waiting for a Metro or standing in a grandstand queue before sunrise.

Rain is a real, if diminishing, factor this time of year. October still sees around 9 days of rain averaging close to 100mm total, typically arriving as short, intense afternoon showers rather than all-day drizzle. By November the pattern shifts toward fewer rain days but showers that can be surprisingly heavy when they do arrive. Neither month is the wet season proper, but "not the wet season" doesn't mean rain-free — a compact umbrella or light rain jacket earns its place in your bag regardless of the forecast looking clear that morning.

The altitude itself matters beyond temperature. UV exposure is meaningfully stronger here than the air temperature suggests, because there's less atmosphere between you and the sun — sunscreen and a hat are non-negotiable even on a mild-feeling day, and this applies doubly if you're spending hours in an uncovered grandstand (see the dedicated grandstand comparison elsewhere in this pack for which stands offer any shade at all). Some visitors also feel the altitude directly in the first day or two — shortness of breath on stairs, feeling more tired than expected from ordinary walking. It typically passes within a day or so as your body adjusts; staying hydrated and pacing your first day's activity level helps.

The practical packing list: layers over any single heavy garment, since you'll want to shed and add clothing across a single day rather than dress once for an average temperature; a light rain jacket or compact umbrella; comfortable, closed walking shoes (cobblestones in the historic center and Coyoacán, plus real distances at the circuit, add up); sunscreen and a hat regardless of how the temperature feels; and something warm for early grandstand arrivals or evening outdoor time, since the cool nights catch people off guard more than the rain does.`;

const whyItsSpecial = `Most race-weekend packing advice is generic — "layers, sunscreen, comfortable shoes" could describe almost anywhere. Mexico City's specific combination is less common: real daytime warmth, genuinely cool nights, intermittent but serious rain risk, and an altitude high enough to change how sun exposure and physical exertion actually feel, all in the same 48-hour window. Packing for "warm" alone or "cool" alone both fail here — the honest advice is to pack for a wider daily range than the average temperature implies, because the average is exactly what you won't experience at any single point in the day.`;

const insiderTips = [
  "If you feel unusually tired or short of breath in your first day or two, that's normal altitude adjustment, not a sign something's wrong — pace your first day's walking and hydrate more than usual rather than pushing through at your normal-elevation pace.",
  "Pack real warmth for early grandstand arrivals specifically — gates often open well before sunrise's warmth kicks in, and standing around in a queue at 6-7am in October/November temperatures is colder than most visitors expect from a city that reads as 'warm' on a quick weather check.",
];

const whatToAvoid = `Don't drink heavily on your first night or two, especially if you're already feeling the altitude — alcohol interferes with your body's oxygen flow at this elevation, and hangover symptoms overlap so closely with altitude sickness (headache, nausea, fatigue) that it becomes genuinely hard to tell which one you're actually dealing with the next morning. Ease into race-weekend celebrations rather than starting hard on arrival night. And don't skip lip balm and hand lotion assuming a "warm" city won't dry you out — Mexico City's late-October air is genuinely dry at this altitude, and chapped lips and cracked skin are one of the most common, easily-avoided complaints from first-time visitors who packed for temperature but not for dryness.`;

// No practicalInfo — removed 7 Sep 2026 per founder request. Every field
// here was either "N/A" or a generic external forecast link, none of it
// genuine venue/booking practical info the way it is for other experiences.
const practicalInfo = null;

const gettingThere = null;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather & What to Pack — Late October in Mexico City",
      subtitle: "Warm days, cold nights, real rain risk, and an altitude that changes how the sun hits you",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Temperature and rainfall figures sourced from Weather-and-Climate.com's October/November Mexico City averages, cross-checked against AnEarthlyParadise.com's October weather guide, Sep 2026. Altitude/UV and adjustment advice sourced from Volaris Blog's Mexico City altitude guide. AccuWeather 10-day forecast URL confirmed via direct search results (location code 242560, consistent across multiple result pages) rather than guessed, per hub-and-spoke skill's standing rule on opaque location-ID URLs. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent nearly verbatim — replaced with 2 genuinely new avoids: alcohol worsening altitude adjustment and masking altitude-sickness symptoms (sourced from LetsTravelToMexico.com's altitude sickness guide, 6 Sep 2026), and dry-climate skin/lip care (sourced from MexicoNewsDaily.com's dry-season guide, 6 Sep 2026) — neither previously mentioned in this experience.",
      sport: ["formula_one"],
      moodTags: ["practical", "planning-essential"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #21 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
