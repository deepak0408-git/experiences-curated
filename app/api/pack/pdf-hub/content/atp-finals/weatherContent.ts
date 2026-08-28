// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/WeatherSpoke.tsx), for the Full Pack +
// Travel Brief PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const atpFinalsWeatherSpokeContent = {
  intro:
    "November is genuinely Turin's wettest month, and by the time the tournament runs (15-22 Nov), the city is deep into its cold, dark, damp late-autumn stretch. This isn't marginal weather to shrug off — plan for it properly.",

  whatToExpect: {
    label: "What to expect",
    rows: [
      { label: "Daytime high", value: "Around 12°C early in the month, cooling toward 8°C by month's end" },
      { label: "Nighttime low", value: "Roughly 2-5°C — sources vary, but genuinely cold after dark either way" },
      { label: "Rainfall", value: "Averaging 139mm across the month, roughly 11 days of rain" },
      { label: "Daylight", value: "Only ~3.5 hours of sunshine per day on average — November is the darkest stretch of Turin's year" },
      { label: "Humidity", value: "Around 80% average relative humidity" },
    ],
  },

  whatToPack: {
    label: "What to pack",
    body:
      "A genuine waterproof layer, not just a light jacket — with 11 rainy days average across the month, you'll likely hit at least one during your trip. Layer for the temperature swing between daytime highs and overnight lows. Comfortable, weatherproof footwear matters more here than in most tennis-trip destinations, since you're walking Turin's historic centre and connecting via tram, not staying in air-conditioned comfort throughout.",
  },

  indoorsNote: {
    label: "Indoors either way",
    body:
      "Inalpi Arena itself is fully indoors — unlike an outdoor Grand Slam, weather doesn't affect the tennis itself. It's your time in the city between sessions where the forecast actually matters.",
  },

  forecastBox: {
    ctaText: "Turin 10-day forecast on weather.com →",
  },

  sourcesFooter: "Sources: weather-and-climate.com and weather-atlas.com (November climate averages for Turin).",
};
