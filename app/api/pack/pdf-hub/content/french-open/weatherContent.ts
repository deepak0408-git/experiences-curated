// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/WeatherSpoke.tsx), for the Full Pack +
// Travel Brief PDF build. Prose half only, hand-copied not paraphrased. This
// spoke is status="public" with no {isUnlocked && (...)} block — no
// verdicts array.

export const frenchOpenWeatherSpokeContent = {
  h1: "Mild and showery — but the roofs mean play rarely actually stops",

  intro:
    "Late May and early June in Paris run mild rather than hot, with rain that tends to arrive in brief showers rather than day-long downpours. It's a genuinely comfortable tournament to attend weather-wise, with one real complication: the retractable roofs mean rain doesn't guarantee a break in play the way it once did.",

  typicalConditions: {
    label: "Typical conditions",
    rows: [
      { label: "Temperature range", value: "10-21°C (50-70°F), day to night" },
      { label: "Rain", value: "Showery, ~10 rainy days across May, usually brief, not sustained" },
      { label: "Roofs", value: "Chatrier and Lenglen close in about 15 minutes; outer courts pause" },
    ],
  },

  whenItRains: {
    label: "When it rains",
    body:
      "On Chatrier or Lenglen, a shower usually means a short pause while the roof closes, not a cancelled session — the tournament can keep playing under the enclosed roof once it's shut. On the outer courts, there's no roof, so a real shower does pause play there until it passes. Bring a compact umbrella regardless — Roland-Garros permits umbrellas up to 50cm folded length, larger ones must be checked at left luggage.",
  },

  packList: {
    label: "What to pack",
    items: [
      {
        name: "Clothing",
        body:
          "Layers — a t-shirt and a light jacket cover the 10-21°C swing most days. A cap or sun hat for outer-court days with no shade. Comfortable, broken-in walking shoes — the grounds cover real distance between courts, and you'll be on your feet most of the day.",
      },
      {
        name: "Wet weather",
        body:
          "A compact umbrella (50cm folded length maximum) and a proper light waterproof — showers pass quickly but you may be standing outside an enclosed show court while the roof closes. A ziplock or dry pouch for your phone is worth having.",
      },
      {
        name: "On the grounds — what's allowed",
        body:
          "Bags must be 15 litres or smaller — larger bags, backpacks, and suitcases go to left luggage at the entrance. Alcohol is not permitted inside the stadium (banned since 2024 following rowdy fan behaviour), along with glass containers, sharp cutlery, selfie sticks, and water bottles over 1.5 litres. Bringing your own food and non-alcoholic drinks is explicitly allowed and genuinely recommended — a real way to manage cost across a long day (see the Where to Eat guide).",
      },
    ],
  },

  forecastLinkUrl: "https://www.accuweather.com/en/fr/paris/623/10-day-weather-forecast/623",

  sourcesFooter: "Sources: AccuWeather (seasonal norms), rolandgarros.com (bag policy, forbidden objects).",
};

// DB-derived data NOT extracted here — none. This spoke renders no
// linkedExperiences card and computes no DB-derived values (unlike US GP's
// Weather spoke, which links a "weather-what-to-pack" card — the French Open
// Weather spoke source has no SpokeExperienceCard call).
