// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/WeatherSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const shanghaiMastersWeatherSpokeContent = {
  intro:
    "October is one of the best months of the year to visit Shanghai — sunny days are the norm, temperatures run mild, and rain is limited. Typhoon season, which peaks June through September, is essentially over by the time the tournament runs.",

  typicalConditions: {
    label: "Typical October conditions",
    rows: [
      { label: "Temperature range", value: "16-22°C (61-72°F)" },
      { label: "Rainy days", value: "~6 days, ~56mm total precipitation" },
      { label: "Typhoon risk", value: "Minimal — season effectively over by October" },
    ],
  },

  historicalCallout: {
    label: "Qizhong is outdoor hardcourt — rain can actually delay play",
    body:
      "Unlike an indoor arena, weather here directly affects the tennis itself, not just your time in the city. Center Court has a retractable roof, but the outer showcourts and Court 17's practice sessions are fully open to the sky — a rain delay on one of the ~6 typical October rain days is a real possibility if you're holding a Grounds Pass or an outer-court ticket, not just a city-sightseeing inconvenience.",
  },

  packList: {
    label: "What to pack",
    items: [
      "Layers — mornings and evenings can run cooler than the mild midday temperatures suggest",
      "A light jacket for evening sessions at Qizhong",
      "Comfortable walking shoes for the city sightseeing days",
    ],
  },

  crowdFactorNote: {
    label: "One real crowd factor",
    body:
      "National Day Golden Week (1-7 October) brings millions of domestic travelers into motion just before the tournament starts — not weather, but genuinely affects crowds and pricing across the city in the same window.",
  },

  forecastBox: {
    ctaText: "Shanghai 10-day forecast on weather.com →",
  },

  sourcesFooter:
    "Sources: topchinatravel.com, travelchinaguide.com, chinahighlights.com Shanghai weather guides — cross-checked across 3 sources for October temperature/rainfall consistency. Verified 10 Aug 2026.",
};
