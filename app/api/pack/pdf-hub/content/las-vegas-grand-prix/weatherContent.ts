// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/WeatherSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} gate anywhere in this
// file — entire spoke content is public/free. No `verdicts` field here.

export const lasVegasGpWeatherSpokeContent = {
  h1: "A night race changes everything about what to pack",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Late November in Las Vegas is a dry desert climate, not a hot one — but every single session at this race runs after dark, and that's what actually matters for what you pack. Every grandstand on the circuit is uncovered, so the cold, not the heat, is the real weather risk here.",

  realNumbersCallout: {
    label: "The real numbers",
    body:
      "Average high 68°F (20°C), average low 43°F (6°C) — a genuinely wide daily swing typical of desert climate. Humidity averages a dry 35-36%, the opposite problem to a race like Singapore's. November sees only around 2.7 rainy days and 0.47in (12mm) of total rainfall for the whole month — rain is a real possibility, not a likely one.",
    forecastLink: {
      label: "AccuWeather — Las Vegas, NV",
      url: "https://www.accuweather.com/en/us/las-vegas/89101/10-day-weather-forecast/329506",
    },
  },

  standExposureCallout: {
    label: "Your grandstand's actual exposure",
    body:
      "Every grandstand at this circuit is uncovered — Main Grandstand, West Harmon, Turn 3, and every General Admission zone alike. The only genuine shelter on the circuit is Skybox, the indoor-lounge hospitality tier positioned above the Main Grandstand, and Paddock Club's covered balcony seating. For everyone else, exposure is about the cold once the sun sets, not sun or rain during the day — daytime highs are mild, and it's the mid-40s°F night wind that catches people out, not the forecast they checked that morning.",
  },

  packList: {
    label: "What to actually pack",
    items: [
      { title: "Layers", detail: "A light top works before sunset; long pants, closed-toe shoes, and a real jacket are needed once qualifying or the race gets underway." },
      { title: "Something waterproof", detail: "November averages only around 2.7 rainy days — pack something lightweight even if you never need it." },
      { title: "Lip balm and moisturizer", detail: "Desert air is dry enough during the day to catch people off guard before evening cold even sets in." },
      { title: "Hearing protection", detail: "F1 cars are loud enough at close range that ear protection is genuinely worth packing, not overcaution, especially at a trackside grandstand." },
    ],
  },

  cashlessCallout: {
    label: "The cashless trap",
    body:
      "The entire event runs cashless — every food, drink, and merchandise purchase on-site is card or mobile payment only. Confirm your card works internationally (if traveling from abroad) before race weekend, not once you're already in line.",
  },

  sourcesFooter:
    "Sources: weatherblaze.com and climatestotravel.com (November climate averages), oversteer48.com and lasvegas.gp official grandstand map (uncovered seating, Skybox/Paddock Club shelter), f1lasvegasgp.com official A-Z Guide (cashless payments).",
};

// No DB-derived data referenced by this spoke — every section here is
// static prose; no linkedExperiences lookups in the source file.
