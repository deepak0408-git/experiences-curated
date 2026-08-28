// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/WeatherSpoke.tsx),
// for the Full Pack + Travel Brief PDF build. Prose half only, hand-copied
// not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const nzAustraliaWeatherSpokeContent = {
  intro:
    "This tour runs through the height of the Australian summer, but the four host cities genuinely differ in how that summer actually feels — Perth's heat is dry, Adelaide's is a milder dry Mediterranean climate, Sydney's is humid, and Melbourne is the one city on this tour where a single day can swing through real weather extremes.",

  cityWeather: [
    { city: "Perth (1st Test, 9-13 Dec)", detail: "Australia's hottest, driest Test venue on this tour. Average highs around 29-30°C, with real spikes into the mid-30s. Low humidity, mostly clear skies — the most predictable weather of the four legs." },
    { city: "Adelaide (2nd Test, 17-21 Dec)", detail: "Dry Mediterranean climate, average around 25°C rising through December. Confirmed daytime cricket — no pink ball, no day/night format for this series." },
    { city: "Melbourne (3rd Test, 26-30 Dec)", detail: "The most genuinely changeable weather of the tour — average highs around 23.7-25°C, but real heatwave spikes above 35°C do happen, and roughly 9 rain days a month is normal for this time of year. Melbourne's own 'four seasons in a day' reputation is not exaggerated." },
    { city: "Sydney (4th Test, 4-8 Jan)", detail: "Warm and humid, average around 26°C. January carries real afternoon-storm risk — a sudden downpour on an otherwise clear day is a normal Sydney summer pattern, not a rare event." },
  ],

  packList: {
    label: "What to actually pack",
    items: [
      { label: "Sun protection, non-negotiable", body: "Broad-spectrum sunscreen, a hat, and sunglasses for every single day of this trip — Australian summer UV is genuinely stronger than most international visitors expect, at any of the four cities." },
      { label: "Layers for Melbourne specifically", body: "Pack at least one warmer layer for the Melbourne leg even in summer — the city's real day-to-day temperature swings mean a 35°C afternoon can be followed by a genuinely cool evening." },
      { label: "Rain gear for Melbourne and Sydney", body: "A compact umbrella or light rain jacket is worth carrying at both legs — Melbourne for its unpredictability, Sydney for January's afternoon-storm pattern." },
      { label: "Ground rules on what you can bring", body: "Every venue restricts bag size and prohibits glass containers and outside alcohol — check each ground's specific rules before you pack for match day, since they differ slightly venue to venue." },
    ],
  },

  sourcesFooter:
    "Sources: weatherspark.com, weather-and-climate.com, holiday-weather.com (city climate averages, cross-referenced across sources); accuweather.com (live per-city forecast links).",
};
