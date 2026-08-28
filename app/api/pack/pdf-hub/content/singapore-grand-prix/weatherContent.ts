// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/WeatherSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const singaporeGpWeatherSpokeContent = {
  intro:
    "Singapore was declared F1's first-ever official \"heat hazard\" race — real, current recognition of how demanding the heat and humidity genuinely are here, not exaggerated race-weekend colour. The race itself runs at night under floodlights, but the heat and humidity from the day linger long after dark, and October sits right at the start of Singapore's monsoon season.",

  realNumbers: {
    label: "The real numbers",
    body:
      "Average high 31°C (88°F), average low 24°C (75°F), humidity averaging 84% and regularly peaking near 95%. October brings rain on roughly 16 of the month's 31 days, about 194mm total, as the monsoon season begins — short, heavy tropical showers rather than all-day rain, but frequent enough to plan around.",
  },

  grandstandExposure: {
    label: "Your grandstand's actual exposure",
    body:
      "Every grandstand at Marina Bay is uncovered — only Paddock Club and hospitality packages (Turn 3's Green Room being the cheapest of these) have real shelter. Because the race itself runs at night, direct sun isn't the grandstand concern it would be at a daytime race — it's the afternoon heat while queuing and arriving, and the real chance of rain, that matter most. Stamford, Connaught, and Esplanade face east, so the setting sun sits behind you rather than in your eyes during the pre-race hours, a small but genuine comfort difference over a long afternoon. For rain specifically, the sheltered section at the very back of the Esplanade grandstand, near the Coffee Bean, is a real option if a shower hits mid-session — covered, with an unobstructed view of the track. Large and golf-style umbrellas are banned inside every grandstand — a small, compact umbrella is technically permitted, but you can only open it during a genuinely heavy downpour, not casually, since it blocks the view behind you. A poncho is the more practical default for exactly that reason, and Singapore has genuinely had a race disrupted by rain before (2017), so this isn't theoretical.",
  },

  packList: {
    label: "What to actually bring",
    items: [
      { label: "Hydration", body: "Bring a reusable water bottle, refill stations are placed throughout the circuit. A neck fan is a small thing that makes a genuine difference over a full day." },
      { label: "Clothing", body: "Light, breathable clothing. Appropriate footwear matters more than people expect, there's significantly more walking involved between gates, stands, and stages than a typical race weekend." },
      { label: "Rain", body: "When it rains in Singapore, it properly rains. Pack a poncho as the default — large and golf-style umbrellas are banned in every grandstand, and even a permitted small one can only be opened in a genuinely heavy downpour, not casually, since it blocks the view behind you." },
    ],
  },

  paceYourselfNote: {
    label: "Pace yourself",
    body:
      "The heat and humidity can be genuinely draining if you try to pack too much into one day. Most vendors take cards, but carry some cash too, not every stall does.",
  },

  sourcesFooter:
    "Sources: BBC Sport, malaymail.com (heat hazard designation), weather-atlas.com and currentresults.com (October climate averages), weather.com (forecast link), oversteer48.com (grandstand shade/rain exposure), thef1spectator.com (Esplanade shelter, umbrella policy). Verified 3 Aug 2026.",
};
