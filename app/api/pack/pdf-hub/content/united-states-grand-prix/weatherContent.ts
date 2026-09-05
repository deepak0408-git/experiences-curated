// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/WeatherSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. This spoke is status="public" with no {isUnlocked && (...)}
// block — no verdicts array.

export const usGpWeatherSpokeContent = {
  h1: "2023 hit a record 98°F — this is not a mild autumn weekend",

  intro:
    "Late October in Austin sits at an awkward point in the calendar — genuinely autumn by most of the country's standards, but Texas doesn't fully get the memo. Average highs run from the mid-80s°F early in the month down to around 77°F by late October, with lows dipping to the high 50s-low 60s°F overnight. The actual race weekends have run hotter than that average: 2023 broke a daily heat record with a forecast high of 98°F, and 2024's weekend still ran low-to-mid-80s throughout.",

  forecastLinkUrl: "https://www.accuweather.com/en/us/austin/78701/10-day-weather-forecast/351193",

  rainVariable: {
    label: "Rain is the other real variable",
    body:
      "Austin can see anywhere from about 1.4 to 5.9 inches of rain across the whole month in a typical year, and 2023's forecast specifically flagged a 30-50% chance of rain and thunderstorms around race weekend, even though the race itself ended up sunny both years running. Mornings often start clear, afternoons can turn cloudy or bring a scattered shower — a forecast checked the night before isn't always a guarantee for race day itself.",
  },

  packList: {
    label: "What to actually pack",
    items: [
      { label: "Real sun protection", detail: "Every trackside and general-admission area at COTA is fully exposed all day — Club Level at the Main Grandstand is the only fully covered tier at the entire circuit. Hat, sunscreen, and sunglasses are not optional for a full day here." },
      { label: "A compact rain poncho", detail: "Pack one even if the forecast looks clear when you check it — Texas weather can shift from a sunny morning to an afternoon shower quickly enough that a forecast checked the night before isn't reliable for race day itself." },
      { label: "Something light for after dark", detail: "Evenings cool down meaningfully once the sun's gone — worth packing alongside the daytime heat gear, especially if you're staying for the Super Stage concerts." },
    ],
  },

  sourcesFooter: "Sources: Austin American-Statesman, Weatherspark, KVUE.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "us-gp-weather-what-to-pack" (weatherGuide)
