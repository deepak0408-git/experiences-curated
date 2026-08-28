// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/WeatherSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block confirmed
// in this file for weather-specific verdicts — no `verdicts` field here.

export const bahrainGpWeatherSpokeContent = {
  intro:
    "October is wet season at Sepang — highs around 30°C, lows around 25°C, roughly 70% chance of rain on any given day, around 27 rainy days a month. This isn't a light-drizzle climate; genuine tropical downpours are common.",

  historicalCallout: {
    label: "2009 — a real wet-weather precedent",
    body:
      "The 2009 Malaysian Grand Prix at this circuit was red-flagged after 31 of 56 laps due to rain, with Jenson Button declared the winner. Genuine wet-weather precedent for this circuit, not a hypothetical.",
  },

  packList: {
    label: "What to pack",
    items: [
      "Rain gear",
      "Sun protection",
      "Light, breathable clothing",
      "A dry bag or sealed pouch for electronics",
    ],
  },

  standCoverage: {
    label: "Which stands are covered",
    rows: [
      { label: "Main Grandstand / K1 / Grandstand F", value: "Fully covered" },
      { label: "Hill Stand C2", value: "Partial canopy only" },
    ],
  },

  forecastBox: {
    ctaText: "Live forecast — weather.com",
  },

  sourcesFooter:
    "Sources: wanderlog.com, holiday-weather.com, BBC Sport / ESPN Africa, Wikipedia.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "sepang-circuit-history" (circuitHistory) — its insiderTips[1] is
//     referenced by this spoke, needs live experience data.
