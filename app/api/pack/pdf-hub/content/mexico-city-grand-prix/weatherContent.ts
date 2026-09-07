// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/WeatherSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. status="public" — no verdicts array (the "what we'd
// actually bring" block below IS Pro-gated in source, kept as a single
// verdict entry).

export const mexicoCityGpWeatherSpokeContent = {
  h1: "Warm days, cold nights, real rain risk — and an altitude that changes how the sun hits you",

  intro:
    "Mexico City sits at roughly 2,240 meters above sea level — higher than Denver, the \"Mile-High City.\" Race weekend falls at the October-November boundary, and the daily temperature swing is the thing most first-time visitors underestimate: daytime highs typically run 18-22°C, genuinely pleasant, but nights and early mornings drop to 8-12°C — cold enough that a T-shirt alone leaves you cold in an early grandstand queue.",

  forecastBox: {
    label: "Check the real forecast before you pack",
    body: "Race weekend is close enough now that a specific forecast is more useful than any seasonal average.",
  },
  forecastLinkUrl: "https://www.accuweather.com/en/mx/mexico-city/242560/10-day-weather-forecast/242560",

  packList: {
    label: "What to pack — by category",
    items: [
      { label: "Daytime layers", detail: "Short sleeves or a light long-sleeve shirt for the mild daytime highs (18-22°C) — comfortable, not hot." },
      { label: "Evening layer", detail: "A real jacket or sweater for early grandstand arrivals and evening hours — the drop to 8-12°C is a genuine cold, not a mild cooling." },
      { label: "Sun protection", detail: "Sunscreen and a hat — the altitude means UV exposure is meaningfully stronger than the air temperature suggests, especially in an uncovered grandstand." },
      { label: "Rain gear", detail: "A compact umbrella or light rain jacket — October still sees real afternoon showers, arriving as short but sometimes heavy bursts." },
    ],
  },

  honestTakeaway: {
    label: "The honest weather takeaway",
    body:
      "Packing for \"warm\" alone or \"cool\" alone both fail here — the honest advice is to pack for a wider daily range than the average temperature implies, because the average is exactly what you won't experience at any single point in the day. Layer rather than commit to one outfit.",
  },

  verdicts: [
    {
      label: "What we'd actually bring",
      body:
        "A genuinely packable jacket beats a heavier coat — the evening drop is real but not extreme (8-12°C, not freezing), so over-packing for cold wastes bag space you'll want for the day's warmer hours. If you feel unusually tired or short of breath in your first day or two, that's normal altitude adjustment, not a sign something's wrong — pace your first day's walking and hydrate more than usual rather than pushing through at your normal-elevation pace.",
    },
  ],

  sourcesFooter: "Sources: AccuWeather, Weather-and-Climate.com, Volaris Blog.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "mexico-city-weather-packing-" (packingGuide)
